'use client';

import React, { memo, useCallback } from 'react';
import { Group, Line, Circle, Text } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export type LinkageType = 'four-bar' | 'pantograph' | 'crank-rocker';

export interface LinkageProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  linkageType?: LinkageType;
  angle?: number;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const Linkage = memo(function Linkage({
  id,
  x,
  y,
  rotation = 0,
  linkageType = 'four-bar',
  angle = 45,
  width = 180,
  height = 140,
  isLocked = false,
  isSelected = false,
}: LinkageProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const rotateJoint = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const nextAngle = (angle + 30) % 360;
      updateTileProps(id, { angle: nextAngle });
    },
    [id, angle, updateTileProps]
  );

  // Linkage geometry
  const p0 = { x: 30, y: 110 }; // Fixed base 1
  const p1 = { x: 150, y: 110 }; // Fixed base 2

  const r1 = 45; // Crank length
  const rad = (angle * Math.PI) / 180;
  const p2 = { x: p0.x + r1 * Math.cos(rad), y: p0.y - r1 * Math.sin(rad) }; // Crank joint

  // Coupler point
  const p3 = { x: p1.x - 35, y: p2.y - 15 };

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={width}
      height={height}
      isLocked={isLocked}
      isSelected={isSelected}
    >
      <Group onClick={rotateJoint} onTap={rotateJoint}>
        {/* Base Ground Line */}
        <Line points={[p0.x - 10, p0.y + 10, p1.x + 10, p1.y + 10]} stroke="#64748B" strokeWidth={3} />
        {/* Ground Support Triangles */}
        <Line points={[p0.x - 8, p0.y + 10, p0.x + 8, p0.y + 10, p0.x, p0.y]} closed fill="#475569" />
        <Line points={[p1.x - 8, p1.y + 10, p1.x + 8, p1.y + 10, p1.x, p1.y]} closed fill="#475569" />

        {/* Link 1: Crank (Orange) */}
        <Line points={[p0.x, p0.y, p2.x, p2.y]} stroke="#F97316" strokeWidth={6} lineCap="round" />
        {/* Link 2: Coupler (Blue) */}
        <Line points={[p2.x, p2.y, p3.x, p3.y]} stroke="#3B82F6" strokeWidth={6} lineCap="round" />
        {/* Link 3: Rocker (Green) */}
        <Line points={[p1.x, p1.y, p3.x, p3.y]} stroke="#10B981" strokeWidth={6} lineCap="round" />

        {/* Pivot Joint Hinges */}
        <Circle x={p0.x} y={p0.y} radius={6} fill="#FFFFFF" stroke="#1E1E28" strokeWidth={2} />
        <Circle x={p1.x} y={p1.y} radius={6} fill="#FFFFFF" stroke="#1E1E28" strokeWidth={2} />
        <Circle x={p2.x} y={p2.y} radius={6} fill="#F97316" stroke="#FFFFFF" strokeWidth={2} />
        <Circle x={p3.x} y={p3.y} radius={6} fill="#3B82F6" stroke="#FFFFFF" strokeWidth={2} />

        {/* Label */}
        <Text
          x={0}
          y={4}
          width={width}
          text="4-Bar Linkage (Click joint to rotate)"
          align="center"
          fontSize={9}
          fontStyle="bold"
          fill="#475569"
        />
      </Group>
    </TileShell>
  );
});
