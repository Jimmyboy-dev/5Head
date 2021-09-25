import { useListState } from "@mantine/hooks"
import React, { ReactElement } from "react"

interface Props {}

export default function LogPage({}: Props): ReactElement {
  const [logList, handlers] = useListState([])
  const newLogHandler = (e: string) => handlers.append(e)
  return <div></div>
}
