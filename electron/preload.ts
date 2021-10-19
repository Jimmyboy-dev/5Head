import { ipcRenderer } from "electron";
import { join } from "path";

const logEvent = new Event("onnodecglog");
declare global {
  interface Window {
    api: API;
    // ipcRenderer: typeof ipcRenderer
    __devtron: typeof nodeInt;
    logEntry: string;
    // db: Low<dbData>
  }
}

export const api: API = {
  mainWindowReady: (message: string) => {
    // ipcRenderer.send("loaded", message)
    return message;
  },

  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },

  window: {
    close: () => ipcRenderer.send("electron-window-control", "close"),
    maximize: () => ipcRenderer.send("electron-window-control", "maximize"),
    minimize: () => ipcRenderer.send("electron-window-control", "minimize"),
  },

  nodecg: {
    reload: () => ipcRenderer.send("nodecg-reload"),
    stop: () => ipcRenderer.send("nodecg-stop"),
    start: () => ipcRenderer.send("nodecg-start"),
    status: async () => await ipcRenderer.invoke("nodecg-status"),
  },
  config: {
    get: async (key: string) => await ipcRenderer.invoke("getStoreValue", key),
    set: async (key: string, value: string) =>
      await ipcRenderer.invoke("setStoreValue", key, value),
  },
};
export const nodeInt = { require: require, process: process };
window.api = api;

if (process.env.NODE_ENV === "development") {
  window.__devtron = nodeInt;
}

ipcRenderer.on("nodecgLog", (_, data: string) => {
  window.logEntry = data;
  window.dispatchEvent(logEvent);
});
ipcRenderer.on("nodecgError", (_, err: string) => {
  window.logEntry = err;
  window.dispatchEvent(logEvent);
});

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
