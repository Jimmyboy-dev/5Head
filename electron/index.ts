import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer"
// Native
import path, { join } from "path"

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, Tray, Menu, nativeImage } from "electron"
import windowStateKeeper from "electron-window-state"
import contextMenu from "electron-context-menu"
import isDev from "electron-is-dev"
import { ChildProcess, fork } from "child_process"
var nodecg: ChildProcess
let mainWindowReady: Promise<void> | null = null

// import nodecgConfig from "../nodecg/cfg/nodecg.json"

// try {
//   require("electron-reloader")(module)
// } catch {}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("5head", process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient("5head")
}

let tray

const bws: { window?: BrowserWindow; splash?: BrowserWindow; nodecg?: BrowserWindow } = {}

contextMenu({
  showSaveImageAs: true,
  showInspectElement: isDev,
  showCopyImage: true,
  showCopyImageAddress: true,
})
async function nodecgInit(root) {
  nodecg = fork(path.join(__dirname, "../", root, "index.js"), { cwd: path.join(__dirname, "../", root) })

  nodecg.on("error", (err) => {
    console.warn("NodeCG Error:", err)
    bws.window?.webContents.send("nodecgError", err)
  })
  nodecg.stdout?.on("data", (data) => {
    console.log("NodeCG: ", data.toString())
    bws.window?.webContents.send("nodecgLog", data.toString())
  })
  process.on("exit", nodecg.kill)
}

const height = 600
const width = 800
const sWidth = 350
const sHeight = 400
async function createWindow(mainState: windowStateKeeper.State) {
  console.log("Development Mode:", isDev)
  bws.splash = new BrowserWindow({
    title: "Splashscreen",
    width: sWidth,
    height: sHeight,
    frame: false,
    show: false,
    resizable: false,
    fullscreenable: false,
    icon: join(__dirname, "../build/icon.ico"),
    webPreferences: {
      nativeWindowOpen: true,
      contextIsolation: false,
      spellcheck: true,
      preload: join(__dirname, "startup.js"),
    },
  })
  const port = process.env.PORT || 3000
  const sURL = isDev ? `http://localhost:${port}/splashscreen.html` : join(__dirname, "../src/out/splashscreen.html")

  // load splashscreen.html
  isDev ? bws.splash?.loadURL(sURL) : bws.splash?.loadFile(sURL)

  // Wait for styles and other things to load before showing the window
  bws.splash.once("ready-to-show", () => {
    bws.splash?.show()
  })

  // Load nodecg server as a hidden window w/ service worker
  // bws.nodecg = new BrowserWindow({
  //   skipTaskbar: true,
  //   title: "NodeCG Backend",
  //   show: false,
  //   webPreferences: {
  //     nodeIntegrationInWorker: true,
  //   },
  // })
  // bws.nodecg.loadFile(join(__dirname, "../nodecg/nodecg.html"))

  // Create the browser window.
  bws.window = new BrowserWindow({
    x: mainState.x,
    y: mainState.y,
    title: "5Head Dashboard",
    width: mainState.width,
    height: mainState.height,
    frame: false,
    show: false,
    resizable: true,
    fullscreenable: true,
    icon: join(__dirname, "../build/icon.ico"),
    webPreferences: {
      contextIsolation: false,
      webviewTag: true,
      spellcheck: true,
      nativeWindowOpen: true,
      preload: join(__dirname, "preload.js"),
    },
  })

  const url = isDev ? `http://localhost:${port}` : join(__dirname, "../src/out/index.html")

  isDev ? bws.window?.loadURL(url) : bws.window?.loadFile(url)
  mainWindowReady = new Promise((resolve, reject) => {
    const timeout = setTimeout(reject, 15000)
    bws?.window?.on("ready-to-show", () => {
      clearTimeout(timeout)
      resolve()
    })
  })

  // Open the DevTools.
  // window.webContents.openDevTools();
}

let mainWindowState: windowStateKeeper.State

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Init System Tray
  const icon = nativeImage.createFromPath("../build/icon.png")
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    { label: "About", role: "about" },

    { label: "Reload App", role: "reload" },
    { label: "Quit", role: "close", click: () => app.quit() },
  ])
  tray.setContextMenu(contextMenu)

  tray.setToolTip("5Head is running...")
  tray.setTitle("5Head")

  // Load the previous state with fallback to defaults
  mainWindowState = windowStateKeeper({
    defaultWidth: width,
    defaultHeight: height,
  })

  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err))
  createWindow(mainWindowState)

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow(mainWindowState)
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
ipcMain.on("loaded", (_event: IpcMainEvent, _message: any) => {
  mainWindowReady
    ?.then(() => {
      // console.log(message)
      bws.splash?.close()
      bws.window?.show()
      if (mainWindowState && bws.window) mainWindowState.manage(bws?.window)
    })
    .catch(console.error)

  // setTimeout(() => event.sender.send("loaded", "success"), 500)
})

// ipcMain.on("nodecg", (event: IpcMainEvent, message: any) => {
//   console.log("nodecg:", message)
//   if (message === "open") {
//     if (nodecgView === null) {
//       createNodeCGView()
//     } else if (nodecgView?.webContents.getURL() === `http://localhost:${nodecgPort}`) {
//       nodecgView.webContents.reload()
//     }
//     bws.window?.setBrowserView(nodecgView)
//   } else if (message === "close") {
//     bws.window?.setBrowserView(null)
//   }
//   event.sender.send("nodecg", "success")
// })

ipcMain.on("backend", (_event: IpcMainEvent, message: any) => {
  if (message === "start") {
    nodecgInit(process.env.NODECG_ROOT ? process.env.NODECG_ROOT : "nodecg")
  } else if (message === "stop") {
    nodecg?.kill()
  }

  // event.reply("backend-reply", "success")
})

function windowControlHandler(_event: IpcMainEvent, message: any) {
  if (message === "minimize") {
    bws.window?.minimize()
  } else if (message === "maximize" && bws.window?.isMaximized()) {
    bws.window?.unmaximize()
  } else if (message === "maximize") {
    bws.window?.maximize()
  } else if (message === "close") {
    bws.window?.close()
  }
}

ipcMain.on("electron-window-control", windowControlHandler)

// Exit hook to say we are exiting
import("exit-hook").then(({ default: exitHook }) =>
  exitHook(() => {
    console.log("Exiting 5Head...")
  })
)
// async function createNodeCGView() {
//   nodecgView = new BrowserView({
//     webPreferences: {
//       allowRunningInsecureContent: true,
//       partition: "persist:nodecg",
//       nativeWindowOpen: true,
//     },
//   })
//   const mainSize = bws.window?.getSize()
//   nodecgView.setBounds({
//     x: 64,
//     y: 84,
//     width: (mainSize ? mainSize[0] : width) - 64,
//     height: (mainSize ? mainSize[1] : height) - 84,
//   })
//   nodecgView.setAutoResize({ width: true, height: true })
//   nodecgView.webContents.loadURL(`http://localhost:${nodecgPort}`).catch((err) => {
//     nodecgView?.webContents.insertText(err)
//   })
// }
