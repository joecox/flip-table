import Matter from "matter-js";
import { registerAnimation } from "./animate";
import { createBodyFromElement } from "./body";
import {
  canCollide,
  groundCollisionFilter,
  makeShelfCollisionFilter,
  makeTableLeafCollisionFilter,
  tableCollisionFilter,
} from "./collision";
import { tableMass } from "./constants";
import type { Renderer } from "./render/renderer";
import { getLeafElements } from "./table";

// Monkey-patch our own collision logic
Matter.Detector.canCollide = canCollide;

export class Flipper {
  engine: Matter.Engine;
  runner: Matter.Runner;
  renderer: Renderer;

  constructor(rendererCls: typeof Renderer) {
    this.engine = Matter.Engine.create();
    this.runner = Matter.Runner.create();
    this.renderer = new rendererCls(this.engine);
  }

  flip(table: HTMLElement) {
    const { bottom: tableBottom } = table.getBoundingClientRect();

    // Add the ground positioned at the bottom of the table
    const groundHeight = 20;
    const groundBody = Matter.Bodies.rectangle(
      // position horizontally in the center of the window
      window.innerWidth / 2,
      // position vertically in the center of the window
      tableBottom + groundHeight / 2,
      window.innerWidth * 2,
      groundHeight,
      { isStatic: true },
    );
    groundBody.collisionFilter = groundCollisionFilter;

    // Add root table body
    const tableBody = createBodyFromElement(table, {
      // Hardcode the table mass so tables of different sizes behave similarly
      mass: tableMass,
      inverseMass: 1 / tableMass,
    });
    tableBody.collisionFilter = tableCollisionFilter;
    const tableComposite = Matter.Composite.create({
      label: "table",
      bodies: [tableBody],
    });

    const tableLeafs = getLeafElements(table);
    const leafBodies: Matter.Body[] = [];
    const leafsAndBodies: { body: Matter.Body; elem: HTMLElement }[] = [];

    for (const leaf of tableLeafs) {
      const shelfGroup = Matter.Body.nextGroup(false);

      const leafBody = createBodyFromElement(leaf, { label: "leaf" });
      // Scale down the body so it collides less with other leaves.
      Matter.Body.scale(
        leafBody,
        // scale down sides by 10% each
        0.8,
        // scale top down by 10% of height
        0.9,
        // point at the bottom center of the object so it scales down only from top
        { x: leafBody.position.x, y: leafBody.bounds.max.y },
      );
      leafBody.collisionFilter = makeTableLeafCollisionFilter(shelfGroup);
      leafBodies.push(leafBody);
      leafsAndBodies.push({ body: leafBody, elem: leaf });

      const { left, bottom, width } = leaf.getBoundingClientRect();
      const shelf = Matter.Bodies.rectangle(
        left + width / 2,
        bottom,
        width,
        1,
        {
          label: "shelf",
          density: 0.1,
        },
      );
      shelf.collisionFilter = makeShelfCollisionFilter(shelfGroup);

      const leftConstraint = Matter.Constraint.create({
        bodyA: tableBody,
        bodyB: shelf,
        // Constrain the shelf to the table at its left end
        pointA: {
          // Offset of left end of shelf from center of table
          x: shelf.bounds.min.x - tableBody.position.x,
          y: shelf.position.y - tableBody.position.y,
        },
        pointB: {
          // Offset of left end of shelf from center of shelf
          x: shelf.bounds.min.x - shelf.position.x,
          y: 0,
        },
        length: 0,
      });
      const rightConstraint = Matter.Constraint.create({
        bodyA: tableBody,
        bodyB: shelf,
        // Constrain the shelf to the table at its left end
        pointA: {
          // Offset of right end of shelf from center of table
          x: shelf.bounds.max.x - tableBody.position.x,
          y: shelf.position.y - tableBody.position.y,
        },
        pointB: {
          // Offset of right end of shelf from center of shelf
          x: shelf.bounds.max.x - shelf.position.x,
          y: 0,
        },
        length: 0,
      });

      Matter.Composite.add(tableComposite, shelf);
      Matter.Composite.add(tableComposite, leftConstraint);
      Matter.Composite.add(tableComposite, rightConstraint);
    }

    // add the ground, table (+shelves), and leaves to the world
    Matter.Composite.add(this.engine.world, [
      tableComposite,
      ...leafBodies,
      groundBody,
    ]);

    registerAnimation(this.engine, tableBody);

    this.renderer.start({ body: tableBody, elem: table }, leafsAndBodies);
    Matter.Runner.run(this.runner, this.engine);
  }

  stop() {
    this.renderer.stop();
    Matter.Runner.stop(this.runner);
    Matter.World.clear(this.engine.world, false);
    Matter.Engine.clear(this.engine);
  }
}
