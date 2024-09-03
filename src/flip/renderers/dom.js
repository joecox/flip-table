import { Matter } from '../matter.js';
import { Renderer } from './renderer.js';

/**
 * Provides a DOM-based renderer
 */
export class DomRenderer extends Renderer {
  /** @type {number | undefined} */
  #animationRequestId;

  /** @type {number | undefined} */
  #lastAnimationFrameTimestamp;

  start() {
    const currentTime = document.timeline.currentTime;
    if (typeof currentTime !== 'number') {
      throw new Error('timeline is inactive or something 🤷');
    }
    this.#animationRequestId = requestAnimationFrame((t) => this.#rerender(t));
  }

  /**
   * @param {number} timestamp
   */
  #rerender(timestamp) {
    if (!this.#lastAnimationFrameTimestamp) {
      this.#lastAnimationFrameTimestamp = timestamp;
    }
    const delta = timestamp - this.#lastAnimationFrameTimestamp;
    this.#lastAnimationFrameTimestamp = timestamp;
    // Matter.Engine.update(this.engine, delta ? delta : undefined);
    Matter.Engine.update(this.engine);
    this.#animationRequestId = requestAnimationFrame((t) => this.#rerender(t));
  }

  stop() {
    if (this.#animationRequestId) {
      cancelAnimationFrame(this.#animationRequestId);
    }
  }
}
