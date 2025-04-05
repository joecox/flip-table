import { addButton } from "./buttons/flip";
import { addResetButton } from "./buttons/reset";
import { addFlipListeners } from "./flip/listeners";

export interface Args {
  tableSelector: string;
  debug?: boolean;
}
export async function setup({
  tableSelector,
  debug = false,
}: Args) {
  const tables = document.querySelectorAll(tableSelector);
  for (const table of tables) {
    if (table instanceof HTMLElement) {
      addButton(table);

      if (debug) {
        addButton(table, debug);
      }
    }
  }

  addResetButton();
  await addFlipListeners(debug);

  console.log(
    "%cYOU MAY FLIP WHEN READY 🫡",
    "background-color: aquamarine; color: black; font-size: 2rem",
  );
  console.log(
    "%cFor best results, close DevTools before flipping.",
    "font-style: italic; font-size: 1.2rem",
  );
}
