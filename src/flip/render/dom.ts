import Matter from "matter-js";
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
    const tableTracking = new BodyTrackingDomElement(table.elem, table.body);
    this.#trackedElements.push(tableTracking);
    this.#trackedElements.push(
      ...leaves.map(
        (l) => new BodyTrackingDomElement(l.elem, l.body, tableTracking),
      ),
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
  /**
   * A container which this element's positioning is relative to and thus
   * needs to use to translate between absolute body position and offset
   * relative not just to itself but the container translation also.
   */
  container?: BodyTrackingDomElement;
  body: Matter.Body;
  #height: number;
  #width: number;

  /**
   * The initial top-left position of the DOM element
   */
  #initialElemPosition: Matter.Vector;
  /**
   * The initial center of the element.
   */
  #initialCenter: Matter.Vector;
  #initialStyleText: string;

  constructor(
    elem: HTMLElement,
    body: Matter.Body,
    container?: BodyTrackingDomElement,
  ) {
    this.elem = elem;
    this.container = container;
    this.body = body;

    // As the DOM element rotates, the height and width of the bounding rect changes.
    // When we do computation on the element's position, we need to use the actual dimensions
    // of the element, not the bounding rect, which we save from its initial rect.
    const { x, y, width, height } = elem.getBoundingClientRect();
    this.#width = width;
    this.#height = height;
    this.#initialElemPosition = Matter.Vector.create(x, y);
    this.#initialCenter = Matter.Vector.create(x + width / 2, y + height / 2);

    // Save the element's initial inline style to be able to reset later.
    this.#initialStyleText = this.elem.style.cssText;
    this.elem.style.position = 'relative';
    this.elem.style.transition = 'none';
  }

  render() {
    // If the element is transforming relative to a transforming parent, we need to first undo the effect
    // of the parent's transformations:
    // - undo parent rotation first so translating element will be in correct direction
    // - undo translation due to parent rotationf
    // - undo parent translation
    //
    // From here, the element should be in its original position.
    // Then apply the element's translation and rotation.
    const {
      parentRotationTranslation,
      parentRotation,
      parentTranslation,
      translation,
      rotation,
    } = this.transform();
    this.elem.style.transform = `
      rotate(${-parentRotation}rad)
      translate(${-parentRotationTranslation.x}px, ${-parentRotationTranslation.y}px)
      translate(${-parentTranslation.x}px, ${-parentTranslation.y}px)
      translate(${translation.x}px, ${translation.y}px)
      rotate(${rotation}rad)
    `;
  }

  /**
   * Compute transforms:
   * - translation due to parent rotation - the child element will translate when the parent rotates
   * - parent rotation
   * - parent translation
   * - item rotation
   * - item translation
   */
  transform(): {
    parentRotationTranslation: Matter.Vector;
    parentRotation: number;
    parentTranslation: Matter.Vector;
    translation: Matter.Vector;
    rotation: number;
  } {
    let parentRotationTranslation: Matter.Vector | undefined;
    if (this.container) {
      // Use the rotation matrix to compute the translation due to the parent's rotation.
      // [x'] = [cos(theta) - sin(theta)][x]
      // [y']   [sin(theta) + cos(theta)][y]
      //
      // e.g. theta = 45deg = PI/4rad, (x,y) = (23, 12)
      // [x'] = [cos(PI/4) - sin(PI/4)][23]
      // [y']   [sin(PI/4) + cos(PI/4)][12]
      // [x'] = [23*cos(PI/4) - 12*sin(PI/4)]
      // [y']   [23*sin(PI/4) + 12*cos(PI/4)]
      // [x'] = [16.26 - 8.49] = [ 7.77]
      // [y']   [16.26 + 8.49]   [24.75]
      // translation performed = { x: 7.77 - 23, y: 24.75 - 12 }

      // rotation coordinates are relative to the container's center
      const x = this.#initialCenter.x - this.container.#initialCenter.x;
      const y = this.#initialCenter.y - this.container.#initialCenter.y;
      const angle = this.container.body.angle;
      const [newX, newY] = [
        x * Math.cos(angle) - y * Math.sin(angle),
        x * Math.sin(angle) + y * Math.cos(angle),
      ];

      parentRotationTranslation = {
        x: newX - x,
        y: newY - y,
      };
    }
    return {
      parentRotationTranslation:
        parentRotationTranslation || Matter.Vector.create(0, 0),
      parentRotation: this.container?.body.angle || 0,
      parentTranslation: {
        x: this.container?.translateX() || 0,
        y: this.container?.translateY() || 0,
      },
      translation: { x: this.translateX(), y: this.translateY() },
      rotation: this.body.angle,
    };
  }

  /**
   * The x translation of the element relative to its original position.
   */
  translateX(): number {
    return this.body.position.x - this.#initialElemPosition.x - this.#width / 2;
  }

  /**
   * The y translation of the element relative to its original position.
   */
  translateY(): number {
    return (
      this.body.position.y - this.#initialElemPosition.y - this.#height / 2
    );
  }

  reset() {
    // Reset the original element's inline style
    this.elem.style.cssText = this.#initialStyleText;
  }
}
