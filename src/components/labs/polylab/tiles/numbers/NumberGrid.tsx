'use client';

import React, { memo, useCallback } from 'react';
import { Group, Rect, Text } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface NumberGridProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  maxNumber?: number; // 100 or 120
  highlighted?: number[];
  filter?: 'none' | 'evens' | 'odds' | 'primes' | 'multiples-5';
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

const PRIMES_UNDER_100 = new Set([
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
]);

export const NumberGrid = memo(function NumberGrid({
  id,
  x,
  y,
  rotation = 0,
  maxNumber = 100,
  highlighted = [],
  filter = 'none',
  width = 240,
  height = 260,
  isLocked = false,
  isSelected = false,
}: NumberGridProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const cols = 10;
  const rows = maxNumber / cols;
  const cellW = (width - 16) / cols;
  const cellH = (height - 40) / rows;

  const isCellHighlighted = (num: number): boolean => {
    if (highlighted.includes(num)) return true;
    if (filter === 'evens') return num % 2 === 0;
    if (filter === 'odds') return num % 2 !== 0;
    if (filter === 'primes') return PRIMES_UNDER_100.has(num);
    if (filter === 'multiples-5') return num % 5 === 0;
    return false;
  };

  const handleCellClick = useCallback(
    (num: number, e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const nextH = highlighted.includes(num)
        ? highlighted.filter((n) => n !== num)
        : [...highlighted, num];
      updateTileProps(id, { highlighted: nextH });
    },
    [id, highlighted, updateTileProps]
  );

  const cycleFilter = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const filters: ('none' | 'evens' | 'odds' | 'primes' | 'multiples-5')[] = [
        'none',
        'evens',
        'primes',
        'multiples-5',
      ];
      const nextF = filters[(filters.indexOf(filter) + 1) % filters.length];
      updateTileProps(id, { filter: nextF });
    },
    [id, filter, updateTileProps]
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
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#FFFFFF"
          stroke="#1E1E28"
          strokeWidth={2}
          cornerRadius={8}
          shadowColor="rgba(0,0,0,0.15)"
          shadowBlur={6}
        />

        {/* Title & Filter Button Bar */}
        <Group x={8} y={6} onClick={cycleFilter} onTap={cycleFilter}>
          <Text text="100 Number Chart" fontSize={11} fontStyle="bold" fill="#1E293B" />
          <Rect x={width - 95} y={0} width={80} height={16} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth={1} cornerRadius={3} />
          <Text
            x={width - 95}
            y={2}
            width={80}
            text={`Filter: ${filter}`}
            align="center"
            fontSize={8}
            fontStyle="bold"
            fill="#475569"
          />
        </Group>

        {/* 10x10 Number Grid Cells */}
        {Array.from({ length: maxNumber }).map((_, i) => {
          const num = i + 1;
          const r = Math.floor(i / cols);
          const c = i % cols;
          const cx = 8 + c * cellW;
          const cy = 26 + r * cellH;
          const hl = isCellHighlighted(num);

          return (
            <Group key={`cell_${num}`} onClick={(e) => handleCellClick(num, e)} onTap={(e) => handleCellClick(num, e)}>
              <Rect
                x={cx}
                y={cy}
                width={cellW}
                height={cellH}
                fill={hl ? '#FDE047' : (r + c) % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}
                stroke="#E2E8F0"
                strokeWidth={0.75}
              />
              <Text
                x={cx}
                y={cy + cellH / 2 - 4}
                width={cellW}
                text={String(num)}
                align="center"
                fontSize={8}
                fontStyle={hl ? 'bold' : 'normal'}
                fill={hl ? '#854D0E' : '#334155'}
              />
            </Group>
          );
        })}
      </Group>
    </TileShell>
  );
});
