'use client';

import React, { memo, useCallback } from 'react';
import { Group, Rect, Text } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface NumberCardProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  value?: string | number;
  color?: string;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
  variant?: 'digit' | 'operator' | 'variable';
}

export const NumberCard = memo(function NumberCard({
  id,
  x,
  y,
  rotation = 0,
  value = 1,
  color,
  width = 54,
  height = 64,
  isLocked = false,
  isSelected = false,
  variant = 'digit',
}: NumberCardProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const getBgFill = () => {
    if (color) return color;
    if (variant === 'operator') return '#0F172A';
    if (variant === 'variable') return '#7C3AED';
    return '#0284C7';
  };

  const getTextColor = () => '#FFFFFF';

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
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={getBgFill()}
        cornerRadius={10}
        stroke="#E2E8F0"
        strokeWidth={1}
        shadowColor="rgba(0, 0, 0, 0.12)"
        shadowBlur={8}
        shadowOffsetY={3}
      />
      <Text
        x={0}
        y={height / 2 - 14}
        width={width}
        text={String(value)}
        align="center"
        fontSize={24}
        fontStyle="bold"
        fontFamily="Inter, system-ui, sans-serif"
        fill={getTextColor()}
        listening={false}
      />
    </TileShell>
  );
});
