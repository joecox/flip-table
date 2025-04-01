import { Matter } from "../matter";

/**
 * Sets up a DOM element to track the movement of a Matter JS rectangle body.
 *
 * Creates the rectangle body to match the DOM element's size and initial position.
 */
export class BodyTrackingDomElement {
  /** @type {HTMLElement} */
  elem;
  /** @type {Matter.Body} */
  body;
  /** @type {number} */
  #height;
  /** @type {number} */
  #width;
  /** @type {CSSStyleDeclaration} */
  #initialStyle;

  /**
   * @param {HTMLElement} elem
   */
  constructor(elem) {
    this.elem = elem;

    // DOM position is based from the top left
    const { x, y, width, height } = elem.getBoundingClientRect();

    // However, the MJS body position is from the center of mass, which is by default the center of the rect
    const initialMJSBodyX = x + width / 2;
    const initialMJSBodyY = y + height / 2;

    this.body = Matter.Bodies.rectangle(
      initialMJSBodyX,
      initialMJSBodyY,
      width,
      height,
    );

    // As the DOM element rotates, the height and width of the bounding rect changes.
    // When we do computation on the element's position, we need to use the actual dimensions
    // of the element, not the bounding rect.
    this.#width = width;
    this.#height = height;

    // Save the element's initial style to be able to reset later.
    this.#initialStyle = this.elem.style;
  }

  render() {
    this.elem.style.position = "fixed";
    this.elem.style.top = `${this.body.position.y - this.#width / 2}px`;
    this.elem.style.left = `${this.body.position.x - this.#height / 2}px`;
    this.elem.style.width = `${this.#width}px`;
    this.elem.style.height = `${this.#height}px`;
    this.elem.style.transform = `rotate(${this.body.angle}rad)`;
  }

  reset() {
    this.elem.style.cssText = this.#initialStyle.cssText;
  }
}
