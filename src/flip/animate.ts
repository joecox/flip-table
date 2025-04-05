/**
 * Animate the flipper and apply forces to flip the table.
 */

import { Body, Events, type Engine } from "matter-js";
import { forceVector } from "./constants";

export function registerAnimation(engine: Engine, table: Body) {
  Events.on(engine, "beforeUpdate", (ev) => {
    // After 2 seconds, apply constant force for 0.5 second
    if (ev.timestamp > 2000 && ev.timestamp < 2500) {
      flip(table);
    }
  });
}

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
