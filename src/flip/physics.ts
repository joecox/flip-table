import { createBodyFromElement } from "./bodies/dom";
import { Matter } from "./matter";
import type { Renderer } from "./render/renderer";
import { getLeafElements } from "./table";

import { World, ColliderDesc, Collider, RigidBodyDesc, RigidBody } from '@dimforge/rapier2d';
import { Pixel, toMeter } from "./units";

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
  world: World;
  // runner: Matter.Runner;
  renderer: Renderer;
  table: HTMLElement;
  tableLeafs: HTMLElement[];
  tableLeafClones: HTMLElement[];

  constructor(rendererCls: typeof Renderer, table: HTMLElement) {
    this.world = new World({ x: 0, y: -9.81 });
    // this.runner = Matter.Runner.create();
    this.renderer = new rendererCls(this.world);

    this.table = table;
    this.tableLeafs = [];
    this.tableLeafClones = [];
  }

  flip() {
    const { bottom: tableBottom } = this.table.getBoundingClientRect();

    // Add the ground positioned at the bottom of the table
    const groundHeight = 20;
    const groundBodyDesc = RigidBodyDesc.fixed().setTranslation(
      // position horizontally in the center of the window
      toMeter(window.innerWidth / 2 as Pixel),
      // position vertically below the table
      toMeter(tableBottom + groundHeight / 2 as Pixel),
    );
    const groundBody = this.world.createRigidBody(groundBodyDesc)
    const groundColliderDesc = ColliderDesc.cuboid(
      toMeter(window.innerWidth / 2 as Pixel),
      toMeter(groundHeight / 2 as Pixel),
    )
    this.world.createCollider(groundColliderDesc, groundBody);


    // const groundCollision = 0x01;
    // const tableCollision = 0x02;
    // const itemsCollision = 0x04;
    // const shelfCollision = 0x08;
    // // Add root table body
    // // const tableRenderer = new MatterToDOMRenderer(this.table, { category: tableCollision, mask: tableCollision | groundCollision });
    // const tableContainerBody = createBodyFromElement(this.table);
    // // tableBody.collisionFilter = {
    // //   category: tableCollision,
    // //   mask: tableCollision | groundCollision,
    // // };
    // // const tableRenderer = new BodyTrackingDomElement(this.table);

    // const tableLeafs = getLeafElements(this.table);
    // const leafBodies: Matter.Body[] = [];
    // const shelfBodies: Matter.Body[] = [];

    // for (const leaf of tableLeafs) {
    //   const group = Matter.Body.nextGroup(false);
    //   const body = createBodyFromElement(leaf, { label: "leaf", collisionFilter: { group }});
    //   leafBodies.push(body);

    //   const { left, bottom, width } = leaf.getBoundingClientRect();
    //   const shelf = Matter.Bodies.rectangle(left + width / 2, bottom, width, 1, {
    //     label: "shelf",
    //     collisionFilter: { group },
    //     density: 0.01,
    //   });
    //   shelfBodies.push(shelf);
    // }

    // this.tableLeafs = tableLeafs;
    // // const shelfs = [];
    // // tableLeafs.forEach((leaf) => {
    // //   // Create a fixed clone and hide the real leaf
    // //   const tableLeafClone = leaf.cloneNode(true);
    // //   const leafBoundingRect = leaf.getBoundingClientRect();
    // //   tableLeafClone.style.position = "fixed";
    // //   tableLeafClone.style.top = `${leafBoundingRect.y}px`;
    // //   tableLeafClone.style.left = `${leafBoundingRect.x}px`;
    // //   tableLeafClone.style.width = `${leafBoundingRect.width}px`;
    // //   tableLeafClone.style.height = `${leafBoundingRect.height}px`;
    // //   // document.body.appendChild(tableLeafClone);
    // //   // leaf.style.visibility = 'hidden';
    // //   // this.tableLeafClones.push(tableLeafClone);
    // //   // this.domRenderers.push(
    // //   //   new MatterToDOMRenderer(tableLeafClone, { category: itemsCollision, mask: itemsCollision | groundCollision })
    // //   //   // new MatterToDOMRenderer(tableLeafClone)
    // //   // );

    // //   // Add a fixed shelf to the table body to hold the leaf clone
    // //   // shelfs.push(
    // //   //   Matter.Bodies.rectangle(leafBoundingRect.left + leafBoundingRect.width / 2, leafBoundingRect.bottom, leafBoundingRect.width, 1)
    // //   // );
    // // });
    // // const shelfConstraints = shelfBodies.map(s => {
    // //   return Matter.Constraint.create({
    // //     bodyA: tableBody,
    // //     bodyB: s,

    // //   })
    // // })

    // const tableBody = Matter.Body.create({
    //   parts: [...shelfBodies],
    //   // collisionFilter: {
    //   //   category: shelfCollision,
    //   // },
    // })

    // // add all of the bodies to the world
    // Matter.Composite.add(this.engine.world, [
    //   tableBody,
    //   ...leafBodies,
    //   // ...shelfBodies,
    //   // ...shelfConstraints,
    //   groundBody,
    // ]);

    // setTimeout(() => {
    //   Matter.Body.applyForce(
    //     tableBody,
    //     {
    //       x: tableBody.bounds.max.x + 10,
    //       y: tableBody.bounds.max.y,
    //     },
    //     { x: 0.5, y: 2 },
    //   );
    // }, 2000);

    this.renderer.start();
    // Matter.Runner.run(this.runner, this.engine);
  }

  stop() {
    this.renderer.stop();
    // Matter.Runner.stop(this.runner);
    // Matter.World.clear(this.engine.world, false);
    // Matter.Engine.clear(this.engine);
    // this.domRenderers.forEach((r) => r.reset());
    // this.tableLeafs.forEach((l) => l.style.removeProperty("visibility"));
    // this.tableLeafClones.forEach((c) => c.remove());
    // this.domRenderers = [];
  }
}
