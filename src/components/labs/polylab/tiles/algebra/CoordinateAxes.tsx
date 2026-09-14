'use client';

import React, { memo, useCallback } from 'react';
import { Group, Rect, Line, Text, Circle } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface CoordinatePoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

export interface CoordinateAxesProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  points?: CoordinatePoint[];
  showTable?: boolean;
  showLine?: boolean;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

const DEFAULT_POINTS: CoordinatePoint[] = [
  { x: -2, y: -1, label: 'A', color: '#EF4444' },
  { x: 0, y: 1, label: 'B', color: '#3B82F6' },
  { x: 2, y: 3, label: 'C', color: '#10B981' },
  { x: 4, y: 5, label: 'D', color: '#F59E0B' },
];

export const CoordinateAxes = memo(function CoordinateAxes({
  id,
  x,
  y,
  rotation = 0,
  points = DEFAULT_POINTS,
  showTable = true,
  showLine = true,
  width = 340,
  height = 240,
  isLocked = false,
  isSelected = false,
}: CoordinateAxesProps) {
  const intrinsicW = 340;
  const intrinsicH = 240;

  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const gridRange = 5; // -5 to +5
  const gridW = 200;
  const gridH = 200;
  const originX = 20 + gridW / 2;
  const originY = 20 + gridH / 2;
  const step = gridW / (gridRange * 2);

  // Convert math coords (x,y) to Konva canvas coords
  const toCanvasCoords = (mx: number, my: number) => ({
    cx: originX + mx * step,
    cy: originY - my * step,
  });

  // Cycle a point's position on click
  const handlePointClick = useCallback(
    (index: number, e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const nextPoints = [...points];
      const pt = nextPoints[index];
      if (pt) {
        const nextY = pt.y >= 5 ? -4 : pt.y + 1;
        nextPoints[index] = { ...pt, y: nextY };
        updateTileProps(id, { points: nextPoints });
      }
    },
    [id, points, updateTileProps]
  );

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
      <Group>
        {/* Main Background Panel */}
        <Rect
          x={0}
          y={0}
          width={intrinsicW}
          height={intrinsicH}
          fill="#FFFFFF"
          stroke="#1E1E28"
          strokeWidth={2}
          cornerRadius={8}
          shadowColor="rgba(0,0,0,0.15)"
          shadowBlur={8}
        />

        {/* Grid Background */}
        <Rect x={20} y={20} width={gridW} height={gridH} fill="#F8FAFC" stroke="#CBD5E1" strokeWidth={1} />

        {/* Grid lines (-5 to +5) */}
        {Array.from({ length: gridRange * 2 + 1 }).map((_, i) => {
          const val = i - gridRange;
          const pos = 20 + i * step;
          return (
            <Group key={`grid_line_${i}`}>
              {/* Vertical grid line */}
              <Line points={[pos, 20, pos, 20 + gridH]} stroke="#E2E8F0" strokeWidth={1} />
              {/* Horizontal grid line */}
              <Line points={[20, pos, 20 + gridW, pos]} stroke="#E2E8F0" strokeWidth={1} />
            </Group>
          );
        })}

        {/* X and Y Main Axes */}
        {/* Y-Axis */}
        <Line points={[originX, 20, originX, 20 + gridH]} stroke="#1E293B" strokeWidth={2} />
        {/* X-Axis */}
        <Line points={[20, originY, 20 + gridW, originY]} stroke="#1E293B" strokeWidth={2} />

        {/* Axis Labels */}
        <Text x={originX + gridW / 2 - 8} y={originY + 4} text="x" fontSize={11} fontStyle="bold" fill="#1E293B" />
        <Text x={originX + 5} y={22} text="y" fontSize={11} fontStyle="bold" fill="#1E293B" />

        {/* Plotted Points & Function Line */}
        {showLine && points.length >= 2 && (
          <Line
            points={points.flatMap((p) => {
              const { cx, cy } = toCanvasCoords(p.x, p.y);
              return [cx, cy];
            })}
            stroke="#6366F1"
            strokeWidth={2.5}
          />
        )}

        {/* Render Points */}
        {points.map((p, i) => {
          const { cx, cy } = toCanvasCoords(p.x, p.y);
          return (
            <Group key={`pt_${i}`} onClick={(e) => handlePointClick(i, e)} onTap={(e) => handlePointClick(i, e)}>
              <Circle x={cx} y={cy} radius={5} fill={p.color || '#3B82F6'} stroke="#FFFFFF" strokeWidth={2} />
              <Text x={cx + 6} y={cy - 12} text={`(${p.x},${p.y})`} fontSize={8} fontStyle="bold" fill="#1E293B" />
            </Group>
          );
        })}

        {/* Side (x, y) Table */}
        {showTable && (
          <Group x={230} y={20}>
            <Rect x={0} y={0} width={95} height={gridH} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth={1} cornerRadius={4} />
            <Text x={0} y={6} width={95} text="Table: (x, y)" align="center" fontSize={10} fontStyle="bold" fill="#1E293B" />
            <Line points={[0, 22, 95, 22]} stroke="#CBD5E1" strokeWidth={1} />
            <Line points={[47, 22, 47, gridH]} stroke="#CBD5E1" strokeWidth={1} />

            <Text x={18} y={26} text="x" fontSize={10} fontStyle="bold" fill="#475569" />
            <Text x={65} y={26} text="y" fontSize={10} fontStyle="bold" fill="#475569" />
            <Line points={[0, 40, 95, 40]} stroke="#CBD5E1" strokeWidth={1} />

            {points.map((p, i) => {
              const ry = 44 + i * 26;
              return (
                <Group key={`tbl_row_${i}`} onClick={(e) => handlePointClick(i, e)} onTap={(e) => handlePointClick(i, e)}>
                  <Text x={14} y={ry} text={String(p.x)} fontSize={10} fontStyle="bold" fill="#1E293B" />
                  <Text x={62} y={ry} text={String(p.y)} fontSize={10} fontStyle="bold" fill={p.color || '#3B82F6'} />
                  <Line points={[0, ry + 18, 95, ry + 18]} stroke="#E2E8F0" strokeWidth={1} />
                </Group>
              );
            })}
          </Group>
        )}
      </Group>
    </TileShell>
  );
});
