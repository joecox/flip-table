import { debugFlip, resetFlip, startFlip } from "./events";

const buttonStylesheet = new CSSStyleSheet();
buttonStylesheet.replaceSync(`
  :root {
    --flip-button-height: 50px;
    --flip-button-width: 100px;
  }
  .flip-button, .flip-button:hover {
    all: initial;

    position: absolute;
    cursor: pointer;
    border: none;
    outline: 1px dotted yellow;
    outline-width: 3px;
    outline-offset: -5px;
    border-radius: 4px;
    background-color: red;
    font-size: 20px;
    font-family: system-ui;
    color: white;
    text-align: center;
    height: var(--flip-button-height);
    width: var(--flip-button-width);
    z-index: 9999;
  }
  .flip-button:hover {
    filter: brightness(85%);
  }
`)
document.adoptedStyleSheets = [
  ...document.adoptedStyleSheets,
  buttonStylesheet,
];
function makeNormalButton(table: HTMLElement) {
  const button = document.createElement("button");
  button.innerText = 'Flip Me';
  button.className = 'flip-button';

  const { x, y } = table.getBoundingClientRect();
  button.style.left = `calc(${x + window.pageXOffset}px - var(--flip-button-width) + 20px)`;
  button.style.top = `calc(${y + window.pageYOffset}px - var(--flip-button-height) + 20px)`;

  // Dispatch the event and hide the button when we start flipping
  button.addEventListener("click", () => {
    table.dispatchEvent(startFlip);
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
    button.style.removeProperty("display");
  });

  return button;
}

type MakeButton = (table: HTMLElement) => HTMLButtonElement;
export function addButton(table: HTMLElement, makeButton: MakeButton = makeNormalButton) {
  const button = makeButton(table);
  document.body.append(button);
}
