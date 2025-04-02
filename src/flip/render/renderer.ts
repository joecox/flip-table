import { World } from "@dimforge/rapier2d";

export class Renderer {
  world: World;

  constructor(world: World) {
    this.world = world;
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
