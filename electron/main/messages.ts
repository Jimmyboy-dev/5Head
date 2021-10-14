import { IpcMainEvent } from "electron"

export default function (ipcMain: Electron.IpcMain, app: Electron.App, bws: { [key: string]: Electron.BrowserWindow }) {
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.

  // listen the channel `message` and resend the received message to the renderer process
  ipcMain.on("loaded", (_event: IpcMainEvent, _message: any) => {
    const show = () => {
      // console.log(message)
      bws.splash?.close()
      bws.window?.show()
      if (mainWindowState && bws.window) mainWindowState.manage(bws?.window)
    }
    if (mainWindowReady) show()
    else {
      var waitingForWindowReady = setInterval(() => {
        if (mainWindowReady) {
          clearInterval(waitingForWindowReady)
          show()
        }
      }, 250)
    }

    // setTimeout(() => event.sender.send("loaded", "success"), 500)
  })

  ipcMain.on("backend", (_event: IpcMainEvent, message: string) => {
    if (message === "start" && (!nodecg || nodecg.killed || !nodecg.pid)) {
      nodecgInit(process.env.NODECG_ROOT ? process.env.NODECG_ROOT : "nodecg").then(() =>
        _event.sender.send("backend-reply", "success")
      )
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

  ipcMain.on("login", async function (event, msg: string) {
    if (msg.toLowerCase().includes("twitch")) authProvider.allowUserChange()
  })
}
