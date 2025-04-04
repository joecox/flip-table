import { resetFlipEvent, startFlipEvent } from "../setup";

const debugFlipEvent = new CustomEvent(startFlipEvent.type, {
  detail: "debug",
});

const debugButton = document.createElement("button");
debugButton.innerText = "Debug";
debugButton.style.position = "fixed";
debugButton.style.left = "10px";
debugButton.style.bottom = "10px";
debugButton.style.zIndex = "9999";

export function addDebugButton() {
  document.body.appendChild(debugButton);
  debugButton.addEventListener("click", debugFlip, { once: true });
}

function debugFlip() {
  debugButton.innerText = "Reset";
  debugButton.addEventListener("click", reset, { once: true });
  document.dispatchEvent(debugFlipEvent);
}

function reset() {
  debugButton.innerText = "Debug";
  debugButton.addEventListener("click", debugFlip, { once: true });
  document.dispatchEvent(resetFlipEvent);
}
