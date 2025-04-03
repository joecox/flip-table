import { freezeViewport, unfreezeViewport } from "../freezeViewport";
import { Flipper } from "./physics";
import { DomRenderer } from "./render/dom";

export const startFlipEvent = new Event("flip.start");
export const resetFlipEvent = new Event("flip.reset");

let flipper: Flipper | undefined;
export function setupFlip(tableSelector: string) {
  document.addEventListener(
    startFlipEvent.type,
    async (e: Event | CustomEvent) => {
      const table = document.querySelector(tableSelector);
      if (table && table instanceof HTMLElement) {
        // freezeViewport();

        const debug = e instanceof CustomEvent && e.detail === "debug";
        if (debug) {
          const { DebugRenderer } = await import("./render/debug");
          flipper = new Flipper(DebugRenderer, table);
        } else {
          flipper = new Flipper(DomRenderer, table);
        }

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
