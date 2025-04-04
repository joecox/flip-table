import type Matter from "matter-js";
import { Renderer } from "./renderer";

/**
 * Provides a DOM-based renderer
 */
export class DomRenderer extends Renderer {
  #animationRequestId?: number;
  #trackedElements: BodyTrackingDomElement[] = [];

  start(
    table: { body: Matter.Body; elem: HTMLElement },
    leaves: { body: Matter.Body; elem: HTMLElement }[],
  ) {
    // Clone and hide the table and leaves so the layout stays the same
    // 1. Clone the leaves.
    // 2. Set the visibility of all original leaves to hidden. Done before cloning the table
    //    so that the cloned table doesn't have extra non-animated copies of leaves
    //    while the animated leaves fly all over the place.
    //    (This is done implicitly while cloning the leaves in BodyTrackingDomElement)
    // 3. Clone the table
    this.#trackedElements.push(
      ...leaves.map((l) => new BodyTrackingDomElement(l.elem, l.body)),
    );
    this.#trackedElements.push(
      new BodyTrackingDomElement(table.elem, table.body),
    );
    this.#animationRequestId = requestAnimationFrame(() => this.#rerender());
  }

  #rerender() {
    for (const elem of this.#trackedElements) {
      elem.render();
    }
    this.#animationRequestId = requestAnimationFrame(() => this.#rerender());
  }

  stop() {
    if (this.#animationRequestId) {
      cancelAnimationFrame(this.#animationRequestId);
    }
    for (const elem of this.#trackedElements) {
      elem.reset();
    }
  }
}

/**
 * Sets up a DOM element to track the movement of a Matter JS rectangle body.
 *
 * Creates the rectangle body to match the DOM element's size and initial position.
 */
class BodyTrackingDomElement {
  elem: HTMLElement;
  clone: HTMLElement;
  body: Matter.Body;
  #height: number;
  #width: number;
  #initialStyleText: string;

  constructor(elem: HTMLElement, body: Matter.Body) {
    this.elem = elem;
    this.clone = elem.cloneNode(true) as HTMLElement;

    // Style the clone using the original's computed styles
    // takes cascading styles/etc into account that would
    // be lost when the clone is in a different part of the DOM.
    const computedStyle = window.getComputedStyle(elem);
    for (let i = 0; i < computedStyle.length; i++) {
      const propertyName = computedStyle.item(i);
      this.clone.style.setProperty(propertyName, computedStyle.getPropertyValue(propertyName));
    }

    this.body = body;

    // As the DOM element rotates, the height and width of the bounding rect changes.
    // When we do computation on the element's position, we need to use the actual dimensions
    // of the element, not the bounding rect, which we save from its initial rect.
    const { width, height } = elem.getBoundingClientRect();
    this.#width = width;
    this.#height = height;

    // Save the element's initial style to be able to reset later.
    this.#initialStyleText = this.elem.style.cssText;

    // Hide the original element
    this.elem.style.visibility = "hidden";

    // Add the clone to the document
    document.body.appendChild(this.clone);
  }

  render() {
    this.clone.style.position = "fixed";
    this.clone.style.top = `${this.body.position.y - this.#height / 2}px`;
    this.clone.style.left = `${this.body.position.x - this.#width / 2}px`;
    this.clone.style.width = `${this.#width}px`;
    this.clone.style.height = `${this.#height}px`;
    this.clone.style.transform = `rotate(${this.body.angle}rad)`;
  }

  reset() {
    // Reset the original element's inline style
    this.elem.style.cssText = this.#initialStyleText;
    // Remove the clone
    document.body.removeChild(this.clone);
  }
}
