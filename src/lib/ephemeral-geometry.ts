import { ephemeralGroundPreview as content } from "@/content/home";

// Where her plan sits in the map world, shared by the home dive and the project page's Opening.
// Units are the map's viewBox.
export const MAP_W = content.map.width;
export const MAP_H = content.map.height;

const { site, sitePlan } = content;

export const planW = site.widthUnits / (site.drawing.right - site.drawing.left);
export const planH = (planW * sitePlan.height) / sitePlan.width;
export const planX = site.target.x - ((site.drawing.left + site.drawing.right) / 2) * planW;
export const planY = site.target.y - ((site.drawing.top + site.drawing.bottom) / 2) * planH;

// The drawing ends at 86% of the visual's width, which sets how deep the camera goes.
export const DEPTH = (0.86 * MAP_W) / site.widthUnits;

/** The plan image inside the frame once the dive has ended, as percentages of the frame. */
export const planAtDiveEnd = {
  left: ((MAP_W / 2 + (planX - site.target.x) * DEPTH) / MAP_W) * 100,
  top: ((MAP_H / 2 + (planY - site.target.y) * DEPTH) / MAP_H) * 100,
  width: ((planW * DEPTH) / MAP_W) * 100,
};
