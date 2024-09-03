// This file is responsible for preventing scroll
// while the animation is playing.

const viewportStylesheet = new CSSStyleSheet();
document.adoptedStyleSheets = [...document.adoptedStyleSheets, viewportStylesheet]

export function freezeViewport() {
  viewportStylesheet.replaceSync(`
    body {
      overflow: hidden;
    }
  `)
}

export function unfreezeViewport() {
  viewportStylesheet.replaceSync('');
}
