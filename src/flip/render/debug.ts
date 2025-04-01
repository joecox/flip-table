import { Matter } from "../matter";
import { Renderer } from "./renderer";

export class DebugRenderer extends Renderer {
  #canvas?: HTMLCanvasElement;

  start() {
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    this.#canvas = canvas;
    document.body.appendChild(this.#canvas);

    const render = Matter.Render.create({
      canvas,
      engine: this.engine,
      options: {
        height: window.innerHeight,
        width: window.innerWidth,
      },
    });
    Matter.Render.run(render);
  }

  stop() {
    this.#canvas && document.body.removeChild(this.#canvas);
  }
}
