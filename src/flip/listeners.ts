import { debugFlip, resetFlip, startFlip } from "../events";
import { freezeViewport, unfreezeViewport } from "../freezeViewport";
import { Flipper } from "./flipper";
import { DomRenderer } from "./render/dom";

let flipper: Flipper | undefined;

export async function addFlipListeners(debug = false) {
  document.addEventListener(
    startFlip.type, (ev) => {
      if (ev.target instanceof HTMLElement) {
        freezeViewport();
        flipper = new Flipper();
        flipper.flip(ev.target, DomRenderer);
      }
    }
  )

  if (debug) {
    const { DebugRenderer } = await import("./render/debug");
    document.addEventListener(
      debugFlip.type, (ev) => {
        if (ev.target instanceof HTMLElement) {
          freezeViewport();
          flipper = new Flipper();
          flipper.flip(ev.target, DebugRenderer);
        }
      }
    )
  }

  document.addEventListener(
    resetFlip.type, () => {
      unfreezeViewport();
      flipper?.stop();
    }
  )
}
