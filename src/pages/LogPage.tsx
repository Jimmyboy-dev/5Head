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
        maxHeight: "100%",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      }}
      className="rounded-md mx-4 my-2"
    >
      <Group direction="column" position="left" className="bottom-2">
        {logList.map((log, index) => (
          <LogLine log={log} key={index} />
        ))}
      </Group>
    </Center>
  );
}

interface LogProps {
  log: string;
}
const LogLine = (props: LogProps) => {
  return <div>{props.log}</div>;
};
