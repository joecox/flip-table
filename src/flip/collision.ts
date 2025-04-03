import { Matter } from "./matter";

interface ModifiedCollisionFilter {
  group: number;
  collidesWith?: number[];
}

export function canCollide(
  filterA: ModifiedCollisionFilter,
  filterB: ModifiedCollisionFilter,
) {
  if (filterA.group === filterB.group && filterA.group !== 0) {
    return filterA.group > 0;
  }

  if (!filterA.collidesWith || !filterB.collidesWith) {
    return false;
  }

  return (
    filterA.collidesWith?.includes(filterB.group) &&
    filterB.collidesWith?.includes(filterA.group)
  );
}

// Collision rules
// - The table should collide with the ground.
// - Table leaves should collide with the ground.
// - Table leaves should not collide with the table.
// - Table leaves should collide with one another.
// - Each table leaf collides with the shelf it sits on but no other shelves.
// - Shelves have no other collision rules; they are affixed in their spots to the table.
const groundGroup = Matter.Body.nextGroup(false);
const tableGroup = Matter.Body.nextGroup(false);
const tableLeafGroup = Matter.Body.nextGroup(false);

export const groundCollisionFilter: ModifiedCollisionFilter = {
  group: groundGroup,
  collidesWith: [
    // The ground collides with the table.
    tableGroup,
    // The ground collides with table leaves.
    tableLeafGroup,
  ],
};

export const tableCollisionFilter: ModifiedCollisionFilter = {
  group: tableGroup,
  collidesWith: [
    // Table collides with the ground.
    groundGroup,
  ],
};

export function makeTableLeafCollisionFilter(
  shelfGroup: number,
): ModifiedCollisionFilter {
  return {
    // Table leaves collide with each other by virtue of having the same group.
    group: tableLeafGroup,
    collidesWith: [
      // Each table leaf should also collide with its corresponding shelf.
      shelfGroup,
      // Table leaves collide with the ground.
      groundGroup,
    ],
  };
}

export function makeShelfCollisionFilter(
  shelfGroup: number,
): ModifiedCollisionFilter {
  return {
    // Each individual shelf has its own group.
    group: shelfGroup,
    // The shelf collides with table leafs, but only the table leaf which specifies this
    // particular shelf's group.
    collidesWith: [tableLeafGroup],
  };
}
