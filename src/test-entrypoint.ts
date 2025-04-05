/**
 * Initialize the project with test values.
 */

console.log(
  "%cInitializing Table Flipper (ノಠ益ಠ)ノ ...",
  "font-size: 1.2rem",
);

const { setup } = await import("./setup");

setup({
  tableSelector: "#table",
  debug: true,
});
