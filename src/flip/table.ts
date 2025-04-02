/**
 * Get nodes within the table we want to animate.
 */
export function getLeafElements(elem: HTMLElement): HTMLElement[] {
  return Array.from(elem.children)
    .filter((c) => c instanceof HTMLElement)
    .flatMap((c) => (c.children.length ? getLeafElements(c) : c));
}
