'use client';

import React, { memo, useCallback } from 'react';
import { Group, Rect, Text, Line, Arc } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { formatValue } from './fraction.utils';
import { getFractionColor } from '../shared/palette';
import type { FractionDisplayMode } from './fraction.types';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface FractionBarProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  denominator?: number;
  count?: number;
  mode?: FractionDisplayMode;
  color?: string;
  width?: number;
  height?: number;
  adjustable?: boolean;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const FractionBar = memo(function FractionBar({
  id,
  x,
  y,
  rotation = 0,
  denominator = 1,
  count = 1,
  mode = 'fraction',
  color,
  width = 300,
  height = 50,
  adjustable = true,
  isLocked = false,
  isSelected = false,
}: FractionBarProps) {
  const intrinsicW = 300;
  const intrinsicH = 50;

  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const safeDenom = Math.max(1, Math.min(24, Math.round(denominator)));
  const safeCount = Math.max(0, Math.min(safeDenom, Math.round(count)));
  const fillColor = color || getFractionColor(safeDenom);
  const segmentWidth = intrinsicW / safeDenom;

  // Segment click handler
  const handleSegmentClick = useCallback(
    (index: number, e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      let nextCount = safeCount;
      if (index < safeCount) {
        nextCount = index;
      } else {
        nextCount = index + 1;
      }
      updateTileProps(id, { count: nextCount });
    },
    [id, safeCount, updateTileProps]
  );

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={intrinsicW + 16}
      height={intrinsicH}
      isLocked={isLocked}
      isSelected={isSelected}
    >
      {/* Background container */}
      <Rect
        x={0}
        y={0}
        width={intrinsicW}
        height={intrinsicH}
        fill="#FFFFFF"
        stroke="#1E1E28"
        strokeWidth={3.5}
        cornerRadius={2}
      />

      {/* Render segments */}
      {Array.from({ length: safeDenom }).map((_, i) => {
        const isShaded = i < safeCount;
        const segX = i * segmentWidth;
        const unitLabel = formatValue(1, safeDenom, mode);

        return (
          <Group
            key={i}
            x={segX}
            y={0}
            onClick={(e) => handleSegmentClick(i, e)}
            onTap={(e) => handleSegmentClick(i, e)}
          >
            {/* Segment Fill */}
            <Rect
              x={0}
              y={0}
              width={segmentWidth}
              height={intrinsicH}
              fill={isShaded ? fillColor : '#FFFFFF'}
            />

            {/* Separator Line */}
            {i > 0 && (
              <Line
                points={[0, 0, 0, intrinsicH]}
                stroke="#1E1E28"
                strokeWidth={2}
              />
            )}

            {/* Fraction label inside each segment */}
            {mode !== 'hidden' && segmentWidth >= 24 && (
              <Text
                x={0}
                y={intrinsicH / 2 - 8}
                width={segmentWidth}
                text={unitLabel}
                align="center"
                fontSize={segmentWidth < 40 ? 11 : 14}
                fontStyle="bold"
                fontFamily="Inter, system-ui, sans-serif"
                fill="#FFFFFF"
                listening={false}
              />
            )}
          </Group>
        );
      })}

      {/* Snap tab handle on right edge (Polypad signature) */}
      <Arc
        x={intrinsicW}
        y={intrinsicH / 2}
        innerRadius={0}
        outerRadius={10}
        angle={180}
        rotation={-90}
        fill="#1E1E28"
        stroke="#1E1E28"
        strokeWidth={1}
      />

      {/* Outer border to seal all segments cleanly */}
      <Rect
        x={0}
        y={0}
        width={intrinsicW}
        height={intrinsicH}
        stroke="#1E1E28"
        strokeWidth={3.5}
        cornerRadius={2}
        listening={false}
      />
    </TileShell>
  );
});
