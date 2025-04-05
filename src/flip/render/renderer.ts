import type { Body, Engine } from "matter-js";

export class Renderer {
  engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }
  /**
   * Begin rendering objects to the screen.
   */
  start(
    _table: { body: Body; elem: HTMLElement },
    _leafBodies: { body: Body; elem: HTMLElement }[],
  ) {
    throw new Error("Not implemented");
  }
  /**
   * Destroy objects, free resources, remove etc from screen.
   */
  stop() {
    throw new Error("Not implemented");
  }
}
