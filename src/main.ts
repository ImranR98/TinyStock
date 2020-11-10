import { app, BrowserWindow } from 'electron'
import express from 'express'
import path from 'path'

import { addItem, findItem, makeSale } from './funcs'
import { AppError, AppErrorCodes, instanceOfItem, instanceOfSale } from './models'

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
expressApp.use(express.static(path.join(__dirname, "/../frontend/dist/frontend")))

expressApp.get("/api/hello", async (req, res) => {
  res.send({ data: "Hello World" })
})

expressApp.get("/api/addItem", async (req, res) => {
  try {
    if (req.body.item == undefined || req.body.dataDir == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
    if (typeof req.body.dataDir != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    if (!instanceOfItem(req.body.item)) throw new AppError(AppErrorCodes.INVALID_ITEM)
    addItem(req.body.dataDir, req.body.item)
    res.send()
  } catch (err) {
    res.status(400).send(err)
  }
})

expressApp.get("/api/findItem", async (req, res) => {
  try {
    if (req.body.code == undefined || req.body.dataDir == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
    if (typeof req.body.dataDir != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    if (typeof req.body.code != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    findItem(req.body.dataDir, req.body.code, typeof req.body.setQuantity == 'number' ? req.body.setQuantity : null)
    res.send()
  } catch (err) {
    res.status(400).send(err)
  }
})

expressApp.get("/api/makeSale", async (req, res) => {
  try {
    if (req.body.sale == undefined || req.body.dataDir == undefined) throw new AppError(AppErrorCodes.MISSING_ARGUMENT)
    if (typeof req.body.dataDir != 'string') throw new AppError(AppErrorCodes.INVALID_ARGUMENT)
    if (!instanceOfItem(req.body.sale)) throw new AppError(AppErrorCodes.INVALID_SALE)
    addItem(req.body.dataDir, req.body.sale)
    res.send()
  } catch (err) {
    res.status(400).send(err)
  }
})

expressApp.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../frontend/dist/frontend/index.html"))
})

expressApp.listen(process.env.PORT || PORT, () => {
  console.log(`Running (port ${process.env.PORT || PORT})`)
})