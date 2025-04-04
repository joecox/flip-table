/**
 * Animate the flipper and apply forces to flip the table.
 */

import Matter from "matter-js";
import { forceVector } from "./constants";

export function registerAnimation(engine: Matter.Engine, table: Matter.Body) {
  Matter.Events.on(engine, "beforeUpdate", (ev) => {
    // After 2 seconds, apply constant force for 0.5 second
    if (ev.timestamp > 2000 && ev.timestamp < 2500) {
      flip(table);
    }
  });
}

function flip(table: Matter.Body) {
  Matter.Body.applyForce(
    table,
    {
      x: table.bounds.max.x + 10,
      y: table.bounds.max.y,
    },
    forceVector,
  );
}
