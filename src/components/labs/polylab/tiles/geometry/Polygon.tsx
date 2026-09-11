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
  showLabels?: boolean;
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
  showLabels = false,
  isLocked = false,
  isSelected = false,
}: PolygonProps) {
  const diameter = radius * 2;

  // Calculate vertices for regular n-gon
  const getVertices = (): number[] => {
    if (sides < 3) return [];
    const points: number[] = [];
    const angleStep = (2 * Math.PI) / sides;
    const startAngle = -Math.PI / 2; // Point top vertex up

    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      const px = radius + radius * Math.cos(angle);
      const py = radius + radius * Math.sin(angle);
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
            strokeWidth={2}
            shadowColor="rgba(0, 0, 0, 0.1)"
            shadowBlur={6}
            shadowOffsetY={2}
          />
        ) : (
          <Circle
            x={radius}
            y={radius}
            radius={radius}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2}
            shadowColor="rgba(0, 0, 0, 0.1)"
            shadowBlur={6}
            shadowOffsetY={2}
          />
        )}

        {showLabels && (
          <Text
            x={0}
            y={radius - 7}
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
