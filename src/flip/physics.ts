import { createBodyFromElement } from "./bodies/dom";
import { Matter } from "./matter";
import type { Renderer } from "./render/renderer";
import { getLeafElements } from "./table";
import { canCollide, groundCollisionFilter, makeShelfCollisionFilter, makeTableLeafCollisionFilter, tableCollisionFilter } from "./collision";

// Override canCollide
Matter.Detector.canCollide = canCollide;

// class MatterToDOMRenderer {
//   constructor(elem: HTMLElement, { category, mask } = { category: 1, mask: -1 }) {
//     this.elem = elem;
//     // DOM position is from top left
//     const { x, y, width, height } = elem.getBoundingClientRect();
//     // MJS body position is from center of mass which is by default center of the rect
//     const initialBodyX = x + width / 2;
//     const initialBodyY = y + height / 2;
//     this.body = Matter.Bodies.rectangle(
//       initialBodyX,
//       initialBodyY,
//       width,
//       height,
//       { collisionFilter: { category, mask } },
//     );
//     // this.body = Matter.Bodies.rectangle(initialBodyX, initialBodyY, width, height);
//     this.initialBodyX = initialBodyX;
//     this.initialBodyY = initialBodyY;
//     this.untransformedWidth = width;
//     this.untransformedHeight = height;
//     this.initialStyle = this.elem.style;
//   }

//   render() {
//     this.elem.style.position = "fixed";
//     this.elem.style.top = `${this.body.position.y - this.untransformedHeight / 2}px`;
//     this.elem.style.left = `${this.body.position.x - this.untransformedWidth / 2}px`;
//     this.elem.style.width = `${this.untransformedWidth}px`;
//     this.elem.style.height = `${this.untransformedHeight}px`;
//     this.elem.style.transform = `rotate(${this.body.angle}rad)`;

//     // // position is from center of mass which is by default center of the rect
//     // const { x, y } = this.body.position;
//     // const translateX = x - this.initialBodyX;
//     // const translateY = y - this.initialBodyY;
//     // this.elem.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${this.body.angle}rad)`
//     // // this.elem.style.transform = `translate(${translateX}px, ${translateY}px)`

//     // const { x: elemX, y: elemY } = this.elem.getBoundingClientRect();
//     // const dot = document.createElement("div");
//     // dot.style.width = '2px';
//     // dot.style.height = '2px';
//     // dot.style.backgroundColor = 'red';
//     // dot.style.position = 'absolute';
//     // dot.style.zIndex = 9999;
//     // dot.style.top = `${elemY}px`;
//     // dot.style.left = `${elemX}px`;
//     // document.body.appendChild(dot);
//   }

//   reset() {
//     this.elem.style = this.initialStyle;
//   }
// }

export class Flipper {
  engine: Matter.Engine;
  runner: Matter.Runner;
  renderer: Renderer;
  table: HTMLElement;
  tableLeafs: HTMLElement[];
  tableLeafClones: HTMLElement[];

  constructor(rendererCls: typeof Renderer, table: HTMLElement) {
    this.engine = Matter.Engine.create();
    this.runner = Matter.Runner.create();
    this.renderer = new rendererCls(this.engine);

    this.table = table;
    this.tableLeafs = [];
    this.tableLeafClones = [];
  }

