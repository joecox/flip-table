// Thin layer to import MatterJS for no other reason
// than to be able to type it in JSDoc.

// @ts-ignore: Cannot find module
import Matter from 'https://cdn.jsdelivr.net/npm/matter-js@0.20.0/+esm';

/** @type {import('matter-js')} */
const matter = Matter;
export { matter as Matter };
