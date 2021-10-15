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
  name: "five-head",
  productName: "5Head Manager",
  appId: "app.jimmyboy.fivehead",
  asar: true,
  directories: {
    output: "dist",
    buildResources: "build",
  },
  files: ["main", "src/out"],
  extraMetadata: {
    version: process.env.VITE_APP_VERSION,
  },
};
module.exports = config;
