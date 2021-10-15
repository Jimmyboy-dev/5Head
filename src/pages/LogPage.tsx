import { Center, Group } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import React, { ReactElement, useEffect } from "react";

interface Props {}

export default function LogPage({}: Props): ReactElement {
  const [logList, handlers] = useListState<string>([]);
  useEffect(() => {
    const handleNewLog = (_log: Event) => {
      handlers.append(window.logEntry);
    };
    window.addEventListener("onnodecglog", handleNewLog);
    return () => {
      window.removeEventListener("onnodecglog", handleNewLog);
    };
  });
  return (
    <Center
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      }}
      className="rounded-md mx-4 my-2"
    >
      <Group direction="column" position="right" grow>
        {logList.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </Group>
    </Center>
  );
}
