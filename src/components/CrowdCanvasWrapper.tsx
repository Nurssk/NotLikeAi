/**
 * CrowdCanvasWrapper.tsx
 *
 * Thin client wrapper around Skiper39's CrowdCanvas (src/animations/skiper39).
 * Renders the official OpenPeeps sprite sheet that lives at
 *   public/images/peeps/all-peeps.png  →  served as /images/peeps/all-peeps.png
 *
 * Skiper39 = the crowd-canvas hero animation (NOT Skiper40's link hover effect).
 * The sprite is a 15×7 grid; CrowdCanvas slices it into 105 walking characters
 * and animates them along the bottom of the panel with GSAP.
 */

import React from "react";
import { CrowdCanvas } from "../animations/skiper39";

interface Props {
  /** Sprite columns (grid width). Official sheet = 15. */
  rows?: number;
  /** Sprite rows (grid height). Official sheet = 7. */
  cols?: number;
  /** Path to the sprite sheet (served from /public). */
  src?: string;
}

export default function CrowdCanvasWrapper({
  rows = 15,
  cols = 7,
  src = "/images/peeps/all-peeps.png",
}: Props) {
  return <CrowdCanvas src={src} rows={rows} cols={cols} />;
}
