/**
 * Get nodes within the table we want to animate. Only grab leaves
 * which have
 */
export function getLeafElements(elem: HTMLElement): HTMLElement[] {
  return Array.from(elem.children)
    .filter((elem) => elem instanceof HTMLElement)
    .flatMap((elem) => {
      // Don't use if it's not an element
      if (elem.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      // Don't animate individual pieces of svg
      if (elem.nodeName === 'svg') {
        return elem;
      }

      // Look for child nodes
      if (elem.children.length) {
        return getLeafElements(elem);
      }

      const style = window.getComputedStyle(elem);

      // Don't use if it's hidden
      if (style.display === 'none' || style.visibility === 'hidden') {
        return;
      }

      // Use if it has text
      if (elem.textContent) {
        return elem;
      }

      // Use if it's an image
      if (elem.nodeName === 'img') {
        return elem
      }
    })
    .filter(elem => elem !== undefined);
}
