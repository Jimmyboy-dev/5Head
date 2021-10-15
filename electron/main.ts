import * as installer from "electron-devtools-installer";
// Native
import path, { join } from "path";

// Packages
import "core-js/stable";
import {
  BrowserWindow,
  app,
  ipcMain,
  IpcMainEvent,
  Tray,
  Menu,
  nativeImage,
  shell,
  MenuItem,
} from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import windowStateKeeper from "electron-window-state";
import contextMenu from "electron-context-menu";
import isDev from "electron-is-dev";
import { ChildProcess, fork } from "child_process";
var nodecg: ChildProcess;

import { ElectronAuthProvider } from "@twurple/auth-electron";
import { resolveHtmlPath } from "./util";

const clientId = process.env.VITE_TWITCH_CLIENT_ID || "";
const redirectUri = "http://localhost:9090/login/twitch/auth";

const authProvider = new ElectronAuthProvider({
  clientId,
  redirectUri,
});

export default class AppUpdater {
  constructor() {
    log.transports.file.level = "info";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("5head", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("5head");
}

if (isDev) {
  require("electron-debug")();
}

const installExtensions = async () => {
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS"];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .then((name) => console.log(`Added Extension(s):  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));
};

let tray: Tray;

var bws: {
  window?: BrowserWindow;
  splash?: BrowserWindow;
  nodecg?: BrowserWindow;
} = {};

contextMenu({
  showSaveImageAs: true,
  showInspectElement: isDev,
  showCopyImage: true,
  showCopyImageAddress: true,
  append: (defaultActions, args, browserWindow: BrowserWindow, event) => {
    const menu: Electron.MenuItemConstructorOptions[] = [];
    menu.push({
      label: "Reload Page",
      click: () => {
        browserWindow.webContents.reload();
      },
    });
    return menu;
  },
});
async function nodecgInit(root: string) {
  nodecg = fork(path.join(__dirname, "../", root, "index.js"), {
    cwd: path.join(__dirname, "../", root),
    stdio: ["ipc", "pipe"],
  });

  nodecg.on("error", (err) => {
    console.warn("NodeCG Error:", err);
    bws.window?.webContents.send("nodecgError", err);
  });
  nodecg.stdout?.on("data", (data) => {
    // console.log("[NodeCG]", data.toString())
    bws.window?.webContents.send("nodecgLog", data.toString());
  });
  process.on("exit", nodecg.kill);
}

const height = 600;
const width = 800;
const sWidth = 350;
const sHeight = 400;
async function createWindow(mainState: windowStateKeeper.State) {
  console.log("Development Mode:", isDev);
  if (isDev) {
    await installExtensions();
  }

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
  });
  bws.splash.loadURL(resolveHtmlPath("splashscreen.html"));

  // Wait for styles and other things to load before showing the window
  bws.splash
    .once("ready-to-show", () => {
      bws.splash?.show();
    })
    .on("closed", () => {
      bws.splash = undefined;
    });

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
  });

  bws.window.loadURL(resolveHtmlPath("index.html"));

  bws.window?.on("ready-to-show", () => {
    if (bws.splash) bws.splash.close();
    bws.window?.show();
    if (mainWindowState && bws.window) mainWindowState.manage(bws?.window);
    bws.window?.on("closed", () => {
      bws.window = undefined;
    });
  });

  // bws.window.webContents.setWindowOpenHandler((details) => {
  //   details..preventDefault()
  //   shell.openExternal(url)
  // })

  new AppUpdater();
}

let mainWindowState: windowStateKeeper.State;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Init System Tray
  const icon = nativeImage.createFromPath(
    path.join(__dirname, "../build/icon.png")
  );
  console.log(icon.isEmpty() ? "Icon not found" : "Icon Found");
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: "About", role: "about" },
    {
      label: "NodeCG",
      type: "submenu",
      submenu: [{ label: "Reload" }],
    },
    { label: "Reload App", role: "reload", click: () => app.relaunch() },
    { label: "Quit", role: "close", click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (bws.window?.isFocused()) {
      bws.window?.hide();
    } else {
      bws.window?.show();
    }
  });

  tray.setToolTip("5Head");
  tray.setTitle("5Head");

  // Load the previous state with fallback to defaults
  mainWindowState = windowStateKeeper({
    defaultWidth: width,
    defaultHeight: height,
  });
  createWindow(mainWindowState);

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow(mainWindowState);
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

//// listen the channel `message` and resend the received message to the renderer process

ipcMain.on("backend", (_event: IpcMainEvent, message: string) => {
  if (message === "start" && (!nodecg || nodecg.killed || !nodecg.pid)) {
    nodecgInit(
      process.env.NODECG_ROOT ? process.env.NODECG_ROOT : "nodecg"
    ).then(() => _event.sender.send("backend-reply", "success"));
  } else if (message === "stop") {
    nodecg?.kill();
  }

  // event.reply("backend-reply", "success")
});

ipcMain.on("login", async function (event, msg: string) {
  if (msg.toLowerCase().includes("twitch")) authProvider.allowUserChange();
});

function windowControlHandler(_event: IpcMainEvent, message: any) {
  if (message === "minimize") {
    bws.window?.minimize();
  } else if (message === "maximize" && bws.window?.isMaximized()) {
    bws.window?.unmaximize();
  } else if (message === "maximize") {
    bws.window?.maximize();
  } else if (message === "close") {
    bws.window?.close();
  }
}

ipcMain.on("electron-window-control", windowControlHandler);
// Exit hook to say we are exiting
// import("exit-hook").then(({ default: exitHook }) =>
//   exitHook(() => {
//     console.log("Exiting 5Head...")
//   })
// )
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
