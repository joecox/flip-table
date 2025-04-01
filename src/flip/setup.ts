import { freezeViewport, unfreezeViewport } from "../freezeViewport";
import { Flipper } from "./physics";
import { DebugRenderer } from "./render/debug";
import { DomRenderer } from "./render/dom";

export const startFlipEvent = new Event("flip.start");
export const resetFlipEvent = new Event("flip.reset");

let flipper: Flipper | undefined;
export function setupFlip(tableSelector: string) {
  document.addEventListener(
    startFlipEvent.type,
    (e: Event | CustomEvent) => {
      const table = document.querySelector(tableSelector);
      if (table && table instanceof HTMLElement) {
        // freezeViewport();

        const debug = e instanceof CustomEvent && e.detail === "debug";
        const rendererCls = debug ? DebugRenderer : DomRenderer;
        flipper = new Flipper(rendererCls, table);
        flipper.flip();
      }
    },
  );
  document.addEventListener(resetFlipEvent.type, () => {
    unfreezeViewport();
    if (flipper) {
      flipper.stop();
    }
  });
}
