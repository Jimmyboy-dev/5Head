interface API {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   */
  mainWindowReady: Function;
  /**
   * Provide an easier way to listen to events
   */
  on: Function;
  window: {
    close: () => void;
    maximize: () => void;
    minimize: () => void;
  };
  /**
   * Api for controlling the NodeCG Backend.
   */
  nodecg: {
    reload: () => void;
    stop: () => void;
    start: () => void;
    status: () => Promise<NodeCGStatus>;
  };

  config: {
    get: (key: string) => Promise<any>;
    set: (key: string, val: any) => Promise<void>;
  };
}

type NodeCGStatus = "stopped" | "starting" | "running" | "stopping";
