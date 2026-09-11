'use client';

import React, { memo, useCallback } from 'react';
import { Group, Rect, Line, Circle, Text } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface BalanceScaleProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  leftWeight?: number;
  rightWeight?: number;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const BalanceScale = memo(function BalanceScale({
  id,
  x,
  y,
  rotation = 0,
  leftWeight = 5,
  rightWeight = 5,
  width = 280,
  height = 180,
  isLocked = false,
  isSelected = false,
}: BalanceScaleProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const centerX = width / 2;
  const fulcrumY = 60;
  const beamLength = width - 40;
  const halfBeam = beamLength / 2;

  // Calculate tilt angle based on weight difference
  const weightDiff = rightWeight - leftWeight;
  const tiltAngleDeg = Math.max(-18, Math.min(18, weightDiff * 3));
  const tiltAngleRad = (tiltAngleDeg * Math.PI) / 180;

  // Left pan beam tip
  const leftTipX = centerX - halfBeam * Math.cos(tiltAngleRad);
  const leftTipY = fulcrumY - halfBeam * Math.sin(tiltAngleRad);

  // Right pan beam tip
  const rightTipX = centerX + halfBeam * Math.cos(tiltAngleRad);
  const rightTipY = fulcrumY + halfBeam * Math.sin(tiltAngleRad);

  const panStringLen = 50;
  const leftPanY = leftTipY + panStringLen;
  const rightPanY = rightTipY + panStringLen;

  const isBalanced = leftWeight === rightWeight;

  const handleWeightChange = useCallback(
    (side: 'left' | 'right', delta: number, e: Konva.KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;
      if (side === 'left') {
        const next = Math.max(0, Math.min(99, leftWeight + delta));
        updateTileProps(id, { leftWeight: next });
      } else {
        const next = Math.max(0, Math.min(99, rightWeight + delta));
        updateTileProps(id, { rightWeight: next });
      }
    },
    [id, leftWeight, rightWeight, updateTileProps]
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
      {/* Base Stand & Fulcrum */}
      <Group>
        {/* Triangular fulcrum stand */}
        <Line
          points={[centerX - 24, height - 10, centerX + 24, height - 10, centerX, fulcrumY]}
          closed
          fill="#475569"
          stroke="#1E293B"
          strokeWidth={2}
        />
        {/* Base plate */}
        <Rect
          x={centerX - 50}
          y={height - 10}
          width={100}
          height={8}
          fill="#1E293B"
          cornerRadius={4}
        />
        {/* Fulcrum Pivot Pin */}
        <Circle
          x={centerX}
          y={fulcrumY}
          radius={7}
          fill={isBalanced ? '#10B981' : '#F59E0B'}
          stroke="#1E293B"
          strokeWidth={2}
        />
      </Group>

      {/* Tilting Beam */}
      <Group>
        <Line
          points={[leftTipX, leftTipY, rightTipX, rightTipY]}
          stroke="#1E293B"
          strokeWidth={5}
          lineCap="round"
        />
      </Group>

      {/* Left Pan */}
      <Group>
        {/* Strings */}
        <Line
          points={[leftTipX, leftTipY, leftTipX - 25, leftPanY]}
          stroke="#64748B"
          strokeWidth={1.5}
        />
        <Line
          points={[leftTipX, leftTipY, leftTipX + 25, leftPanY]}
          stroke="#64748B"
          strokeWidth={1.5}
        />
        {/* Pan plate */}
        <Rect
          x={leftTipX - 30}
          y={leftPanY}
          width={60}
          height={16}
          fill="#3B82F6"
          cornerRadius={6}
          stroke="#1D4ED8"
          strokeWidth={1.5}
        />
        <Text
          x={leftTipX - 30}
          y={leftPanY + 2}
          width={60}
          text={`${leftWeight} kg`}
          align="center"
          fontSize={11}
          fontStyle="bold"
          fill="#FFFFFF"
          listening={false}
        />

        {/* Stepper for Left Pan */}
        <Group x={leftTipX - 24} y={leftPanY + 20}>
          <Group onClick={(e) => handleWeightChange('left', 1, e)}>
            <Circle x={6} y={6} radius={8} fill="#2563EB" />
            <Text x={0} y={1} width={12} text="+" align="center" fontSize={11} fontStyle="bold" fill="#FFFFFF" />
          </Group>
          <Group x={24} onClick={(e) => handleWeightChange('left', -1, e)}>
            <Circle x={6} y={6} radius={8} fill="#64748B" />
            <Text x={0} y={1} width={12} text="−" align="center" fontSize={11} fontStyle="bold" fill="#FFFFFF" />
          </Group>
        </Group>
      </Group>

      {/* Right Pan */}
      <Group>
        {/* Strings */}
        <Line
          points={[rightTipX, rightTipY, rightTipX - 25, rightPanY]}
          stroke="#64748B"
          strokeWidth={1.5}
        />
        <Line
          points={[rightTipX, rightTipY, rightTipX + 25, rightPanY]}
          stroke="#64748B"
          strokeWidth={1.5}
        />
        {/* Pan plate */}
        <Rect
          x={rightTipX - 30}
          y={rightPanY}
          width={60}
          height={16}
          fill="#8B5CF6"
          cornerRadius={6}
          stroke="#6D28D9"
          strokeWidth={1.5}
        />
        <Text
          x={rightTipX - 30}
          y={rightPanY + 2}
          width={60}
          text={`${rightWeight} kg`}
          align="center"
          fontSize={11}
          fontStyle="bold"
          fill="#FFFFFF"
          listening={false}
        />

        {/* Stepper for Right Pan */}
        <Group x={rightTipX - 24} y={rightPanY + 20}>
          <Group onClick={(e) => handleWeightChange('right', 1, e)}>
            <Circle x={6} y={6} radius={8} fill="#7C3AED" />
            <Text x={0} y={1} width={12} text="+" align="center" fontSize={11} fontStyle="bold" fill="#FFFFFF" />
          </Group>
          <Group x={24} onClick={(e) => handleWeightChange('right', -1, e)}>
            <Circle x={6} y={6} radius={8} fill="#64748B" />
            <Text x={0} y={1} width={12} text="−" align="center" fontSize={11} fontStyle="bold" fill="#FFFFFF" />
          </Group>
        </Group>
      </Group>

      {/* Status Badge in Center */}
      <Group x={centerX - 35} y={fulcrumY - 32}>
        <Rect
          x={0}
          y={0}
          width={70}
          height={18}
          fill={isBalanced ? '#10B981' : '#F59E0B'}
          cornerRadius={9}
        />
        <Text
          x={0}
          y={3}
          width={70}
          text={isBalanced ? 'Balanced =' : weightDiff > 0 ? 'Right >' : '< Left'}
          align="center"
          fontSize={10}
          fontStyle="bold"
          fill="#FFFFFF"
          listening={false}
        />
      </Group>
    </TileShell>
  );
});
