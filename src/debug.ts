import { debugFlip, resetFlip, startFlip } from "./events";

export function makeDebugButton(table: HTMLElement) {
  const button = document.createElement("button");
  button.innerText = "Debug";

  const { right, y } = table.getBoundingClientRect();

  button.style.position = 'absolute';
  button.style.left = `${right + window.pageXOffset - 60}px`;
  button.style.top = `${y + window.pageYOffset - 30}px`;

  // Dispatch the event and hide the button when we start flipping
  button.addEventListener("click", () => {
    table.dispatchEvent(debugFlip);
  });

  // When we see a flip event, either we clicked or some other
  // button was clicked. Either way we hide ourselves.
  document.addEventListener(startFlip.type, () => {
    button.style.display = 'none';
  });
  document.addEventListener(debugFlip.type, () => {
    button.style.display = 'none';
  })

  // Show the button when we reset
  document.addEventListener(resetFlip.type, () => {
    button.style.display = 'initial';
  });

  return button;
}
