/**
 * Animate the flipper and apply forces to flip the table.
 */

import { Body, Events, type Engine } from "matter-js";
import { forceVector } from "./constants";
import { resetFlip } from "../events";

export function registerAnimation(engine: Engine, tableBody: Body, tableElem: HTMLElement) {
  const { x, y, height } = tableElem.getBoundingClientRect();
  const tableLeft = x + window.pageXOffset;

  const flipper = document.createElement("div");
  flipper.innerText = "(-■_■)";
  flipper.className = 'table-flip-flipper';
  flipper.style.top = `${y + window.pageYOffset + height - 40}px`;
  flipper.style.left = '-200px';
  document.body.append(flipper);

  // Get rid of the flipper when we reset
  document.addEventListener(resetFlip.type, () => {
    flipper.remove();
  });


  Events.on(engine, "beforeUpdate", (ev) => {
    // 0-2 sec - move the flipper toward the table
    if (ev.timestamp > 0 && ev.timestamp < 666) {
      flipper.style.left = `${tableLeft * 0.33 - 200}px`;
    } else if (ev.timestamp > 666 && ev.timestamp < 1333) {
      flipper.style.left = `${tableLeft * 0.66 - 200}px`;
    } else if (ev.timestamp > 1333 && ev.timestamp < 2000) {
      flipper.style.left = `${tableLeft - 200}px`;
    } else if (ev.timestamp > 2000 && tableBody.angle < 0.75) {
      // 2 sec, until table is sufficiently elevated
      // - apply flipping force
      // - shake the flipper
      flipper.innerText = '(ノಠ益ಠ)ノ';
      flipper.style.animation = '0.2s shake infinite';
      flip(tableBody);
    } else {
      flipper.innerText = '(ノ°□°)ノ';
      flipper.style.removeProperty('animation');
    }
  });
}

const flipperCss = new CSSStyleSheet();
flipperCss.replaceSync(`
  @keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
  }

  .table-flip-flipper {
    font-size: 40px;
    font-family: system-ui;
    transition: all 0.2s;
    position: absolute;
  }
`);
document.adoptedStyleSheets = [
  ...document.adoptedStyleSheets,
  flipperCss,
];

function flip(table: Body) {
  Body.applyForce(
    table,
    {
      x: table.bounds.max.x + 10,
      y: table.bounds.max.y,
    },
    forceVector,
  );
}