  flip() {
    const { bottom: tableBottom } = this.table.getBoundingClientRect();

    // Add the ground positioned at the bottom of the table
    const groundHeight = 20;
    const groundBody = Matter.Bodies.rectangle(
      // position horizontally in the center of the window
      window.innerWidth / 2,
      // position vertically in the center of the window
      tableBottom + groundHeight / 2,
      window.innerWidth + 500,
      groundHeight,
      { isStatic: true },
    );
    groundBody.collisionFilter = groundCollisionFilter;

    // Add root table body
    // const tableRenderer = new MatterToDOMRenderer(this.table, { category: tableCollision, mask: tableCollision | groundCollision });
    const tableBody = createBodyFromElement(this.table);
    tableBody.collisionFilter = tableCollisionFilter;
    const tableComposite = Matter.Composite.create({ label: "table", bodies: [tableBody] });

    // const tableRenderer = new BodyTrackingDomElement(this.table);

    const tableLeafs = getLeafElements(this.table);
    const leafBodies: Matter.Body[] = [];
    const shelfBodies: Matter.Body[] = [];

    for (const leaf of tableLeafs) {
      const shelfGroup = Matter.Body.nextGroup(false);

      const leafBody = createBodyFromElement(leaf, { label: "leaf" });
      // Scale down the body so it collides less with other leaves.
      Matter.Body.scale(leafBody,
        // scale down sides by 10% each
        0.8,
        // scale top down by 10% of height
        0.9,
        // point at the bottom center of the object so it scales down only from top
        { x: leafBody.position.x, y: leafBody.bounds.max.y },
      );
      leafBody.collisionFilter = makeTableLeafCollisionFilter(shelfGroup);
      leafBodies.push(leafBody);

      const { left, bottom, width } = leaf.getBoundingClientRect();
      const shelf = Matter.Bodies.rectangle(left + width / 2, bottom, width, 1, {
        label: "shelf",
        density: 0.1,
      });
      shelf.collisionFilter = makeShelfCollisionFilter(shelfGroup);
      shelfBodies.push(shelf);

      const leftConstraint = Matter.Constraint.create({
        bodyA: tableBody,
        bodyB: shelf,
        // Constrain the shelf to the table at its left end
        pointA: {
          // Offset of left end of shelf from center of table
          x: shelf.bounds.min.x - tableBody.position.x,
          y: shelf.position.y - tableBody.position.y
        },
        pointB: {
          // Offset of left end of shelf from center of shelf
          x: shelf.bounds.min.x - shelf.position.x,
          y: 0,
        },
        length: 0,
      })
      const rightConstraint = Matter.Constraint.create({
        bodyA: tableBody,
        bodyB: shelf,
        // Constrain the shelf to the table at its left end
        pointA: {
          // Offset of right end of shelf from center of table
          x: shelf.bounds.max.x - tableBody.position.x,
          y: shelf.position.y - tableBody.position.y
        },
        pointB: {
          // Offset of right end of shelf from center of shelf
          x: shelf.bounds.max.x - shelf.position.x,
          y: 0,
        },
        length: 0,
      })

      Matter.Composite.add(tableComposite, shelf);
      Matter.Composite.add(tableComposite, leftConstraint);
      Matter.Composite.add(tableComposite, rightConstraint);
    }

    this.tableLeafs = tableLeafs;
    // const shelfs = [];
    // tableLeafs.forEach((leaf) => {
    //   // Create a fixed clone and hide the real leaf
    //   const tableLeafClone = leaf.cloneNode(true);
    //   const leafBoundingRect = leaf.getBoundingClientRect();
    //   tableLeafClone.style.position = "fixed";
    //   tableLeafClone.style.top = `${leafBoundingRect.y}px`;
    //   tableLeafClone.style.left = `${leafBoundingRect.x}px`;
    //   tableLeafClone.style.width = `${leafBoundingRect.width}px`;
    //   tableLeafClone.style.height = `${leafBoundingRect.height}px`;
    //   // document.body.appendChild(tableLeafClone);
    //   // leaf.style.visibility = 'hidden';
    //   // this.tableLeafClones.push(tableLeafClone);
    //   // this.domRenderers.push(
    //   //   new MatterToDOMRenderer(tableLeafClone, { category: itemsCollision, mask: itemsCollision | groundCollision })
    //   //   // new MatterToDOMRenderer(tableLeafClone)
    //   // );
    // });

    // add the ground, table (+shelves), and leaves to the world
    Matter.Composite.add(this.engine.world, [
      tableComposite,
      ...leafBodies,
      groundBody,
    ]);

    setTimeout(() => {
      Matter.Body.applyForce(
        tableBody,
        {
          x: tableBody.bounds.max.x + 10,
          y: tableBody.bounds.max.y,
        },
        { x: 0.5, y: 2 },
      );
    }, 2000);

    this.renderer.start();
    Matter.Runner.run(this.runner, this.engine);
  }

  stop() {
    this.renderer.stop();
    Matter.Runner.stop(this.runner);
    Matter.World.clear(this.engine.world, false);
    Matter.Engine.clear(this.engine);
    // this.domRenderers.forEach((r) => r.reset());
    this.tableLeafs.forEach((l) => l.style.removeProperty("visibility"));
    this.tableLeafClones.forEach((c) => c.remove());
    // this.domRenderers = [];
  }
}
