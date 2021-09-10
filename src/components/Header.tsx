import { Divider, Group, Text, Title, ActionIcon, Image } from "@mantine/core"
import "!css/titlebar.css"
import React, { ReactElement } from "react"
import { useNavigate } from "react-router"
import { Icon } from "@iconify/react"

interface Props {}

export default function Header(props: Props): ReactElement {
  return (
    <div className="titlebar">
      <Title order={5} className="px-2">
        Stream Helper
      </Title>
      {/* <Divider orientation="vertical" margins={0} /> */}

      <div className="flex-grow" />
      <div className="titlebar-buttons justify-self-end">
        <ActionIcon className="titlebar-button" title="Minimize" id="titlebar-minimize">
          <Icon icon="far:window-minimize" />
        </ActionIcon>
        <ActionIcon className="titlebar-button" title="Maximize" id="titlebar-maximize">
          <Icon icon="far:window-maximize" />
        </ActionIcon>
        <ActionIcon className="titlebar-button" title="Close" id="titlebar-close">
          <Icon icon="far:xmark" />
        </ActionIcon>
      </div>
    </div>
  )
}
