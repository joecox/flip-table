import * as PIXI from "pixi.js";
import { Renderer } from "./renderer";
import { World } from "@dimforge/rapier2d";
import { Meter, toPixel } from "../units";

export class DebugRenderer extends Renderer {
  #canvas?: HTMLCanvasElement;
  #pixiApp: PIXI.Application;
  #lines: PIXI.Graphics;

  constructor(world: World) {
    super(world);

    this.#pixiApp = new PIXI.Application();
    this.#lines = new PIXI.Graphics();
    this.#pixiApp.stage.addChild(this.#lines)
  }

  async start() {
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    this.#canvas = canvas;

    await this.#pixiApp.init({ canvas, resizeTo: window, autoStart: false });

    this.#pixiApp.ticker.add(() => {
      this.#lines.clear();

      const { vertices, colors } = this.world.debugRender();
      for (let i = 0; i < vertices.length / 4; i += 1) {
        const color = PIXI.Color.shared.setValue([colors[i * 8], colors[i * 8 + 1], colors[i * 8 + 2], colors[i * 8 + 3]]);
        this.#lines.moveTo(
          toPixel(vertices[i * 4] as Meter),
          toPixel(vertices[i * 4 + 1] as Meter)
        );
        this.#lines.lineTo(
          toPixel(vertices[i * 4 + 2] as Meter),
          toPixel(vertices[i * 4 + 3] as Meter),
        );
        this.#lines.stroke({ color, pixelLine: true })
      }
    })

    document.body.appendChild(this.#pixiApp.canvas);
    this.#pixiApp.start();
  }

  stop() {
    this.#pixiApp.destroy();
    this.#canvas && document.body.removeChild(this.#canvas);
  }
}
