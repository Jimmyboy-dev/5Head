import { Group } from "@mantine/core"
import React, { ReactElement } from "react"
import "!css/App.css"
import Routes from "./Routes"
import Header from "./components/Header"
import Navigation from "./components/Navigation"

interface Props {}

export default function App(props: Props): ReactElement {
  return (
    <div className="app-root">
      <Header />
      <div className="app-page-root">
        <Navigation />
        <Routes />
      </div>
    </div>
  )
}
