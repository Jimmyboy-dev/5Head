import { Center } from "@mantine/core"
import React, { ReactElement } from "react"
import Iframe from "react-iframe"

interface Props {}

export default function NodeCG({}: Props): ReactElement {
  return (
    <Center className="w-full h-full">
      <webview className="w-full h-full" src={`http://localhost:${import.meta.env.VITE_NODECG_PORT}`}></webview>
    </Center>
  )
}
