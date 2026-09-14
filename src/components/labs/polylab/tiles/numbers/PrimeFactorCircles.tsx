'use client';

import React, { memo, useCallback } from 'react';
import { Group, Rect, Text, Circle, Line } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface PrimeFactorCirclesProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  value?: number;
  primes?: number[];
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

const PRIME_COLORS: Record<number, string> = {
  2: '#EF4444',
  3: '#3B82F6',
  5: '#10B981',
  7: '#F59E0B',
  11: '#8B5CF6',
  13: '#EC4899',
};

// Compute prime factorization of an integer
function getPrimeFactors(n: number): number[] {
  const factors: number[] = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      factors.push(d);
      n /= d;
    }
    d++;
  }
  if (n > 1) factors.push(n);
  return factors;
}

export const PrimeFactorCircles = memo(function PrimeFactorCircles({
  id,
  x,
  y,
  rotation = 0,
  value = 12,
  width = 160,
  height = 160,
  isLocked = false,
  isSelected = false,
}: PrimeFactorCirclesProps) {
  const intrinsicW = 160;
  const intrinsicH = 160;

  const updateTileProps = useCanvasStore((s) => s.updateTileProps);
  const factors = getPrimeFactors(value);

  const cycleValue = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const candidates = [6, 12, 18, 24, 30, 36, 42, 60, 72];
      const curIdx = candidates.indexOf(value);
      const nextVal = candidates[(curIdx + 1) % candidates.length];
      updateTileProps(id, { value: nextVal });
    },
    [id, value, updateTileProps]
  );

  const cx = intrinsicW / 2;
  const cy = intrinsicH / 2;
  const ringRadius = 45;

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={intrinsicW}
      height={intrinsicH}
      isLocked={isLocked}
      isSelected={isSelected}
    >
      <Group onClick={cycleValue} onTap={cycleValue}>
        {/* Background Outer Ring */}
        <Circle x={cx} y={cy} radius={ringRadius + 18} fill="#F8FAFC" stroke="#CBD5E1" strokeWidth={2} shadowColor="rgba(0,0,0,0.1)" shadowBlur={6} />
        <Circle x={cx} y={cy} radius={ringRadius} fill="none" stroke="#E2E8F0" strokeWidth={1.5} dash={[3, 3]} />

        {/* Center Total Value Badge */}
        <Circle x={cx} y={cy} radius={22} fill="#1E293B" stroke="#0F172A" strokeWidth={2} />
        <Text
          x={cx - 20}
          y={cy - 10}
          width={40}
          text={String(value)}
          align="center"
          fontSize={16}
          fontStyle="bold"
          fill="#FFFFFF"
        />

        {/* Prime Bubble Nodes Around Circumference */}
        {factors.map((p, i) => {
          const angle = (i / factors.length) * Math.PI * 2 - Math.PI / 2;
          const px = cx + ringRadius * Math.cos(angle);
          const py = cy + ringRadius * Math.sin(angle);
          const nodeColor = PRIME_COLORS[p] || '#64748B';

          return (
            <Group key={`prime_${i}`}>
              <Line points={[cx, cy, px, py]} stroke={nodeColor} strokeWidth={2} opacity={0.6} />
              <Circle x={px} y={py} radius={14} fill={nodeColor} stroke="#FFFFFF" strokeWidth={2} />
              <Text
                x={px - 14}
                y={py - 6}
                width={28}
                text={String(p)}
                align="center"
                fontSize={12}
                fontStyle="bold"
                fill="#FFFFFF"
              />
            </Group>
          );
        })}

        {/* Bottom Label */}
        <Text
          x={0}
          y={intrinsicH - 14}
          width={intrinsicW}
          text={`Factors: ${factors.join(' × ')}`}
          align="center"
          fontSize={9}
          fontStyle="bold"
          fill="#64748B"
        />
      </Group>
    </TileShell>
  );
});
