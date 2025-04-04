import Matter from "matter-js";
import { Renderer } from "./renderer";

export class DebugRenderer extends Renderer {
  #canvas?: HTMLCanvasElement;

  start() {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    this.#canvas = canvas;
    document.body.appendChild(this.#canvas);

    const render = Matter.Render.create({
      canvas,
      engine: this.engine,
      options: {
        wireframeBackground: "transparent",
        height: window.innerHeight,
        width: window.innerWidth,
        showBounds: true,
        showVertexNumbers: true,
        showAxes: true,
        showConvexHulls: true,
        showCollisions: true,
        showInternalEdges: true,
        showSeparations: true,
        showPositions: true,
      },
    });
    Matter.Render.run(render);
  }

  stop() {
    this.#canvas && document.body.removeChild(this.#canvas);
  }
}
