/**
 * Pure snapping algorithms for grid and tile alignment.
 */

export interface Point {
  x: number;
  y: number;
}

/**
 * Snaps a 1D value to the nearest step.
 */
export function snapValue(val: number, step: number): number {
  if (step <= 0) return val;
  return Math.round(val / step) * step;
}

/**
 * Snaps a 2D point (x, y) to a grid of `gridSize`.
 */
export function snapToGrid(
  point: Point,
  gridSize: number,
  threshold: number = 10
): Point {
  if (gridSize <= 0) return point;
  const snappedX = snapValue(point.x, gridSize);
  const snappedY = snapValue(point.y, gridSize);

  return {
    x: Math.abs(point.x - snappedX) <= threshold ? snappedX : point.x,
    y: Math.abs(point.y - snappedY) <= threshold ? snappedY : point.y,
  };
}

/**
 * Snaps an angle in degrees to standard angle increments (15°, 30°, 45°, 90°).
 */
export function snapAngle(
  angleDeg: number,
  stepDeg: number = 15,
  thresholdDeg: number = 5
): number {
  const normalized = ((angleDeg % 360) + 360) % 360;
  const snapped = Math.round(normalized / stepDeg) * stepDeg;
  if (Math.abs(normalized - snapped) <= thresholdDeg) {
    return (snapped % 360);
  }
  return normalized;
}

/**
 * Bounds calculation for alignment.
 */
export function getBoundingBox(
  tiles: Array<{ x: number; y: number; width?: number; height?: number; rotation?: number }>
) {
  if (tiles.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const t of tiles) {
    const w = t.width ?? 100;
    const h = t.height ?? 100;
    const angleRad = ((t.rotation || 0) * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    const corners = [
      { x: t.x, y: t.y },
      { x: t.x + w * cos, y: t.y + w * sin },
      { x: t.x + w * cos - h * sin, y: t.y + w * sin + h * cos },
      { x: t.x - h * sin, y: t.y + h * cos },
    ];

    for (const p of corners) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
