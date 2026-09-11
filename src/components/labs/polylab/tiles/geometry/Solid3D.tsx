'use client';

import React, { memo } from 'react';
import { Group, Line, Ellipse, Circle, Path, Text } from 'react-konva';
import { TileShell } from '../shared/TileShell';

export type Solid3DType =
  | 'cube'
  | 'cylinder'
  | 'cone'
  | 'sphere'
  | 'pyramid'
  | 'triangular-prism'
  | 'hexagonal-prism'
  | 'hemisphere';

export interface Solid3DProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  solidType?: Solid3DType;
  color?: string;
  size?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const Solid3D = memo(function Solid3D({
  id,
  x,
  y,
  rotation = 0,
  solidType = 'cube',
  color = '#8B5CF6',
  size = 120,
  isLocked = false,
  isSelected = false,
}: Solid3DProps) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;

  // 1. 3D Cube
  if (solidType === 'cube') {
    const r = s * 0.44;
    const cos30 = 0.866;
    const sin30 = 0.5;

    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={s} height={s} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          <Line points={[cx, cy - r, cx + r * cos30, cy - r * sin30, cx, cy, cx - r * cos30, cy - r * sin30]} closed fill="#A78BFA" stroke="#1E1E28" strokeWidth={2.5} />
          <Line points={[cx - r * cos30, cy - r * sin30, cx, cy, cx, cy + r, cx - r * cos30, cy + r * sin30]} closed fill="#7C3AED" stroke="#1E1E28" strokeWidth={2.5} />
          <Line points={[cx, cy, cx + r * cos30, cy - r * sin30, cx + r * cos30, cy + r * sin30, cx, cy + r]} closed fill="#6D28D9" stroke="#1E1E28" strokeWidth={2.5} />
        </Group>
      </TileShell>
    );
  }

  // 2. 3D Cylinder
  if (solidType === 'cylinder') {
    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={s} height={s} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          {/* Cylinder Body */}
          <Path data={`M ${cx - 34},${cy - 24} L ${cx + 34},${cy - 24} L ${cx + 34},${cy + 28} A 34,14 0 0,1 ${cx - 34},${cy + 28} Z`} fill="#0EA5E9" stroke="#1E1E28" strokeWidth={2.5} />
          {/* Bottom Ellipse */}
          <Ellipse x={cx} y={cy + 28} radiusX={34} radiusY={14} fill="#0284C7" stroke="#1E1E28" strokeWidth={2.5} />
          {/* Top Ellipse */}
          <Ellipse x={cx} y={cy - 24} radiusX={34} radiusY={14} fill="#38BDF8" stroke="#1E1E28" strokeWidth={2.5} />
        </Group>
      </TileShell>
    );
  }

  // 3. 3D Cone
  if (solidType === 'cone') {
    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={s} height={s} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          {/* Cone Body */}
          <Line points={[cx, cy - 40, cx - 38, cy + 28, cx + 38, cy + 28]} closed fill="#F59E0B" stroke="#1E1E28" strokeWidth={2.5} />
          {/* Base Ellipse */}
          <Ellipse x={cx} y={cy + 28} radiusX={38} radiusY={15} fill="#D97706" stroke="#1E1E28" strokeWidth={2.5} />
        </Group>
      </TileShell>
    );
  }

  // 4. 3D Pyramid (Square Base)
  if (solidType === 'pyramid') {
    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={s} height={s} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          {/* Left Triangular Face */}
          <Line points={[cx, cy - 40, cx - 44, cy + 26, cx + 6, cy + 34]} closed fill="#EC4899" stroke="#1E1E28" strokeWidth={2.5} />
          {/* Right Triangular Face */}
          <Line points={[cx, cy - 40, cx + 6, cy + 34, cx + 46, cy + 18]} closed fill="#BE185D" stroke="#1E1E28" strokeWidth={2.5} />
        </Group>
      </TileShell>
    );
  }

  // 5. 3D Triangular Prism
  if (solidType === 'triangular-prism') {
    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={s} height={s} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          {/* Top Slanted Face */}
          <Line points={[cx - 30, cy - 25, cx + 25, cy - 40, cx + 45, cy + 5, cx - 10, cy + 20]} closed fill="#34D399" stroke="#065F46" strokeWidth={2.5} />
          {/* Front Triangle */}
          <Line points={[cx - 30, cy - 25, cx - 10, cy + 20, cx - 45, cy + 25]} closed fill="#10B981" stroke="#065F46" strokeWidth={2.5} />
          {/* Bottom Slanted Face */}
          <Line points={[cx - 10, cy + 20, cx - 45, cy + 25, cx + 10, cy + 40, cx + 45, cy + 5]} closed fill="#059669" stroke="#065F46" strokeWidth={2.5} />
        </Group>
      </TileShell>
    );
  }

  // 6. 3D Sphere
  return (
    <TileShell id={id} x={x} y={y} rotation={rotation} width={s} height={s} isLocked={isLocked} isSelected={isSelected}>
      <Group>
        <Circle x={cx} y={cy} radius={38} fill="#10B981" stroke="#1E1E28" strokeWidth={2.5} />
        <Ellipse x={cx} y={cy} radiusX={38} radiusY={14} stroke="#047857" strokeWidth={1.5} dash={[4, 3]} />
        {/* Shading specular highlight */}
        <Circle x={cx - 12} y={cy - 12} radius={8} fill="#A7F3D0" opacity={0.6} />
      </Group>
    </TileShell>
  );
});
