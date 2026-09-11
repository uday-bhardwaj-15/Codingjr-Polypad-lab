'use client';

import React, { memo, useCallback } from 'react';
import { Group, Wedge, Circle, Text, Line } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { sliceAngles, formatValue } from './fraction.utils';
import { getFractionColor } from '../shared/palette';
import type { FractionDisplayMode } from './fraction.types';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface FractionCircleProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  denominator?: number;
  count?: number;
  mode?: FractionDisplayMode;
  color?: string;
  radius?: number;
  adjustable?: boolean;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const FractionCircle = memo(function FractionCircle({
  id,
  x,
  y,
  rotation = 0,
  denominator = 4,
  count = 1,
  mode = 'fraction',
  color,
  radius = 64,
  adjustable = true,
  isLocked = false,
  isSelected = false,
}: FractionCircleProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const safeDenom = Math.max(1, Math.min(24, Math.round(denominator)));
  const safeCount = Math.max(0, Math.min(safeDenom, Math.round(count)));
  const fillColor = color || getFractionColor(safeDenom);
  const slices = sliceAngles(safeDenom);
  const diameter = radius * 2;

  const handleWedgeClick = useCallback(
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

  const handleDenomChange = useCallback(
    (delta: number, e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const nextDenom = Math.max(1, Math.min(24, safeDenom + delta));
      const nextCount = Math.min(safeCount, nextDenom);
      updateTileProps(id, { denominator: nextDenom, count: nextCount });
    },
    [id, safeDenom, safeCount, updateTileProps]
  );

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
      {/* Centered Group container */}
      <Group x={radius} y={radius}>
        {/* Background circle */}
        <Circle
          radius={radius}
          fill="#F8FAFC"
          stroke="#CBD5E1"
          strokeWidth={1.5}
          shadowColor="rgba(0, 0, 0, 0.06)"
          shadowBlur={8}
          shadowOffsetY={3}
        />

        {/* Wedges */}
        {slices.map((slice, i) => {
          const isShaded = i < safeCount;

          return (
            <Wedge
              key={i}
              radius={radius - 1}
              angle={slice.sweepAngleDeg}
              rotation={slice.startAngleDeg}
              fill={isShaded ? fillColor : '#F8FAFC'}
              opacity={isShaded ? 0.92 : 1}
              stroke="#94A3B8"
              strokeWidth={1}
              onClick={(e) => handleWedgeClick(i, e)}
              onTap={(e) => handleWedgeClick(i, e)}
            />
          );
        })}

        {/* Center Readout Badge */}
        {mode !== 'hidden' && (
          <Group listening={false}>
            <Circle
              radius={Math.min(26, radius * 0.42)}
              fill="#0F172A"
              opacity={0.92}
              shadowColor="rgba(0,0,0,0.2)"
              shadowBlur={4}
            />
            <Text
              x={-28}
              y={-7}
              width={56}
              text={formatValue(safeCount, safeDenom, mode)}
              align="center"
              fontSize={11}
              fontStyle="bold"
              fontFamily="Inter, system-ui, sans-serif"
              fill="#FFFFFF"
            />
          </Group>
        )}

        {/* Stepper controls when selected */}
        {isSelected && adjustable && (
          <Group x={radius + 12} y={-20}>
            <Group onClick={(e) => handleDenomChange(1, e)}>
              <Circle radius={10} fill="#3B82F6" />
              <Text
                x={-10}
                y={-6}
                width={20}
                text="+"
                align="center"
                fontSize={13}
                fontStyle="bold"
                fill="#FFFFFF"
              />
            </Group>
            <Group onClick={(e) => handleDenomChange(-1, e)} y={24}>
              <Circle radius={10} fill="#64748B" />
              <Text
                x={-10}
                y={-6}
                width={20}
                text="−"
                align="center"
                fontSize={13}
                fontStyle="bold"
                fill="#FFFFFF"
              />
            </Group>
          </Group>
        )}
      </Group>
    </TileShell>
  );
});
