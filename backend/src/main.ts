// Main App process
// Handles Electron container
// Serves requests from client

import { app, BrowserWindow, ipcMain } from 'electron'
import express from 'express'
import path from 'path'
import url from 'url'

import { instanceOfAppError } from 'tinystock-models'

import { configureEvent, addItemEvent, findItemEvent, makeSaleEvent, editItemEvent, deleteItemEvent, changePasswordEvent, importDataEvent, itemsEvent, salesEvent } from './events'

// Prepping Electron
let win: BrowserWindow | null
const createWindow = () => {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    backgroundColor: '#ffffff',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.maximize()
  win.show()

  win.title = 'Hold on...'
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../frontend-dist/index.html`),
      protocol: 'file:',
      slashes: true,
    })
  )
  win.on('closed', () => {
    win = null
  })
}

app?.on('ready', () => {
  createWindow()
})
app?.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // It is common for MacOS apps to keep running
    app.quit()
  }
})
app?.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

// Prepping Express
const expressApp: express.Application = express()
expressApp.use(express.json())
expressApp.use(express.static(path.join(__dirname, '/../../frontend-dist')))
const PORT = 7259

// The client may be a Web browser or an Electron App
// As such, Electron's built in IPC is used to respond to the client
// If there is no Electron client, an Express server is launched to respond to the same requests from a Web browser
// As such, each event function from events.ts is referenced twice below, once for the Electron IPC response, and a second time for the Express Web response

// Event: configure
ipcMain?.on('configure', async (event, body) => {
  try {
    win?.webContents.send('configureResponse', await configureEvent(body))
  } catch (err) {
    win?.webContents.send('configureError', err)
  }
})
expressApp.post('/api/configure', async (req, res) => {
  try {
    res.send(await configureEvent(req.body))
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

// Event: items
ipcMain?.on('items', async (event, body) => {
  try {
    win?.webContents.send('itemsResponse', await itemsEvent(body))
  } catch (err) {
    win?.webContents.send('itemsError', err)
  }
})
expressApp.post('/api/items', async (req, res) => {
  try {
    res.send(await itemsEvent(req.body))
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

// Event: sales
ipcMain?.on('sales', async (event, body) => {
  try {
    win?.webContents.send('salesResponse', await salesEvent(body))
  } catch (err) {
    win?.webContents.send('salesError', err)
  }
})
expressApp.post('/api/sales', async (req, res) => {
  try {
    res.send(await salesEvent(req.body))
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

// Event: addItem
ipcMain?.on('addItem', async (event, body) => {
  try {
    win?.webContents.send('addItemResponse', await addItemEvent(body))
  } catch (err) {
    win?.webContents.send('addItemError', err)
  }
})
expressApp.post('/api/addItem', async (req, res) => {
  try {
    res.send(await addItemEvent(req.body))
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

// Event: findItem
ipcMain?.on('findItem', async (event, body) => {
  try {
    win?.webContents.send('findItemResponse', await findItemEvent(body))
  } catch (err) {
    win?.webContents.send('findItemError', err)
  }
})
expressApp.post('/api/findItem', async (req, res) => {
  try {
    res.send(await findItemEvent(req.body))
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

// Event: editItem
ipcMain?.on('editItem', async (event, body) => {
  try {
    win?.webContents.send('editItemResponse', await editItemEvent(body))
  } catch (err) {
    win?.webContents.send('editItemError', err)
  }
})
expressApp.post('/api/editItem', async (req, res) => {
  try {
    res.send(await editItemEvent(req.body))
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

// Event: deleteItem
ipcMain?.on('deleteItem', async (event, body) => {
  try {
    win?.webContents.send('deleteItemResponse', await deleteItemEvent(body))
  } catch (err) {
    win?.webContents.send('deleteItemError', err)
  }
})
expressApp.post('/api/deleteItem', async (req, res) => {
  try {
    res.send(await deleteItemEvent(req.body))
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

// Event: makeSale
ipcMain?.on('makeSale', async (event, body) => {
  try {
    win?.webContents.send('makeSaleResponse', await makeSaleEvent(body))
  } catch (err) {
    win?.webContents.send('makeSaleError', err)
  }
})
expressApp.post('/api/makeSale', async (req, res) => {
  try {
    res.send(await makeSaleEvent(req.body.dataDir))
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

// Event: changePassword
ipcMain?.on('changePassword', async (event, body) => {
  try {
    win?.webContents.send('changePasswordResponse', await changePasswordEvent(body))
  } catch (err) {
    win?.webContents.send('changePasswordError', err)
  }
})
expressApp.post('/api/changePassword', async (req, res) => {
  try {
    res.send(await changePasswordEvent(req.body))
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

// Event: importData
ipcMain?.on('importData', async (event, body) => {
  try {
    win?.webContents.send('importDataResponse', await importDataEvent(body))
  } catch (err) {
    win?.webContents.send('importDataError', err)
  }
})
expressApp.post('/api/importData', async (req, res) => {
  try {
    res.send(await importDataEvent(req.body))
  } catch (err) {
    if (instanceOfAppError(err)) res.status(400).send(err)
    else res.status(500).send(err)
  }
})

expressApp.get('*', (req, res) => { // For any other Web request, serve up the client
  res.sendFile(path.join(__dirname, '/../../frontend-dist/index.html'))
})

if (!app) { // Only start the server if Electron is not running
  expressApp.listen(process.env.PORT || PORT, () => {
    console.log(`Express server launched (port ${process.env.PORT || PORT})`)
  })
} else console.log(`Electron app launched`)