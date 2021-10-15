import { Center } from "@mantine/core";
import React, { createRef, ReactElement } from "react";

interface Props {}

export default function NodeCG({}: Props): ReactElement {
  const webviewRef = createRef<Electron.WebviewTag>();
  return (
    <Center className="w-full h-full">
      <webview
        className="w-full h-full"
        src={`http://localhost:${import.meta.env.VITE_NODECG_PORT}`}
        partition="persist:nodecg"
        plugins="true"
      ></webview>
    </Center>
  );
}
