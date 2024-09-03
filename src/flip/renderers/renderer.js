import { Matter } from "../matter.js";

export class Renderer {
  /**
   * @param {Matter.Engine} engine
   */
  constructor(engine) {
    this.engine = engine;
  }
  /**
   * @abstract
   */
  start() {
    throw new Error('Not implemented');
  }
  /**
   * @abstract
   */
  stop() {
    throw new Error('Not implemented');
  }
}
