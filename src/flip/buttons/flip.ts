// The button controls the flipping animation.

import { resetFlipEvent, startFlipEvent } from "../setup";

// When clicked, begins/resets the animation.
const button = document.createElement("button");
const buttonFlipText = "(╯°□°)╯︵ ┻━┻";
const buttonResetText = "Reset";
button.innerText = buttonFlipText;

export function addButton(parentElement: HTMLElement) {
  button.addEventListener("click", flip, { once: true });
  parentElement.appendChild(button);
}

function flip() {
  button.innerText = buttonResetText;
  button.addEventListener("click", reset, { once: true });
  document.dispatchEvent(startFlipEvent);
}

function reset() {
  button.innerText = buttonFlipText;
  button.addEventListener("click", flip, { once: true });
  document.dispatchEvent(resetFlipEvent);
}
