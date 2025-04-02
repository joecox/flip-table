import { addDebugButton } from "./flip/buttons/debug";
import { addButton } from "./flip/buttons/flip";
import { setupFlip } from "./flip/setup";

export interface Args {
  buttonParentSelector: string;
  tableSelector: string;
  debug?: boolean;
}
export async function start({
  buttonParentSelector,
  tableSelector,
  debug = false,
}: Args) {
  console.log(
    "%cInitializing Table Flipper (ノಠ益ಠ)ノ ...",
    "font-size: 1.2rem",
  );
  const buttonParent = document.querySelector(buttonParentSelector);
  if (!buttonParent || !(buttonParent instanceof HTMLElement)) {
    throw new Error(
      `The element specified by ${buttonParentSelector} was not found`,
    );
  }
  addButton(buttonParent);
  if (debug) {
    addDebugButton();
  }

  setupFlip(tableSelector);

  console.log(
    "%cYOU MAY FLIP WHEN READY 🫡",
    "background-color: aquamarine; color: black; font-size: 2rem",
  );
  console.log(
    "%cFor best results, close DevTools before flipping.",
    "font-style: italic; font-size: 1.2rem",
  );
}
