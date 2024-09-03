// This file is a thin layer to load the main bulk of the project into
// the browser when prompted by the user via calling load in the console.

// The use of `currentScript` means this file cannot be loaded as type="module".
const currentScript = document.currentScript;

async function load() {
  console.log('%cInitializing Table Flipper (ノಠ益ಠ)ノ ...', 'font-size: 1.2rem');

  const { start } = await import('./main.js');
  const args = loadArguments();
  await start(args);

  console.log('%cYOU MAY FLIP WHEN READY 🫡', 'background-color: aquamarine; color: black; font-size: 2rem');
  console.log('%cFor best results, close DevTools before flipping.', 'font-style: italic; font-size: 1.2rem');
}

/**
 * Args: some data is specified via attributes in the script tag.
 * Makes testing in a stripped down page much easier.
 * Eg: <script src="load.js" buttonParentSelector="#button-container"></script>
 */
function loadArguments() {
  if (!currentScript) {
    throw new Error('currentScript is not defined. The script tag must not be defined as type="module"');
  }
  const buttonParentSelector = currentScript.getAttribute("buttonParentSelector");
  const tableSelector = currentScript.getAttribute("tableSelector");

  const args = {
    buttonParentSelector,
    tableSelector,
  };

  const missingArgs = Object.entries(args).filter(([_, argVal]) => !argVal);
  if (missingArgs.length) {
    throw new Error(`The script tag must define: ${missingArgs.map(a => a[0]).join(', ')}`);
  }

  return /** @type {{[P in keyof args]: NonNullable<args[P]>}} */ (args);
}

// Make the load function accessible in the console
// directly as `iWantToFlipTables()`
globalThis.iWantToFlipTables = load;
