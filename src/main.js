import { addButton } from './button.js';
import { addDebugButton } from './debugButton.js';
import { setupFlip } from './flip/setup.js';

/**
 * @typedef {Object} Args
 * @property {string} buttonParentSelector
 * @property {string} tableSelector
 *
 * @param {Args} args
 */
export async function start(args) {
  const buttonParent = document.querySelector(args.buttonParentSelector);
  if (!buttonParent) {
    throw new Error(`The element specified by ${args.buttonParentSelector} was not found`);
  }
  addButton(buttonParent);
  addDebugButton();

  setupFlip(args.tableSelector);
}
