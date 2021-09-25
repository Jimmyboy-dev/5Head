import { Icon } from "@iconify/react"
import { ActionIcon, Image } from "@mantine/core"
import { useBooleanToggle } from "@mantine/hooks"
import { Menu, MenuItem, MenuLabel, Divider, Text } from "@mantine/core"
import React, { ReactElement } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
// import { useDB } from "../lib/hooks"
import Settings from "./Settings"

interface Props {}

const tabs = [
  { name: "Dashboard", path: "/", img: <Image src="/build/icon.png" height={40} width={40} /> },
  { name: "NodeCG", path: "/nodecg", icon: "fas:gauge" },
  { name: "Music", path: "/music", icon: "fas:music-note" },
]

export default function Navigation({}: Props): ReactElement {
  const [currentTab, setTab] = React.useState(0)
  const [settingsOpen, toggleSettings] = useBooleanToggle(false)
  const [logsOpen, toggleLogs] = useBooleanToggle(false)

  // const { data: db } = useDB()
  // const location = useLocation()
  // React.useEffect(() => {
  //   if (window.api?.nodecg) {
  //     if (location.pathname.match(/(nodecg)/gi)) {
  //       window.api.nodecg?.open()
  //     } else {
  //       window.api.nodecg?.close()
  //     }
  //   } else {
  //     console.log("nodecg not existing on window wtf:")
  //   }
  // }, [location])

  return (
    <nav className="sidebar p-2 bg-black">
      {tabs.map((val, i, arr) => (
        <ActionIcon
          component={Link}
          key={val.name}
          onClick={() => {
            setTab(i)
          }}
          style={{ width: "48px", height: "48px" }}
          title={val.name}
          radius="lg"
          to={val.path}
          variant={currentTab == i ? "filled" : "transparent"}>
          {val.img || <Icon icon={val.icon} fontSize={20} />}
        </ActionIcon>
      ))}
      <div className="flex-grow" />
      {
        <ActionIcon
          style={{ width: "48px", height: "48px" }}
          radius="lg"
          title="Logs"
          component={NavLink}
          to="/logs"
          onClick={() => setTab(4)}
          variant={currentTab == 4 ? "filled" : "light"}>
          <Icon icon="fas:terminal" fontSize={20} />
        </ActionIcon>
      }
      <Menu
        control={
          <ActionIcon
            style={{ width: "48px", height: "48px" }}
            key="settingsMenuControl
            "
            radius="lg"
            title="Settings"
            variant={settingsOpen ? "hover" : "transparent"}>
            <Icon className={settingsOpen ? "animate-spin" : ""} icon="far:gear" fontSize={20} />
          </ActionIcon>
        }
        onClick={() => toggleSettings()}
        controlRefProp="elementRef">
        {Settings({ checked: settingsOpen, toggle: toggleSettings })}
      </Menu>
    </nav>
  )
}
