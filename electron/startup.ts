import { ipcRenderer } from "electron"

declare global {
  interface Window {
    eApi: typeof api
  }
}

let api = {
  startNodeCG: async () => {
    ipcRenderer.send("backend", "start")
    ipcRenderer.once("backend-reply", (_event, arg) => {
      if (arg === "success") ipcRenderer.send("loaded")
      else console.error(arg)
    })
    // ipcRenderer.send("loaded")
    return "success"
  },
}

window.eApi = api
