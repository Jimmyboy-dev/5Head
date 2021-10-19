import { BrowserWindow, ipcMain } from "electron";

import { download } from "electron-dl";

ipcMain.handle("download-button", async (event, { url }) => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) return await download(win, url);
});
