import { Bodies, type IBodyDefinition } from "matter-js";

export function createBodyFromElement(
  elem: HTMLElement,
  opts?: IBodyDefinition,
) {
  // DOM position is based from the top left
  const { x, y, width, height } = elem.getBoundingClientRect();

  // However, the MJS body position is from the center of mass, which is by default the center of the rect
  const initialMJSBodyX = x + width / 2;
  const initialMJSBodyY = y + height / 2;

  return Bodies.rectangle(
    initialMJSBodyX,
    initialMJSBodyY,
    width,
    height,
    opts,
  );
}
