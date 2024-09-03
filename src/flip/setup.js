import { freezeViewport, unfreezeViewport } from "../freezeViewport.js";
import { Flipper } from "./physics.js";
import { DebugRenderer } from "./renderers/debug.js";
import { DomRenderer } from "./renderers/dom.js";

export const startFlipEvent = new Event('flip.start');
export const resetFlipEvent = new Event('flip.reset');

/** @type {Flipper | undefined} */
let flipper;
/**
 * @param {string} tableSelector
 */
export function setupFlip(tableSelector) {
  document.addEventListener(startFlipEvent.type, (/** @type {Event | CustomEvent} */ e) => {
    const table = document.querySelector(tableSelector);
    if (table && table instanceof HTMLElement) {
      freezeViewport();

      const debug = e instanceof CustomEvent && e.detail === 'debug'
      const rendererCls = debug ? DebugRenderer : DomRenderer;
      flipper = new Flipper(rendererCls, table);
      flipper.flip();
    }
  });
  document.addEventListener(resetFlipEvent.type, () => {
    unfreezeViewport();
    if (flipper) {
      flipper.stop();
    }
  });
}
