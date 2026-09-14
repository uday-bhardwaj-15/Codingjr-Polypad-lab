'use client';

import React, { memo, useCallback } from 'react';
import { Group, Rect, Circle, Text } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export type DotPattern = 'array' | 'triangular' | 'dice-5' | 'circle';

export interface DotArrangementProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  pattern?: DotPattern;
  rows?: number;
  cols?: number;
  color?: string;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const DotArrangement = memo(function DotArrangement({
  id,
  x,
  y,
  rotation = 0,
  pattern = 'array',
  rows = 3,
  cols = 4,
  color = '#2563EB',
  width = 160,
  height = 130,
  isLocked = false,
  isSelected = false,
}: DotArrangementProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const cyclePattern = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const patterns: DotPattern[] = ['array', 'triangular', 'dice-5', 'circle'];
      const nextPat = patterns[(patterns.indexOf(pattern) + 1) % patterns.length];
      updateTileProps(id, { pattern: nextPat });
    },
    [id, pattern, updateTileProps]
  );

  const dots: { x: number; y: number }[] = [];

  const baseW = 160;
  const baseH = 130;

  if (pattern === 'array') {
    const spacingX = (baseW - 40) / (cols - 1 || 1);
    const spacingY = (baseH - 50) / (rows - 1 || 1);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({ x: 20 + c * spacingX, y: 25 + r * spacingY });
      }
    }
  } else if (pattern === 'triangular') {
    const n = 4; // 1 + 2 + 3 + 4 = 10 dots
    for (let r = 0; r < n; r++) {
      const rowDots = r + 1;
      const startX = baseW / 2 - ((rowDots - 1) * 22) / 2;
      const py = 25 + r * 22;
      for (let c = 0; c < rowDots; c++) {
        dots.push({ x: startX + c * 22, y: py });
      }
    }
  } else if (pattern === 'dice-5') {
    const cx = baseW / 2;
    const cy = baseH / 2 - 5;
    dots.push({ x: cx, y: cy });
    dots.push({ x: cx - 35, y: cy - 25 });
    dots.push({ x: cx + 35, y: cy - 25 });
    dots.push({ x: cx - 35, y: cy + 25 });
    dots.push({ x: cx + 35, y: cy + 25 });
  } else {
    // Circle of 8 dots
    const cx = baseW / 2;
    const cy = baseH / 2 - 5;
    const rad = 35;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      dots.push({ x: cx + rad * Math.cos(angle), y: cy + rad * Math.sin(angle) });
    }
  }

  const scaleX = width / baseW;
  const scaleY = height / baseH;
  const dotScale = Math.min(scaleX, scaleY);

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
      <Group onClick={cyclePattern} onTap={cyclePattern}>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#FFFFFF"
          stroke="#1E1E28"
          strokeWidth={2}
          cornerRadius={8}
          shadowColor="rgba(0,0,0,0.1)"
          shadowBlur={6}
        />

        {/* Dots */}
        {dots.map((d, i) => (
          <Circle
            key={`dot_${i}`}
            x={d.x * scaleX}
            y={d.y * scaleY}
            radius={7 * dotScale}
            fill={color}
            stroke="#1E1E28"
            strokeWidth={1.5 * dotScale}
            shadowColor="rgba(0,0,0,0.15)"
            shadowBlur={2 * dotScale}
          />
        ))}

        {/* Count Badge at Bottom */}
        <Text
          x={0}
          y={height - 18}
          width={width}
          text={`Total: ${dots.length} dots (${pattern})`}
          align="center"
          fontSize={10}
          fontStyle="bold"
          fill="#64748B"
        />
      </Group>
    </TileShell>
  );
});
