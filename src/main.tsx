import React from "react"
import ReactDOM from "react-dom"
import { MantineProvider, NormalizeCSS, GlobalStyles, Group } from "@mantine/core"
import theme from "./theme"
import App from "./App"
import { BrowserRouter as Router } from "react-router-dom"

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <GlobalStyles />
      <NormalizeCSS />
      <Router>
        <App />
      </Router>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

// document.addEventListener("DOMContentLoaded", () => {
//   window.Main.mainWindowReady("loaded")
// })
