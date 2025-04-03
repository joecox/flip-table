import type { Matter } from "../matter";

export class Renderer {
  engine: Matter.Engine;

  constructor(engine: Matter.Engine) {
    this.engine = engine;
  }
  /**
   * Begin rendering objects to the screen.
   */
  start() {
    throw new Error("Not implemented");
  }
  /**
   * Destroy objects, free resources, remove etc from screen.
   */
  stop() {
    throw new Error("Not implemented");
  }
}
