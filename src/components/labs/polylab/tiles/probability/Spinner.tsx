'use client';

import React, { memo, useCallback, useState } from 'react';
import { Group, Wedge, Circle, Line, Text } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { sliceAngles } from '../fraction/fraction.utils';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface SpinnerProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  sectors?: number;
  needleAngle?: number;
  radius?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

const SECTOR_COLORS = [
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export const Spinner = memo(function Spinner({
  id,
  x,
  y,
  rotation = 0,
  sectors = 4,
  needleAngle = 0,
  radius = 64,
  isLocked = false,
  isSelected = false,
}: SpinnerProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);
  const [isSpinning, setIsSpinning] = useState(false);

  const safeSectors = Math.max(2, Math.min(12, Math.round(sectors)));
  const slices = sliceAngles(safeSectors);
  const diameter = radius * 2;

  const spin = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      if (isSpinning) return;
      setIsSpinning(true);

      const extraSpins = 360 * (3 + Math.floor(Math.random() * 3));
      const targetAngle = (needleAngle + extraSpins + Math.random() * 360) % 360;

      let current = needleAngle;
      let speed = 25;

      const interval = setInterval(() => {
        current = (current + speed) % 360;
        speed *= 0.94;
        updateTileProps(id, { needleAngle: current }, false);

        if (speed < 0.4) {
          clearInterval(interval);
          updateTileProps(id, { needleAngle: targetAngle }, true);
          setIsSpinning(false);
        }
      }, 25);
    },
    [id, needleAngle, isSpinning, updateTileProps]
  );

  const needleRad = ((needleAngle - 90) * Math.PI) / 180;
  const needleLen = radius * 0.75;
  const tipX = needleLen * Math.cos(needleRad);
  const tipY = needleLen * Math.sin(needleRad);

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
      <Group x={radius} y={radius}>
        {/* Sectors */}
        {slices.map((slice, i) => {
          const color = SECTOR_COLORS[i % SECTOR_COLORS.length];
          return (
            <Wedge
              key={i}
              radius={radius}
              angle={slice.sweepAngleDeg}
              rotation={slice.startAngleDeg}
              fill={color}
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          );
        })}

        {/* Needle Arrow */}
        <Line
          points={[0, 0, tipX, tipY]}
          stroke="#0F172A"
          strokeWidth={4}
          lineCap="round"
        />

        {/* Center Spinner Button */}
        <Group onClick={spin} onTap={spin}>
          <Circle
            radius={16}
            fill="#0F172A"
            stroke="#FFFFFF"
            strokeWidth={2}
            shadowColor="rgba(0,0,0,0.3)"
            shadowBlur={4}
          />
          <Text
            x={-14}
            y={-5}
            width={28}
            text="SPIN"
            align="center"
            fontSize={8}
            fontStyle="bold"
            fontFamily="Inter, system-ui, sans-serif"
            fill="#FFFFFF"
          />
        </Group>
      </Group>
    </TileShell>
  );
});
