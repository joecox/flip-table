// The button controls the flipping animation.

import { resetFlipEvent, startFlipEvent } from "./flip/setup.js";

// When clicked, begins/resets the animation.
const button = document.createElement('button');
const buttonFlipText = "(╯°□°)╯︵ ┻━┻";
const buttonResetText = "Reset";
button.innerText = buttonFlipText;

/**
 * Add the button to the parentElement.
 * @param {Element} parentElement
 */
export function addButton(parentElement) {
  button.addEventListener('click', flip, { once: true });
  parentElement.appendChild(button);
}

function flip() {
  button.innerText = buttonResetText;
  button.addEventListener('click', reset, { once: true });
  document.dispatchEvent(startFlipEvent);
}

function reset() {
  button.innerText = buttonFlipText;
  button.addEventListener('click', flip, { once: true });
  document.dispatchEvent(resetFlipEvent);
}
