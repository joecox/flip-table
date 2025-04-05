import { debugFlip, resetFlip, startFlip } from "./events";

export function addResetButton() {
  const sharedResetButton = document.createElement("button");
  sharedResetButton.style.position = 'fixed';
  sharedResetButton.style.zIndex = '9999';
  sharedResetButton.style.top = '10px';
  sharedResetButton.style.left = '10px';
  sharedResetButton.style.display = 'none';
  sharedResetButton.innerText = 'Put table back ┬─┬ノ( º _ ºノ)'
  sharedResetButton.addEventListener('click', () => {
    document.dispatchEvent(resetFlip);
    sharedResetButton.style.display = 'none';
  });

  // When we start flipping, show the reset button;
  document.addEventListener(startFlip.type, () => {
    sharedResetButton.style.removeProperty("display");
  });
  document.addEventListener(debugFlip.type, () => {
    sharedResetButton.style.removeProperty("display");
  });

  document.body.append(sharedResetButton);
}
