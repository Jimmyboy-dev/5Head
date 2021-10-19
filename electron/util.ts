import { URL } from "url";
import isDev from "electron-is-dev";
import path from "path";

export let resolveHtmlPath: (htmlFileName: string) => string;

if (isDev) {
  const port = process.env.PORT || 3000;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.join(__dirname, "../src/out/", htmlFileName)}`;
  };
}
