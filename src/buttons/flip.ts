import { debugFlip, resetFlip, startFlip } from "../events";

export function addButton(table: HTMLElement, debug = false) {
  const buttonText = debug ? "Debug" : "(╯°□°)╯︵ ┻━┻";

  const { x, y } = table.getBoundingClientRect();
  const button = document.createElement("button");
  button.innerText = buttonText;
  button.style.position = 'absolute';
  button.style.left = `${x}px`;
  button.style.top = `${y}px`;

  // Dispatch the event and hide the button when we start flipping
  button.addEventListener("click", () => {
    table.dispatchEvent(debug ? debugFlip : startFlip);
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

  document.body.append(button);
}
