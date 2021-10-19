import { ChildProcess, fork, ForkOptions } from "child_process";
import { EventEmitter } from "stream";

export class NodeCG extends EventEmitter {
  process: ChildProcess;
  status: NodeCGStatus = "starting";
  constructor(url: string, options: ForkOptions) {
    super();
    const processOptions: ForkOptions = {
      ...options,
      stdio: "pipe",
    };
    this.registerLog.bind(this);
    this.process = fork(url, processOptions);
  }

  kill = () => {
    this.status = this.process.kill() ? "stopped" : "stopping";
  };

  registerLog = () => {
    process.on("error", (err) => {
      console.warn("NodeCG Error:", err);
      // bws.window?.webContents.send("nodecgError", err);
    });
    process.stdout?.on("data", (data) => {
      // console.log("[NodeCG]", data.toString())
      // bws.window?.webContents.send("nodecgLog", data.toString());
    });
    process.on("exit", process.kill);
  };
}
