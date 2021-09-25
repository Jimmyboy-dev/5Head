import { Divider, Group, Text, Title, ActionIcon, Image } from "@mantine/core"
import "!css/titlebar.css"
import React, { ReactElement } from "react"
import { useNavigate } from "react-router"
import { Icon } from "@iconify/react"

interface Props {}

export default function Header(props: Props): ReactElement {
  const nodeCGStatus = "good"
  return (
    <div className=" flex flex-col">
      <div className="window-drag bg-gray-700 flex flex-row h-6 ">
        <div className="flex-grow" />
        <div className="titlebar-buttons justify-self-end">
          <ActionIcon
            className="titlebar-button h-4 w-5"
            title="Minimize"
            id="titlebar-minimize"
            onClick={window?.api?.window.minimize}>
            <Icon icon="far:window-minimize" />
          </ActionIcon>
          <ActionIcon
            className="titlebar-button h-4 w-5"
            title="Maximize"
            id="titlebar-maximize"
            onClick={window?.api?.window.maximize}>
            <Icon icon="far:window-maximize" />
          </ActionIcon>
          <ActionIcon
            className="titlebar-button h-4 w-5"
            title="Close"
            id="titlebar-close"
            onClick={window?.api?.window.close}>
            <Icon icon="far:xmark" />
          </ActionIcon>
        </div>
      </div>
      <div className="titlebar">
        <Title order={3} className="px-2">
          5Head
        </Title>
        {/* <Divider orientation="vertical" margins={0} /> */}

        <div className="flex-grow" />
        <Title order={5} className="px-2">
          Overlays Status:
        </Title>
        <div
          className={`mr-2 border border-green-300 rounded-full ${
            nodeCGStatus === "error" ? "bg-red-500" : "bg-green-500"
          } w-4 h-4 self-center text`}></div>
      </div>
    </div>
  )
}
