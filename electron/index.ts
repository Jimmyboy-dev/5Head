import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer"
// Native
import { join } from "path"

// Packages
import { BrowserWindow, BrowserView, app, ipcMain, IpcMainEvent, session } from "electron"

import isDev from "electron-is-dev"
import nodecgConfig from "../nodecg/cfg/nodecg.json"

const nodecgPort = nodecgConfig.port
const ses = session.fromPartition("persist:nodecg")

const windows: { window?: BrowserWindow; splash?: BrowserWindow } = {}

const height = 600
const width = 800
const sWidth = 350
const sHeight = 400
async function createWindow() {
  windows.splash = new BrowserWindow({
    title: "Splashscreen",
    width: sWidth,
    height: sHeight,
    frame: false,
    show: true,
    resizable: false,
    fullscreenable: false,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  })
  const port = process.env.PORT || 3000
  const sURL = isDev ? `http://localhost:${port}/splashscreen` : join(__dirname, "../src/out/splashscreen.html")
  // load splashscreen.html
  isDev ? windows.splash?.loadURL(sURL) : windows.splash?.loadFile(sURL)
  // Create the browser window.
  windows.window = new BrowserWindow({
    title: "5Head Dashboard",
    width: width,
    height: height,
    frame: false,
    show: false,
    resizable: true,
    fullscreenable: true,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  })

  const url = isDev ? `http://localhost:${port}` : join(__dirname, "../src/out/index.html")

  isDev ? windows.window?.loadURL(url) : windows.window?.loadFile(url)

  windows.window.once("ready-to-show", () => {
    windows.splash?.close()
    windows.window?.show()
  })
  // Open the DevTools.
  // window.webContents.openDevTools();
}

async function createNodeCGView() {
  const nodeCGView = new BrowserView({
    webPreferences: {
      session: ses,
    },
  })
  windows.window?.setBrowserView(nodeCGView)
  nodeCGView.setBounds({ x: 72, y: 25, width: width - 72, height: height - 25 })
  nodeCGView.setAutoResize({ width: true, height: true })
  nodeCGView.webContents.loadURL(`http://localhost:${nodecgPort}`).catch((err) => {
    nodeCGView.webContents.insertText(err)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err))
  createWindow().then(createNodeCGView)

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("loaded", (event: IpcMainEvent, message: any) => {
  console.log(message)
  windows.window?.show()
  windows.splash?.close()
  setTimeout(() => event.sender.send("loaded", "success"), 500)
})
