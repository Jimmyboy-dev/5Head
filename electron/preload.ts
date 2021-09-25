import { ipcRenderer } from "electron"
// import { join } from "path"
// import { dbData } from "./db"
// import { Low, JSONFile } from "lowdb"

// import "electron-cookies"

// var db = new Low<dbData>(new JSONFile<dbData>("db.json"))
// db.read().then(() => {
//   db.data ||= { logLevel: "info", logPath: join(__dirname, "logs"), userSettings: { loggerPage: false } }
//   console.log("db loaded:\n", db.data)
//   window.db = db
// })

const logEvent = new Event("onnodecglog")
declare global {
  interface Window {
    api: typeof api
    // ipcRenderer: typeof ipcRenderer
    __devtron: typeof nodeInt
    logEntry: string
    // db: Low<dbData>
  }
}

export const api = {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   */
  mainWindowReady: (message: string) => {
    // ipcRenderer.send("loaded", message)
    return message
  },
  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },
  /**
   * Tell Main process to open or close (hide) the nodecg browser view.
   */
  nodecg: {
    open: () => {
      ipcRenderer.send("nodecg", "open")
    },
    close: () => {
      ipcRenderer.send("nodecg", "close")
    },
  },
  window: {
    close: () => ipcRenderer.send("electron-window-control", "close"),
    maximize: () => ipcRenderer.send("electron-window-control", "maximize"),
    minimize: () => ipcRenderer.send("electron-window-control", "minimize"),
  },
}
export const nodeInt = { require: require, process: process }
window.api = api

if (process.env.NODE_ENV === "development") {
  window.__devtron = nodeInt
}

ipcRenderer.on("nodecgLog", (_, data: string) => {
  window.logEntry = data
  window.dispatchEvent(logEvent)
})
ipcRenderer.on("nodecgError", (_, err: string) => {
  window.logEntry = err
  window.dispatchEvent(logEvent)
})

/**
 * Using the ipcRenderer directly in the browser through the contextBridge ist not really secure.
 * I advise using the Main/api way !!
 */
// contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer)

// window.addEventListener("contextmenu", (e) => {
//   e.preventDefault()
//   ipcRenderer.send("show-context-menu")
// })

// ipcRenderer.on("context-menu-command", (e, command) => {
//   console.log("context-menu-command", command, e)
// })
