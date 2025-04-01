import type { Matter } from "../matter";

export class Renderer {
  engine: Matter.Engine;

  constructor(engine: Matter.Engine) {
    this.engine = engine;
  }
  start() {
    throw new Error("Not implemented");
  }
  stop() {
    throw new Error("Not implemented");
  }
}
