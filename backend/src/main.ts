import { app, BrowserWindow } from 'electron'
import express from 'express'
import path from 'path'

import { validateDataDir, addItem, findItem, makeSale, editItem, deleteItem } from './funcs'
import { AppError, AppErrorCodes, instanceOfAppError, instanceOfItem, instanceOfAdjustment } from 'tinystock-models'
import { readItems } from './io'

const PORT = 7259

let win: BrowserWindow | null

const createWindow = () => {
  win = new BrowserWindow({
    width: 600,
    height: 600,
    backgroundColor: '#ffffff',
    autoHideMenuBar: true,
    //icon: `file://...`
  })

  win.title = 'Hold on...'
  win.loadURL(`http://localhost:${process.env.PORT || PORT}`)
  win.on('closed', () => {
    win = null
  })
}

if (app) {
  app.on('ready', () => {
    createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { // It is common for MacOS apps to keep running
      app.quit()
    }
  })

  app.on('activate', () => {
    if (win === null) {
      createWindow()
    }
  })
}

const expressApp: express.Application = express()

expressApp.use(express.json())
expressApp.use(express.static(path.join(__dirname, "/../../frontend-dist")))

expressApp.post("/api/validateDataDir", async (req, res) => {
  try {
    if (req.body.dataDir == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
    if (typeof req.body.dataDir != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    validateDataDir(req.body.dataDir)
    res.send()
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

expressApp.post('/api/items', async (req, res) => {
  try {
    if (req.body.dataDir == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
    if (typeof req.body.dataDir != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    res.send(readItems(req.body.dataDir))
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

expressApp.post("/api/addItem", async (req, res) => {
  try {
    if (req.body.item == undefined || req.body.dataDir == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
    if (typeof req.body.dataDir != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    if (!instanceOfItem(req.body.item)) throw new AppError(AppErrorCodes.INVALID_ITEM)
    addItem(req.body.dataDir, req.body.item)
    res.send()
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

expressApp.post("/api/findItem", async (req, res) => {
  try {
    if (req.body.code == undefined || req.body.dataDir == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
    if (typeof req.body.dataDir != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    if (typeof req.body.code != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    res.send(findItem(req.body.dataDir, req.body.code, typeof req.body.setQuantity == 'number' ? req.body.setQuantity : null))
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

expressApp.post("/api/editItem", async (req, res) => {
  try {
    if (req.body.item == undefined || req.body.dataDir == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
    if (typeof req.body.dataDir != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    if (!instanceOfItem(req.body.item)) throw new AppError(AppErrorCodes.INVALID_ITEM)
    editItem(req.body.dataDir, req.body.item)
    res.send()
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

expressApp.post("/api/deleteItem", async (req, res) => {
  try {
    if (req.body.code == undefined || req.body.dataDir == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
    if (typeof req.body.dataDir != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    if (typeof req.body.code != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    deleteItem(req.body.dataDir, req.body.code, typeof req.body.setQuantity == 'number' ? req.body.setQuantity : null)
    res.send()
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

expressApp.post("/api/makeSale", async (req, res) => {
  try {
    if (req.body.saleItems == undefined || req.body.adjustments == undefined || req.body.dataDir == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
    if (typeof req.body.dataDir != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    if (!Array.isArray(req.body.saleItems)) throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    if (!Array.isArray(req.body.adjustments)) throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    for (let i = 0; i < req.body.saleItems.length; i++)
      if (!instanceOfItem(req.body.saleItems[i])) throw new AppError(AppErrorCodes.INVALID_ITEM)
    for (let i = 0; i < req.body.adjustments.length; i++)
      if (!instanceOfAdjustment(req.body.adjustments[i])) throw new AppError(AppErrorCodes.INVALID_ADJUSTMENT)
    res.send(makeSale(req.body.dataDir, req.body.saleItems, req.body.adjustments))
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

expressApp.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../../frontend-dist/index.html"))
})

expressApp.listen(process.env.PORT || PORT, () => {
  console.log(`Running (port ${process.env.PORT || PORT})`)
})