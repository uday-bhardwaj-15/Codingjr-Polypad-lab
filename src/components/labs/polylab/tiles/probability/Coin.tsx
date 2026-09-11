'use client';

import React, { memo, useCallback, useState } from 'react';
import { Group, Circle, Text } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface CoinProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  side?: 'heads' | 'tails';
  radius?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const Coin = memo(function Coin({
  id,
  x,
  y,
  rotation = 0,
  side = 'heads',
  radius = 32,
  isLocked = false,
  isSelected = false,
}: CoinProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);
  const [isFlipping, setIsFlipping] = useState(false);
  const diameter = radius * 2;

  const flip = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      if (isFlipping) return;
      setIsFlipping(true);

      let count = 0;
      const interval = setInterval(() => {
        const nextSide = Math.random() > 0.5 ? 'heads' : 'tails';
        updateTileProps(id, { side: nextSide }, false);
        count++;
        if (count >= 6) {
          clearInterval(interval);
          const finalSide = Math.random() > 0.5 ? 'heads' : 'tails';
          updateTileProps(id, { side: finalSide }, true);
          setIsFlipping(false);
        }
      }, 70);
    },
    [id, isFlipping, updateTileProps]
  );

  const isHeads = side === 'heads';

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
      <Group x={radius} y={radius} onClick={flip} onTap={flip}>
        {/* Outer coin rim */}
        <Circle
          radius={radius}
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth={3}
          shadowColor="rgba(0, 0, 0, 0.2)"
          shadowBlur={6}
          shadowOffsetY={3}
        />
        {/* Inner coin ring */}
        <Circle
          radius={radius - 5}
          fill="#FBBF24"
          stroke="#D97706"
          strokeWidth={1}
        />
        {/* Face label */}
        <Text
          x={-20}
          y={-12}
          width={40}
          text={isHeads ? 'H' : 'T'}
          align="center"
          fontSize={22}
          fontStyle="bold"
          fontFamily="Inter, system-ui, sans-serif"
          fill="#78350F"
        />
      </Group>
    </TileShell>
  );
});
