import { ipcRenderer, contextBridge } from "electron"

declare global {
  interface Window {
    Main: typeof api
    ipcRenderer: typeof ipcRenderer
  }
}

export const api = {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   */
  mainWindowReady: (message: string) => {
    ipcRenderer.send("loaded", message)
  },
  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },
}
contextBridge.exposeInMainWorld("Main", api)
/**
 * Using the ipcRenderer directly in the browser through the contextBridge ist not really secure.
 * I advise using the Main/api way !!
 */
contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer)

window.addEventListener("contextmenu", (e) => {
  e.preventDefault()
  ipcRenderer.send("show-context-menu")
})

ipcRenderer.on("context-menu-command", (e, command) => {
  console.log("context-menu-command", command, e)
})
