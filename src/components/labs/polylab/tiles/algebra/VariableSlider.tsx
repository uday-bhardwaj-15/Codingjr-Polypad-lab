'use client';

import React, { memo, useCallback } from 'react';
import { Group, Rect, Text, Line, Circle } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface VariableSliderProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  variableName?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  color?: string;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const VariableSlider = memo(function VariableSlider({
  id,
  x,
  y,
  rotation = 0,
  variableName = 'a',
  value = 5,
  min = 0,
  max = 10,
  step = 1,
  color = '#8B5CF6',
  width = 240,
  height = 70,
  isLocked = false,
  isSelected = false,
}: VariableSliderProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const trackStartX = 65;
  const trackEndX = width - 45;
  const trackWidth = trackEndX - trackStartX;
  const clampedVal = Math.min(max, Math.max(min, value));
  const frac = (clampedVal - min) / (max - min || 1);
  const thumbX = trackStartX + frac * trackWidth;

  const handleStep = useCallback(
    (delta: number, e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const nextVal = Math.min(max, Math.max(min, Number((clampedVal + delta).toFixed(2))));
      updateTileProps(id, { value: nextVal });
    },
    [id, clampedVal, min, max, updateTileProps]
  );

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
      <Group>
        {/* Main Card */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#FFFFFF"
          stroke="#1E1E28"
          strokeWidth={2}
          cornerRadius={8}
          shadowColor="rgba(0,0,0,0.12)"
          shadowBlur={6}
        />

        {/* Variable Name Badge */}
        <Rect x={10} y={15} width={40} height={40} fill={color} cornerRadius={6} />
        <Text
          x={10}
          y={24}
          width={40}
          text={variableName}
          align="center"
          fontSize={20}
          fontStyle="bold"
          fontFamily="Georgia, serif"
          fill="#FFFFFF"
        />

        {/* Current Value Display & Stepper Buttons */}
        <Text
          x={trackStartX}
          y={12}
          text={`${variableName} = ${clampedVal}`}
          fontSize={12}
          fontStyle="bold"
          fill="#1E293B"
        />

        {/* Minus Button */}
        <Group x={width - 40} y={10} onClick={(e) => handleStep(-step, e)} onTap={(e) => handleStep(-step, e)}>
          <Rect x={0} y={0} width={16} height={16} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth={1} cornerRadius={3} />
          <Text x={0} y={1} width={16} text="-" align="center" fontSize={12} fontStyle="bold" fill="#334155" />
        </Group>

        {/* Plus Button */}
        <Group x={width - 20} y={10} onClick={(e) => handleStep(step, e)} onTap={(e) => handleStep(step, e)}>
          <Rect x={0} y={0} width={16} height={16} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth={1} cornerRadius={3} />
          <Text x={0} y={1} width={16} text="+" align="center" fontSize={12} fontStyle="bold" fill="#334155" />
        </Group>

        {/* Slider Track */}
        <Line points={[trackStartX, 44, trackEndX, 44]} stroke="#E2E8F0" strokeWidth={6} lineCap="round" />
        <Line points={[trackStartX, 44, thumbX, 44]} stroke={color} strokeWidth={6} lineCap="round" />

        {/* Min / Max Tick Labels */}
        <Text x={trackStartX} y={54} text={String(min)} fontSize={8} fill="#94A3B8" />
        <Text x={trackEndX - 8} y={54} text={String(max)} fontSize={8} fill="#94A3B8" />

        {/* Draggable Thumb Knob */}
        <Circle x={thumbX} y={44} radius={9} fill="#FFFFFF" stroke={color} strokeWidth={3} shadowColor="rgba(0,0,0,0.2)" shadowBlur={4} />
      </Group>
    </TileShell>
  );
});
