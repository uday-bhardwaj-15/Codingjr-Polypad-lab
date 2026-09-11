'use client';

import React, { memo, useCallback, useState } from 'react';
import { Group, Text, Line } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export type PolyhedralType =
  | 'D4'
  | 'D8'
  | 'D10'
  | 'D12'
  | 'D20'
  | 'efron-A'
  | 'efron-B'
  | 'efron-C'
  | 'efron-D';

export interface PolyhedralDiceProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  sides?: number;
  diceType?: PolyhedralType;
  value?: number;
  color?: string;
  size?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

const EFRON_FACES: Record<string, number[]> = {
  'efron-A': [4, 4, 4, 4, 0, 0],
  'efron-B': [3, 3, 3, 3, 3, 3],
  'efron-C': [6, 6, 2, 2, 2, 2],
  'efron-D': [5, 5, 5, 1, 1, 1],
};

export const PolyhedralDice = memo(function PolyhedralDice({
  id,
  x,
  y,
  rotation = 0,
  diceType = 'D20',
  value = 20,
  color,
  size = 64,
  isLocked = false,
  isSelected = false,
}: PolyhedralDiceProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);
  const [isRolling, setIsRolling] = useState(false);

  const getSidesCount = (): number => {
    if (diceType === 'D4') return 4;
    if (diceType === 'D8') return 8;
    if (diceType === 'D10') return 10;
    if (diceType === 'D12') return 12;
    if (diceType === 'D20') return 20;
    return 6;
  };

  const getThemeColor = (): string => {
    if (color) return color;
    if (diceType === 'D4') return '#EF4444';
    if (diceType === 'D8') return '#3B82F6';
    if (diceType === 'D10') return '#10B981';
    if (diceType === 'D12') return '#F59E0B';
    if (diceType === 'D20') return '#8B5CF6';
    if (diceType === 'efron-A') return '#2563EB';
    if (diceType === 'efron-B') return '#DC2626';
    if (diceType === 'efron-C') return '#16A34A';
    if (diceType === 'efron-D') return '#D97706';
    return '#8B5CF6';
  };

  const roll = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      if (isRolling) return;
      setIsRolling(true);

      let ticks = 0;
      const interval = setInterval(() => {
        let randVal = Math.floor(Math.random() * getSidesCount()) + 1;
        if (diceType.startsWith('efron-')) {
          const faces = EFRON_FACES[diceType] || [1, 2, 3, 4, 5, 6];
          randVal = faces[Math.floor(Math.random() * faces.length)];
        }
        updateTileProps(id, { value: randVal }, false);
        ticks++;

        if (ticks >= 7) {
          clearInterval(interval);
          let finalVal = Math.floor(Math.random() * getSidesCount()) + 1;
          if (diceType.startsWith('efron-')) {
            const faces = EFRON_FACES[diceType] || [1, 2, 3, 4, 5, 6];
            finalVal = faces[Math.floor(Math.random() * faces.length)];
          }
          updateTileProps(id, { value: finalVal }, true);
          setIsRolling(false);
        }
      }, 50);
    },
    [id, diceType, isRolling, updateTileProps]
  );

  const cx = size / 2;
  const cy = size / 2;
  const rad = size * 0.44;
  const fill = getThemeColor();

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
      <Group onClick={roll} onTap={roll}>
        {/* D20 / Icosahedron / Polyhedron outer shape */}
        <Line
          points={[
            cx, cy - rad,
            cx + rad * 0.866, cy - rad * 0.5,
            cx + rad * 0.866, cy + rad * 0.5,
            cx, cy + rad,
            cx - rad * 0.866, cy + rad * 0.5,
            cx - rad * 0.866, cy - rad * 0.5,
          ]}
          closed
          fill={fill}
          stroke="#1E1E28"
          strokeWidth={3}
          shadowColor="rgba(0,0,0,0.25)"
          shadowBlur={6}
          shadowOffsetY={3}
        />

        {/* Inner Facet Wireframe lines */}
        <Line
          points={[cx, cy - rad, cx, cy + rad]}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1.5}
        />
        <Line
          points={[cx - rad * 0.866, cy - rad * 0.5, cx + rad * 0.866, cy + rad * 0.5]}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1.5}
        />
        <Line
          points={[cx - rad * 0.866, cy + rad * 0.5, cx + rad * 0.866, cy - rad * 0.5]}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1.5}
        />

        {/* Die Value Label */}
        <Text
          x={0}
          y={cy - 12}
          width={size}
          text={String(value)}
          align="center"
          fontSize={18}
          fontStyle="bold"
          fontFamily="Inter, system-ui, sans-serif"
          fill="#FFFFFF"
          listening={false}
        />

        {/* Small Type Badge at Bottom */}
        <Text
          x={0}
          y={size - 13}
          width={size}
          text={diceType}
          align="center"
          fontSize={8}
          fontStyle="bold"
          fill="rgba(255,255,255,0.8)"
          listening={false}
        />
      </Group>
    </TileShell>
  );
});
