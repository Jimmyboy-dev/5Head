import { Icon } from "@iconify/react"
import { Checkbox, Menu } from "@mantine/core"
import React, { ChangeEventHandler, forwardRef, ReactElement } from "react"

interface Props {
  checked: boolean
  toggle: (value?: React.SetStateAction<boolean> | undefined) => void
}

const Settings = (props: Props) => [
  <Menu.Item key="label">Settings</Menu.Item>,
  <Menu.Item icon={<Icon icon="far:terminal" key="logger" />}>
    <Checkbox label="Enable Logger" checked={props.checked} onChange={() => props.toggle} />
  </Menu.Item>,
]

export default Settings
