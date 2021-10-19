import { Button, Group, Title } from "@mantine/core";
import React, { ReactElement } from "react";
import { useNodeCGStatus } from "../lib/hooks";

interface Props {}

export default function NodeCGControl({}: Props): ReactElement {
  const status = useNodeCGStatus();
  return (
    <Group direction="row">
      <Button
        variant="gradient"
        loading={status.match(/(starting|stopping)/g) != null}
        gradient={{ from: "indigo", to: "cyan" }}
      >
        {status === "running" && "Stop"}
        {status === "stopped" && "Start"}
        {status === "starting" && "Starting..."}
        {status === "stopping" && "Stopping..."}
      </Button>
      <Button
        variant="gradient"
        disabled={!status.includes("running")}
        gradient={{ from: "cyan", to: "indigo" }}
      >
        Restart
      </Button>
      <Title order={5} className="px-2">
        Overlays Status:
      </Title>
      <div
        className={`mr-2 border border-green-300 rounded-full ${
          status === "stopped" ? "bg-red-500" : "bg-green-500"
        } w-4 h-4 self-center text`}
      ></div>
    </Group>
  );
}
