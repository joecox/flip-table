import { debugFlip, resetFlip, startFlip } from "../events";
import { freezeViewport, unfreezeViewport } from "../freezeViewport";
import { Physics } from "./physics";
import { DomRenderer } from "./render/dom";

let physics: Physics | undefined;

export async function addFlipListeners(debug = false) {
  document.addEventListener(
    startFlip.type, (ev) => {
      if (ev.target instanceof HTMLElement) {
        freezeViewport();
        physics = new Physics();
        physics.flip(ev.target, DomRenderer);
      }
    }
  )

  if (debug) {
    const { DebugRenderer } = await import("./render/debug");
    document.addEventListener(
      debugFlip.type, (ev) => {
        if (ev.target instanceof HTMLElement) {
          freezeViewport();
          physics = new Physics();
          physics.flip(ev.target, DebugRenderer);
        }
      }
    )
  }

  document.addEventListener(
    resetFlip.type, () => {
      unfreezeViewport();
      physics?.stop();
    }
  )
}
