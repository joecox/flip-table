import { Branded } from "../brand";

const pixelsPerMeter = 50;
const metersPerPixel = 1 / pixelsPerMeter;

export type Pixel = Branded<number, "pixel">;
export function toMeter(p: Pixel): Meter {
  return p * metersPerPixel as Meter;
}

export type Meter = Branded<number, "meter">;
export function toPixel(m: Meter): Pixel {
  return m * pixelsPerMeter as Pixel;
}
