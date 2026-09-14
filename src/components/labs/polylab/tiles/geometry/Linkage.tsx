'use client';

import React, { memo, useCallback } from 'react';
import { Group, Line, Circle, Text } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export type LinkageType = 'four-bar' | 'pantograph' | 'crank-rocker';

export interface LinkageProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  linkageType?: LinkageType;
  angle?: number;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const Linkage = memo(function Linkage({
  id,
  x,
  y,
  rotation = 0,
  linkageType = 'four-bar',
  angle = 45,
  width = 180,
  height = 140,
  isLocked = false,
  isSelected = false,
}: LinkageProps) {
  const updateTile = useCanvasStore((s) => s.updateTile);
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);
  
  // Pivot state: 'left' | 'right' | null
  const lockedPivot = (angle === 1) ? 'left' : (angle === 2) ? 'right' : null;
  // We repurpose the `angle` prop to store the locked pivot state to persist it.
  // angle = 1 -> 'left', angle = 2 -> 'right', angle = 0 -> null

  const handleLeftClick = (e: Konva.KonvaEventObject<any>) => {
    e.cancelBubble = true;
    updateTileProps(id, { angle: lockedPivot === 'left' ? 0 : 1 });
  };

  const handleRightClick = (e: Konva.KonvaEventObject<any>) => {
    e.cancelBubble = true;
    updateTileProps(id, { angle: lockedPivot === 'right' ? 0 : 2 });
  };

  const color = '#8B5CF6'; // Purple from reference
  const rodThickness = 20;

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={width}
      height={rodThickness} // Outline respects this height
      isLocked={isLocked}
      isSelected={isSelected}
    >
      <Group>
        {/* Dark Outline */}
        <Line
          points={[0, rodThickness / 2, width, rodThickness / 2]}
          stroke="#1E1E28"
          strokeWidth={rodThickness + 6}
          lineCap="round"
        />
        {/* Colored Fill */}
        <Line
          points={[0, rodThickness / 2, width, rodThickness / 2]}
          stroke={color}
          strokeWidth={rodThickness}
          lineCap="round"
        />
        {/* Inner black line */}
        <Line
          points={[0, rodThickness / 2, width, rodThickness / 2]}
          stroke="#1E1E28"
          strokeWidth={2}
          lineCap="round"
        />

        {/* Left Pivot */}
        <Circle
          x={0}
          y={rodThickness / 2}
          radius={5}
          fill={lockedPivot === 'left' ? '#EF4444' : '#1E1E28'}
          onClick={handleLeftClick}
          onTap={handleLeftClick}
          draggable={!isLocked}
          onDragStart={(e) => { e.cancelBubble = true; }}
          onDragMove={(e) => {
            e.cancelBubble = true;
            const pos = e.target.getStage()?.getPointerPosition();
            if (!pos) return;
            const viewport = useCanvasStore.getState().viewport;
            const scale = viewport.scale;
            const canvasX = (pos.x - viewport.x) / scale;
            const canvasY = (pos.y - viewport.y) / scale;
            
            const rad = (rotation * Math.PI) / 180;
            const rightGlobalX = x + width * Math.cos(rad);
            const rightGlobalY = y + width * Math.sin(rad);

            const dx = rightGlobalX - canvasX;
            const dy = rightGlobalY - canvasY;
            let newAngle = Math.atan2(dy, dx) * 180 / Math.PI;

            const newRad = (newAngle * Math.PI) / 180;
            const newX = rightGlobalX - width * Math.cos(newRad);
            const newY = rightGlobalY - width * Math.sin(newRad);

            updateTile(id, { rotation: newAngle, x: newX, y: newY }, false);
            e.target.position({ x: 0, y: rodThickness / 2 });
          }}
          onDragEnd={(e) => {
            e.cancelBubble = true;
            updateTile(id, {}, true);
          }}
          onMouseEnter={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = !isLocked ? 'grab' : 'default';
          }}
          onMouseLeave={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = 'default';
          }}
        />

        {/* Right Pivot */}
        <Circle
          x={width}
          y={rodThickness / 2}
          radius={5}
          fill={lockedPivot === 'right' ? '#EF4444' : '#1E1E28'}
          onClick={handleRightClick}
          onTap={handleRightClick}
          draggable={!isLocked}
          onDragStart={(e) => { e.cancelBubble = true; }}
          onDragMove={(e) => {
            e.cancelBubble = true;
            const pos = e.target.getStage()?.getPointerPosition();
            if (!pos) return;
            const viewport = useCanvasStore.getState().viewport;
            const scale = viewport.scale;
            const canvasX = (pos.x - viewport.x) / scale;
            const canvasY = (pos.y - viewport.y) / scale;
            
            const dx = canvasX - x;
            const dy = canvasY - y;
            let newAngle = Math.atan2(dy, dx) * 180 / Math.PI;
            updateTile(id, { rotation: newAngle }, false);
            e.target.position({ x: width, y: rodThickness / 2 });
          }}
          onDragEnd={(e) => {
            e.cancelBubble = true;
            updateTile(id, {}, true);
          }}
          onMouseEnter={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = !isLocked ? 'grab' : 'default';
          }}
          onMouseLeave={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = 'default';
          }}
        />
      </Group>
    </TileShell>
  );
});
