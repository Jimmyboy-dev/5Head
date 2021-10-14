interface API {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   */
  mainWindowReady: Function
  /**
   * Provide an easier way to listen to events
   */
  on: Function
  window: {
    close: Function
    maximize: Function
    minimize: Function
  }
  /**
   * Api for controlling the NodeCG Backend.
   */
  nodecg: {
    reload: Function
    stop: Function
    start: Function
  }
}
