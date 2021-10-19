if (process.env.VITE_APP_VERSION === undefined) {
  const now = new Date();
  process.env.VITE_APP_VERSION = `${now.getUTCFullYear() - 2000}.${
    now.getUTCMonth() + 1
  }.${now.getUTCDate()}-${now.getUTCHours() * 60 + now.getUTCMinutes()}`;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  productName: "5Head",
  appId: "app.jimmyboy.fivehead",
  asar: true,
  directories: {
    output: "dist",
    buildResources: "build",
  },
  files: ["main", "src/out", "build/icon.*"],
  mac: {
    category: "public.app-category.utilities",
    target: ["default", "dmg", "zip"],
  },
  win: {
    target: ["nsis", "msi"],
  },
  linux: { target: ["AppImage", "deb", "rpm"] },
  publish: [{ provider: "github" }],
  nodeVersion: "current",
};
module.exports = config;
