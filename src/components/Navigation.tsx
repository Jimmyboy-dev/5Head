import { Icon } from "@iconify/react"
import { ActionIcon, Image } from "@mantine/core"
import { useBooleanToggle } from "@mantine/hooks"
import { Menu, MenuItem, MenuLabel, Divider, Text } from "@mantine/core"
import React, { ReactElement } from "react"
import { Link } from "react-router-dom"

interface Props {}

const tabs = [
  { name: "Dashboard", path: "/", img: <Image src="/icon.png" height={40} width={40} /> },
  { name: "NodeCG", path: "/nodecg", icon: "fas:gauge" },
  { name: "Music", path: "/music", icon: "fas:music-note" },
]

export default function Navigation({}: Props): ReactElement {
  const [currentTab, setTab] = React.useState(0)
  const [settingsOpen, toggleSettings] = useBooleanToggle(false)

  return (
    <nav className="sidebar p-2 bg-black">
      {tabs.map((val, i, arr) => (
        <ActionIcon
          component={Link}
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
      <Menu
        control={
          <ActionIcon
            style={{ width: "48px", height: "48px" }}
            radius="lg"
            title="Settings"
            variant={settingsOpen ? "hover" : "transparent"}>
            <Icon className={settingsOpen ? "animate-spin" : ""} icon="far:gear" fontSize={20} />
          </ActionIcon>
        }
        onClick={() => toggleSettings()}
        controlRefProp="elementRef">
        <Menu.Label>Settings</Menu.Label>
        <Menu.Item icon={<Icon icon="far:signin" />}>Sign In</Menu.Item>
      </Menu>
    </nav>
  )
}
