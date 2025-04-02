/**
 * Retrieve arguments from the script tag, dynamically load the project, and initialize it.
 *
 * When written as a script tag,
 * <script src="main.js" data-button-parent-selector="#button-container"></script>
 *
 * When called in the console as a dynamic script:
 * let script = document.createElement('script');
 * script.id = "flip-table";
 * script.src = "main.js";
 * script.setAttribute("data-button-parent-selector", "#button-container");
 * document.body.append(script);
 */

import { type Args, start } from "./main";

const args = loadArguments();
start(args);

function loadArguments(): Args {
  const script = document.getElementById("flip-table");
  if (!script || !(script instanceof HTMLScriptElement)) {
    throw new Error("No script with id #flip-table found");
  }
  const buttonParentSelector = script.getAttribute(
    "data-button-parent-selector",
  );
  const tableSelector = script.getAttribute("data-table-selector");
  const debug = script.hasAttribute("debug");

  const args = {
    buttonParentSelector,
    tableSelector,
    debug,
  };

  const missingArgs = Object.entries(args).filter(([_, argVal]) => !argVal);
  if (missingArgs.length) {
    throw new Error(
      `The script must define attr: ${missingArgs.map((a) => a[0]).join(", ")}`,
    );
  }

  return args as Args;
}
