import reactRefresh from "@vitejs/plugin-react-refresh"
import { UserConfig, ConfigEnv } from "vite"
const { resolve } = require("path")

import { join } from "path"

const srcRoot = join(__dirname, "src")

export default ({ command }: ConfigEnv): UserConfig => {
  // DEV
  if (command === "serve") {
    return {
      base: "/",
      plugins: [reactRefresh()],
      resolve: {
        alias: {
          "/@": srcRoot,
          "!css": "/src/styles",
        },
      },
      build: {
        outDir: join(srcRoot, "/out"),
        emptyOutDir: true,
        rollupOptions: {
          input: {
            main: resolve(__dirname, "index.html"),
            splashscreen: resolve(__dirname, "splashscreen.html"),
          },
        },
      },
      server: {
        port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
      },
      optimizeDeps: {
        auto: true,
        exclude: ["path"],
      },
    }
  }
  // PROD
  else {
    return {
      base: `${__dirname}/src/out/`,
      plugins: [reactRefresh()],
      resolve: {
        alias: {
          "/@": srcRoot,
          "!css": "/src/styles",
        },
      },
      build: {
        outDir: join(srcRoot, "/out"),
        emptyOutDir: true,
        rollupOptions: {
          input: {
            main: resolve(__dirname, "index.html"),
            splashscreen: resolve(__dirname, "splashscreen.html"),
          },
        },
      },
      server: {
        port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
      },
      optimizeDeps: {
        auto: true,
        exclude: ["path"],
      },
    }
  }
}