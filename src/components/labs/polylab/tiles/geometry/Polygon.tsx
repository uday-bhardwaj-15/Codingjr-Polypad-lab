'use client';

import React, { memo } from 'react';
import { Group, Line, Circle, Text } from 'react-konva';
import { TileShell } from '../shared/TileShell';

export interface PolygonProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  sides?: number; // 3: Triangle, 4: Square, 5: Pentagon, 6: Hexagon, 8: Octagon, 0: Circle
  radius?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  showLabels?: boolean;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

const POLYGON_NAMES: Record<number, string> = {
  0: 'Circle',
  3: 'Triangle',
  4: 'Square',
  5: 'Pentagon',
  6: 'Hexagon',
  8: 'Octagon',
};

export const Polygon = memo(function Polygon({
  id,
  x,
  y,
  rotation = 0,
  sides = 6,
  radius = 50,
  fillColor = '#10B981',
  strokeColor = '#047857',
  strokeWidth = 2,
  showLabels = false,
  width,
  height,
  scaleX = 1,
  scaleY = 1,
  isLocked = false,
  isSelected = false,
}: PolygonProps) {
  // Use width/height if provided (from resize), otherwise use radius
  const effectiveR = width ? Math.min(width, height ?? width) / 2 : radius;
  const diameter = effectiveR * 2;

  // Calculate vertices for regular n-gon
  const getVertices = (): number[] => {
    if (sides < 3) return [];
    const points: number[] = [];
    const angleStep = (2 * Math.PI) / sides;
    const startAngle = -Math.PI / 2;
    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      const px = effectiveR + effectiveR * Math.cos(angle);
      const py = effectiveR + effectiveR * Math.sin(angle);
      points.push(px, py);
    }
    return points;
  };

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={diameter}
      height={diameter}
      scaleX={1}
      scaleY={1}
      isLocked={isLocked}
      isSelected={isSelected}
    >
      <Group>
        {sides >= 3 ? (
          <Line
            points={getVertices()}
            closed
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            shadowColor="rgba(0, 0, 0, 0.1)"
            shadowBlur={6}
            shadowOffsetY={2}
          />
        ) : (
          <Circle
            x={effectiveR}
            y={effectiveR}
            radius={effectiveR}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            shadowColor="rgba(0, 0, 0, 0.1)"
            shadowBlur={6}
            shadowOffsetY={2}
          />
        )}

        {showLabels && (
          <Text
            x={0}
            y={effectiveR - 7}
            width={diameter}
            text={POLYGON_NAMES[sides] || `${sides}-gon`}
            align="center"
            fontSize={11}
            fontStyle="bold"
            fontFamily="Inter, system-ui, sans-serif"
            fill="#FFFFFF"
            listening={false}
          />
        )}
      </Group>
    </TileShell>
  );
});
