import { ChildProcess } from "child_process"

export class NodeCG extends ChildProcess {
  constructor(options: any) {
    const processOptions = {
      ...options,
      stdio: "pipe",
    }
    super(processOptions)
  }
}
