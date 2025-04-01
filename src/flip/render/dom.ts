import { BodyTrackingDomElement } from "../bodies/dom";
import { Renderer } from "./renderer";

/**
 * Provides a DOM-based renderer
 */
export class DomRenderer extends Renderer {
  #animationRequestId?: number;
  #domElements: BodyTrackingDomElement[] = [];

  start() {
    this.#domElements;
    this.#animationRequestId = requestAnimationFrame(() => this.#rerender());
  }

  addElements(...elems: BodyTrackingDomElement[]) {
    this.#domElements.push(...elems);
  }

  #rerender() {
    this.#domElements.forEach((elem) => {
      elem.render();
    });
    this.#animationRequestId = requestAnimationFrame(() => this.#rerender());
  }

  stop() {
    if (this.#animationRequestId) {
      cancelAnimationFrame(this.#animationRequestId);
    }
  }
}
