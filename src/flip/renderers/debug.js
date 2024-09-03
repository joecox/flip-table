import { Matter } from "../matter.js";
import { Renderer } from "./renderer.js";

const canvas = document.createElement('canvas');
canvas.style.position = 'absolute';
canvas.style.inset = '0';

export class DebugRenderer extends Renderer {
  start() {
    document.body.appendChild(canvas);
    const render = Matter.Render.create({
      canvas,
      engine: this.engine,
      options: {
        height: window.innerHeight,
        width: window.innerWidth,
      }
    });
    Matter.Render.run(render);
  }

  stop() {
    canvas.remove();
  }
}
