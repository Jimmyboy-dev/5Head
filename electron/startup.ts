import { ipcRenderer } from "electron"

declare global {
  interface Window {
    eApi: typeof api
  }
}

let api = {
  startNodeCG: async () => {
    ipcRenderer.send("backend", "start")
    ipcRenderer.once("backend-reply", (_event, _arg) => {
      ipcRenderer.send("loaded")
    })
    // ipcRenderer.send("loaded")
    return "NodeCG Backend Loaded"
  },
}

window.eApi = api
