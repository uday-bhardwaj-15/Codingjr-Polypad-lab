'use client';

import React, { memo } from 'react';
import { Group, Line, Circle, Rect } from 'react-konva';
import { TileShell } from '../shared/TileShell';

export type Base10BlockType =
  | 'thousand-cube'
  | 'hundred-flat'
  | 'ten-rod'
  | 'unit-cube'
  | 'connecting-cube';

export interface Base10CubeProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  blockType?: Base10BlockType;
  color?: string;
  size?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const Base10Cube = memo(function Base10Cube({
  id,
  x,
  y,
  rotation = 0,
  blockType = 'thousand-cube',
  color = '#7C3AED',
  size = 140,
  width,
  height,
  scaleX = 1,
  scaleY = 1,
  isLocked = false,
  isSelected = false,
}: Base10CubeProps) {
  // Effective size: if width/height are provided (from resize), use them
  const effectiveSize = width ? Math.min(width, height ?? width) : size;
  // 1. Thousand Cube (1000) - Exact match to user close-up reference image!
  if (blockType === 'thousand-cube') {
    const s = effectiveSize;
    const cx = s / 2;
    const cy = s / 2;
    const r = s * 0.46; // radius of isometric hexagon

    const cos30 = 0.866;
    const sin30 = 0.5;

    const topV = [
      cx, cy - r,
      cx + r * cos30, cy - r * sin30,
      cx, cy,
      cx - r * cos30, cy - r * sin30,
    ];

    const leftV = [
      cx - r * cos30, cy - r * sin30,
      cx, cy,
      cx, cy + r,
      cx - r * cos30, cy + r * sin30,
    ];

    const rightV = [
      cx, cy,
      cx + r * cos30, cy - r * sin30,
      cx + r * cos30, cy + r * sin30,
      cx, cy + r,
    ];

    // Grid lines for 10×10 divisions on each face
    const gridLines: React.ReactNode[] = [];
    const divisions = 10;

    // Top face — 4 corners:
    //   T=(cx, cy-r), R=(cx+r·cos30, cy-r·sin30), C=(cx,cy), L=(cx-r·cos30, cy-r·sin30)
    // Lines ∥ to T→R: from lerp(L→T) to lerp(C→R)
    // Lines ∥ to T→L: from lerp(R→T) to lerp(C→L)
    const Tx = cx,              Ty = cy - r;
    const Rx = cx + r * cos30,  Ry = cy - r * sin30;
    const Cx = cx,              Cy = cy;
    const Lx = cx - r * cos30,  Ly = cy - r * sin30;

    for (let i = 1; i < divisions; i++) {
      const frac = i / divisions;

      // Parallel to T→R
      const p1x = Lx + frac * (Tx - Lx);
      const p1y = Ly + frac * (Ty - Ly);
      const p2x = Cx + frac * (Rx - Cx);
      const p2y = Cy + frac * (Ry - Cy);
      gridLines.push(
        <Line key={`t1_${i}`} points={[p1x, p1y, p2x, p2y]} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      );

      // Parallel to T→L
      const q1x = Rx + frac * (Tx - Rx);
      const q1y = Ry + frac * (Ty - Ry);
      const q2x = Cx + frac * (Lx - Cx);
      const q2y = Cy + frac * (Ly - Cy);
      gridLines.push(
        <Line key={`t2_${i}`} points={[q1x, q1y, q2x, q2y]} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      );
    }


    // Left face grid (vertical & isometric slants)
    for (let i = 1; i < divisions; i++) {
      const frac = i / divisions;
      // Vertical line
      const vx1 = (cx - r * cos30) * frac + cx * (1 - frac);
      const vy1 = (cy - r * sin30) * frac + cy * (1 - frac);
      const vx2 = vx1;
      const vy2 = vy1 + r;
      gridLines.push(
        <Line key={`lv_${i}`} points={[vx1, vy1, vx2, vy2]} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      );

      // Slanted horizontal line
      const sx1 = cx - r * cos30;
      const sy1 = cy - r * sin30 + r * frac;
      const sx2 = cx;
      const sy2 = cy + r * frac;
      gridLines.push(
        <Line key={`ls_${i}`} points={[sx1, sy1, sx2, sy2]} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      );
    }

    // Right face grid
    for (let i = 1; i < divisions; i++) {
      const frac = i / divisions;
      // Vertical line
      const vx1 = cx * (1 - frac) + (cx + r * cos30) * frac;
      const vy1 = cy * (1 - frac) + (cy - r * sin30) * frac;
      const vx2 = vx1;
      const vy2 = vy1 + r;
      gridLines.push(
        <Line key={`rv_${i}`} points={[vx1, vy1, vx2, vy2]} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      );

      // Slanted horizontal line
      const sx1 = cx;
      const sy1 = cy + r * frac;
      const sx2 = cx + r * cos30;
      const sy2 = cy - r * sin30 + r * frac;
      gridLines.push(
        <Line key={`rs_${i}`} points={[sx1, sy1, sx2, sy2]} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      );
    }

    return (
      <TileShell
        id={id}
        x={x}
        y={y}
        rotation={rotation}
        width={s}
        height={s}
        isLocked={isLocked}
        isSelected={isSelected}
      >
        <Group>
          {/* Top Face */}
          <Line points={topV} closed fill="#8B5CF6" stroke="#1E1E28" strokeWidth={2.5} />
          {/* Left Face */}
          <Line points={leftV} closed fill="#6D28D9" stroke="#1E1E28" strokeWidth={2.5} />
          {/* Right Face */}
          <Line points={rightV} closed fill="#5B21B6" stroke="#1E1E28" strokeWidth={2.5} />

          {/* 10x10 Grid Overlay */}
          {gridLines}

          {/* Outer Border Hexagon */}
          <Line
            points={[
              cx, cy - r,
              cx + r * cos30, cy - r * sin30,
              cx + r * cos30, cy + r * sin30,
              cx, cy + r,
              cx - r * cos30, cy + r * sin30,
              cx - r * cos30, cy - r * sin30,
            ]}
            closed
            stroke="#1E1E28"
            strokeWidth={3}
            listening={false}
          />
        </Group>
      </TileShell>
    );
  }

  // 2. Hundred Flat (100) - Isometric Flat Slab with 10x10 grid on top
  if (blockType === 'hundred-flat') {
    const s = effectiveSize > 0 ? effectiveSize : 110;
    const cx = s / 2;
    const cy = s / 2 - 6;
    const r = s * 0.44;
    const h = 12; // thickness of slab
    const cos30 = 0.866;
    const sin30 = 0.5;

    const topV = [
      cx, cy - r * 0.7,
      cx + r * cos30, cy,
      cx, cy + r * 0.7,
      cx - r * cos30, cy,
    ];

    const leftV = [
      cx - r * cos30, cy,
      cx, cy + r * 0.7,
      cx, cy + r * 0.7 + h,
      cx - r * cos30, cy + h,
    ];

    const rightV = [
      cx, cy + r * 0.7,
      cx + r * cos30, cy,
      cx + r * cos30, cy + h,
      cx, cy + r * 0.7 + h,
    ];

    const gridLines: React.ReactNode[] = [];
    const divisions = 10;
    const Tx = cx,             Ty = cy - r * 0.7;
    const Rx = cx + r * cos30, Ry = cy;
    const Bx = cx,             By = cy + r * 0.7;
    const Lx = cx - r * cos30, Ly = cy;

    for (let i = 1; i < divisions; i++) {
      const frac = i / divisions;
      // Lines parallel to T->R (from L->T to B->R)
      const p1x = Lx + frac * (Tx - Lx);
      const p1y = Ly + frac * (Ty - Ly);
      const p2x = Bx + frac * (Rx - Bx);
      const p2y = By + frac * (Ry - By);
      gridLines.push(<Line key={`h1_${i}`} points={[p1x, p1y, p2x, p2y]} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />);

      // Lines parallel to T->L (from R->T to B->L)
      const q1x = Rx + frac * (Tx - Rx);
      const q1y = Ry + frac * (Ty - Ry);
      const q2x = Bx + frac * (Lx - Bx);
      const q2y = By + frac * (Ly - By);
      gridLines.push(<Line key={`h2_${i}`} points={[q1x, q1y, q2x, q2y]} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />);
    }

    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={s} height={s} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          <Line points={topV} closed fill="#16A34A" stroke="#14532D" strokeWidth={2} />
          <Line points={leftV} closed fill="#15803D" stroke="#14532D" strokeWidth={2} />
          <Line points={rightV} closed fill="#166534" stroke="#14532D" strokeWidth={2} />
          {gridLines}
        </Group>
      </TileShell>
    );
  }

  // 3. Ten Rod (10) - Isometric 1x10 Rod
  if (blockType === 'ten-rod') {
    const w = width || 120;
    const h = height || 40;
    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={w} height={h} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          {/* Top Face Strip */}
          <Line points={[10, 8, 110, 8, 118, 18, 18, 18]} closed fill="#60A5FA" stroke="#1D4ED8" strokeWidth={1.5} />
          {/* Front Face Strip */}
          <Line points={[18, 18, 118, 18, 118, 32, 18, 32]} closed fill="#2563EB" stroke="#1D4ED8" strokeWidth={1.5} />
          {/* Left Face */}
          <Line points={[10, 8, 18, 18, 18, 32, 10, 22]} closed fill="#1D4ED8" stroke="#1D4ED8" strokeWidth={1.5} />

          {/* 10 Division segments */}
          {Array.from({ length: 9 }).map((_, i) => {
            const frac = (i + 1) / 10;
            const tx = 10 + frac * 100;
            const fx = 18 + frac * 100;
            return (
              <Group key={`rod_seg_${i}`}>
                <Line points={[tx, 8, fx, 18]} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
                <Line points={[fx, 18, fx, 32]} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
              </Group>
            );
          })}
        </Group>
      </TileShell>
    );
  }

  // 4. 3D Connecting Cube (with center socket and isometric shading)
  if (blockType === 'connecting-cube') {
    const s = effectiveSize > 0 ? effectiveSize : 60;
    const cx = s / 2;
    const cy = s / 2;
    const r = s * 0.44;
    const cos30 = 0.866;
    const sin30 = 0.5;

    const baseColor = color || '#EA580C';

    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={s} height={s} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          {/* Top Face */}
          <Line
            points={[cx, cy - r, cx + r * cos30, cy - r * sin30, cx, cy, cx - r * cos30, cy - r * sin30]}
            closed
            fill={baseColor}
            stroke="#1E1E28"
            strokeWidth={2}
          />
          {/* Left Face */}
          <Line
            points={[cx - r * cos30, cy - r * sin30, cx, cy, cx, cy + r, cx - r * cos30, cy + r * sin30]}
            closed
            fill={baseColor}
            opacity={0.85}
            stroke="#1E1E28"
            strokeWidth={2}
          />
          {/* Right Face */}
          <Line
            points={[cx, cy, cx + r * cos30, cy - r * sin30, cx + r * cos30, cy + r * sin30, cx, cy + r]}
            closed
            fill={baseColor}
            opacity={0.7}
            stroke="#1E1E28"
            strokeWidth={2}
          />
          {/* Circular Connection Socket in Center of Front Face */}
          <Circle x={cx - r * 0.4} y={cy + r * 0.4} radius={r * 0.22} fill="#1E1E28" opacity={0.35} />
          <Circle x={cx + r * 0.4} y={cy + r * 0.4} radius={r * 0.22} fill="#1E1E28" opacity={0.35} />
          {/* Top Knob */}
          <Circle x={cx} y={cy - r * 0.5} radius={r * 0.25} fill="#FFFFFF" opacity={0.4} stroke="#1E1E28" strokeWidth={1} />
        </Group>
      </TileShell>
    );
  }

  // 5. Unit Cube (1) - 3D Isometric Unit Cube
  const s = effectiveSize > 0 ? effectiveSize : 44;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.44;
  const cos30 = 0.866;
  const sin30 = 0.5;

  return (
    <TileShell id={id} x={x} y={y} rotation={rotation} width={s} height={s} isLocked={isLocked} isSelected={isSelected}>
      <Group>
        <Line points={[cx, cy - r, cx + r * cos30, cy - r * sin30, cx, cy, cx - r * cos30, cy - r * sin30]} closed fill="#FDBA74" stroke="#9A3412" strokeWidth={1.5} />
        <Line points={[cx - r * cos30, cy - r * sin30, cx, cy, cx, cy + r, cx - r * cos30, cy + r * sin30]} closed fill="#FB923C" stroke="#9A3412" strokeWidth={1.5} />
        <Line points={[cx, cy, cx + r * cos30, cy - r * sin30, cx + r * cos30, cy + r * sin30, cx, cy + r]} closed fill="#EA580C" stroke="#9A3412" strokeWidth={1.5} />
      </Group>
    </TileShell>
  );
});
