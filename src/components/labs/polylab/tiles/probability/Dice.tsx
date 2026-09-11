'use client';

import React, { memo, useCallback, useState } from 'react';
import { Group, Rect, Circle, Text } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface DiceProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  value?: number;
  sides?: number; // 6 (D6), 4 (D4), 8 (D8), 12 (D12), 20 (D20)
  color?: string;
  size?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

// Dot positions for standard 6-sided die (normalized 0..1)
const D6_DOTS: Record<number, Array<[number, number]>> = {
  1: [[0.5, 0.5]],
  2: [[0.28, 0.28], [0.72, 0.72]],
  3: [[0.28, 0.28], [0.5, 0.5], [0.72, 0.72]],
  4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
  5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
  6: [
    [0.28, 0.24], [0.72, 0.24],
    [0.28, 0.5], [0.72, 0.5],
    [0.28, 0.76], [0.72, 0.76],
  ],
};

export const Dice = memo(function Dice({
  id,
  x,
  y,
  rotation = 0,
  value = 1,
  sides = 6,
  color = '#E11D48',
  size = 64,
  isLocked = false,
  isSelected = false,
}: DiceProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      if (isRolling) return;
      setIsRolling(true);

      let ticks = 0;
      const interval = setInterval(() => {
        const randVal = Math.floor(Math.random() * sides) + 1;
        updateTileProps(id, { value: randVal }, false);
        ticks++;
        if (ticks >= 6) {
          clearInterval(interval);
          const finalVal = Math.floor(Math.random() * sides) + 1;
          updateTileProps(id, { value: finalVal }, true);
          setIsRolling(false);
        }
      }, 60);
    },
    [id, sides, isRolling, updateTileProps]
  );

  const dots = D6_DOTS[value] || D6_DOTS[1];

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={size}
      height={size}
      isLocked={isLocked}
      isSelected={isSelected}
    >
      <Group onClick={rollDice} onTap={rollDice}>
        {/* Die Body */}
        <Rect
          x={0}
          y={0}
          width={size}
          height={size}
          fill={color}
          cornerRadius={12}
          stroke="#9F1239"
          strokeWidth={1.5}
          shadowColor="rgba(0, 0, 0, 0.18)"
          shadowBlur={8}
          shadowOffsetY={4}
        />

        {/* Die Dots for D6 or Number Text for other dice */}
        {sides === 6 ? (
          dots.map(([dx, dy], idx) => (
            <Circle
              key={idx}
              x={dx * size}
              y={dy * size}
              radius={size * 0.085}
              fill="#FFFFFF"
              shadowColor="rgba(0,0,0,0.2)"
              shadowBlur={2}
            />
          ))
        ) : (
          <Text
            x={0}
            y={size / 2 - 12}
            width={size}
            text={String(value)}
            align="center"
            fontSize={22}
            fontStyle="bold"
            fontFamily="Inter, system-ui, sans-serif"
            fill="#FFFFFF"
          />
        )}
      </Group>
    </TileShell>
  );
});
