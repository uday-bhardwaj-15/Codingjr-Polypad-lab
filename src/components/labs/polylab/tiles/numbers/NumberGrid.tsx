'use client';

import React, { memo, useCallback } from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface NumberGridProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  mode?: 'chart' | 'addition' | 'multiplication';
  gridSize?: number;
  maxNumber?: number;
  highlighted?: number[];
  filter?: 'none' | 'evens' | 'odds' | 'primes' | 'multiples-5';
  selectedVal?: number | null;
  activeRow?: number | null;
  activeCol?: number | null;
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
  mode = 'chart',
  gridSize = 5,
  maxNumber = 100,
  highlighted = [],
  filter = 'none',
  selectedVal = null,
  activeRow = null,
  activeCol = null,
  width = 250,
  height = 290,
  isLocked = false,
  isSelected = false,
}: NumberGridProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const handleSetMode = useCallback(
    (newMode: 'chart' | 'addition' | 'multiplication', e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      updateTileProps(id, { mode: newMode, highlighted: [], selectedVal: null, activeRow: null, activeCol: null });
    },
    [id, updateTileProps]
  );

  const handleCellClick = useCallback(
    (r: number, c: number, e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      if (activeRow === r && activeCol === c) {
        updateTileProps(id, { activeRow: null, activeCol: null });
      } else {
        updateTileProps(id, { activeRow: r, activeCol: c });
      }
    },
    [id, activeRow, activeCol, updateTileProps]
  );

  const handleHeaderClick = useCallback(
    (r: number, c: number, e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      if (r === 0) {
        updateTileProps(id, { activeCol: activeCol === c ? null : c });
      } else if (c === 0) {
        updateTileProps(id, { activeRow: activeRow === r ? null : r });
      }
    },
    [id, activeRow, activeCol, updateTileProps]
  );

  const cycleFilter = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const filters: ('none' | 'evens' | 'odds' | 'primes' | 'multiples-5')[] = [
        'none', 'evens', 'primes', 'multiples-5',
      ];
      const nextF = filters[(filters.indexOf(filter) + 1) % filters.length];
      updateTileProps(id, { filter: nextF });
    },
    [id, filter, updateTileProps]
  );

  const isCellHighlighted = (num: number): boolean => {
    if (highlighted.includes(num)) return true;
    if (filter === 'evens') return num % 2 === 0;
    if (filter === 'odds') return num % 2 !== 0;
    if (filter === 'primes') return PRIMES_UNDER_100.has(num);
    if (filter === 'multiples-5') return num % 5 === 0;
    return false;
  };

  const intrinsicW = 250;
  const intrinsicH = 260; // Slightly shorter since we removed tabs
  const CONTENT_Y = 10; // Start near the top

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={intrinsicW}
      height={intrinsicH}
      scaleX={1}
      scaleY={1}
      isLocked={isLocked}
      isSelected={isSelected}
    >
      <Group>
        <Rect
          x={0} y={0} width={intrinsicW} height={intrinsicH}
          fill="#FFFFFF" stroke="#1E1E28" strokeWidth={2} cornerRadius={8}
          shadowColor="rgba(0,0,0,0.15)" shadowBlur={6}
        />

        {mode === 'chart' && (
          <Group y={4}>
            <Group x={intrinsicW - 86} y={CONTENT_Y - 6} onClick={cycleFilter} onTap={cycleFilter}>
              <Rect x={0} y={0} width={78} height={14} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth={1} cornerRadius={3} />
              <Text x={0} y={2} width={78} text={`Filter: ${filter}`} align="center" fontSize={7} fontStyle="bold" fill="#475569" />
            </Group>
            {Array.from({ length: maxNumber }).map((_, i) => {
              const num = i + 1;
              const cols = 10;
              const cellW = (intrinsicW - 16) / cols;
              const cellH = (intrinsicH - CONTENT_Y - 26) / (maxNumber / cols);
              const r = Math.floor(i / cols);
              const c = i % cols;
              const cx2 = 8 + c * cellW;
              const cy2 = CONTENT_Y + 12 + r * cellH;
              const hl = isCellHighlighted(num);
              return (
                <Group key={`chart_${num}`} onClick={(e) => { e.cancelBubble = true; const next = highlighted.includes(num) ? highlighted.filter(n => n !== num) : [...highlighted, num]; updateTileProps(id, { highlighted: next }); }} onTap={(e) => { e.cancelBubble = true; const next = highlighted.includes(num) ? highlighted.filter(n => n !== num) : [...highlighted, num]; updateTileProps(id, { highlighted: next }); }}>
                  <Rect x={cx2} y={cy2} width={cellW} height={cellH} fill={hl ? '#FDE047' : (r + c) % 2 === 0 ? '#FFFFFF' : '#F8FAFC'} stroke="#E2E8F0" strokeWidth={0.75} />
                  <Text x={cx2} y={cy2 + cellH / 2 - 4} width={cellW} text={String(num)} align="center" fontSize={8} fontStyle={hl ? 'bold' : 'normal'} fill={hl ? '#854D0E' : '#334155'} />
                </Group>
              );
            })}
          </Group>
        )}

        {(mode === 'addition' || mode === 'multiplication') && (() => {
          const count = gridSize + 1;
          const startX = 10;
          const startY = CONTENT_Y + 6;
          const spacing = Math.min(36, (intrinsicW - 20) / count);
          const radius = spacing * 0.42;
          const elements: React.ReactNode[] = [];
          const operator = mode === 'addition' ? '+' : '×';

          for (let r = 0; r <= gridSize; r++) {
            for (let c = 0; c <= gridSize; c++) {
              const cx2 = startX + c * spacing + radius;
              const cy2 = startY + r * spacing + radius;

              if (r === 0 && c === 0) {
                elements.push(
                  <Group key="op">
                    <Circle cx={cx2} cy={cy2} radius={radius} fill="#475569" />
                    <Text x={cx2 - radius} y={cy2 - 7} width={radius * 2} text={operator} align="center" fontSize={14} fontStyle="bold" fill="#FFFFFF" />
                  </Group>
                );
                continue;
              }

              if (r === 0 || c === 0) {
                const isRowHeader = c === 0;
                const num = isRowHeader ? r : c;
                const isActive = isRowHeader ? activeRow === r : activeCol === c;
                const baseColor = isRowHeader ? '#EF4444' : '#3B82F6';
                const hlColor = isRowHeader ? '#B91C1C' : '#1D4ED8';
                
                elements.push(
                  <Group key={`hdr_${r}_${c}`} onClick={(e) => handleHeaderClick(r, c, e)} onTap={(e) => handleHeaderClick(r, c, e)}>
                    <Circle cx={cx2} cy={cy2} radius={radius} fill={isActive ? hlColor : baseColor} />
                    <Text x={cx2 - radius} y={cy2 - 6} width={radius * 2} text={String(num)} align="center" fontSize={11} fontStyle="bold" fill="#FFFFFF" />
                  </Group>
                );
                continue;
              }

              const val = mode === 'addition' ? r + c : r * c;
              const isTarget = activeRow === r && activeCol === c;
              const inPath = (activeRow === r && activeCol !== null && c <= activeCol) || (activeCol === c && activeRow !== null && r <= activeRow);
              
              let fill = '#E2E8F0';
              let stroke = '#CBD5E1';
              let strokeW = 1;
              if (isTarget) {
                fill = '#FDE047';
                stroke = '#0F172A';
                strokeW = 2;
              } else if (inPath) {
                fill = '#FEF08A';
                stroke = '#FBBF24';
              }

              elements.push(
                <Group key={`cell_${r}_${c}`} onClick={(e) => handleCellClick(r, c, e)} onTap={(e) => handleCellClick(r, c, e)}>
                  <Circle cx={cx2} cy={cy2} radius={radius} fill={fill} stroke={stroke} strokeWidth={strokeW} />
                  <Text x={cx2 - radius} y={cy2 - 6} width={radius * 2} text={String(val)} align="center" fontSize={val > 99 ? 8 : val > 9 ? 9 : 11} fontStyle={isTarget ? 'bold' : 'normal'} fill="#0F172A" />
                </Group>
              );
            }
          }
          return <Group>{elements}</Group>;
        })()}
      </Group>
    </TileShell>
  );
});
