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
  width = 250,
  height = 290,
  isLocked = false,
  isSelected = false,
}: NumberGridProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const handleSetMode = useCallback(
    (newMode: 'chart' | 'addition' | 'multiplication', e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      updateTileProps(id, { mode: newMode, highlighted: [], selectedVal: null });
    },
    [id, updateTileProps]
  );

  // For multiplication: clicking a number sets it as selectedVal and highlights all its multiples in the table
  const handleMultiplyHeaderClick = useCallback(
    (num: number, e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      // Find all cells in the table that are multiples of num
      const multiples: number[] = [];
      for (let r = 1; r <= gridSize; r++) {
        for (let c = 1; c <= gridSize; c++) {
          if ((r * c) % num === 0) multiples.push(r * c);
        }
      }
      updateTileProps(id, { selectedVal: num, highlighted: Array.from(new Set(multiples)) });
    },
    [id, gridSize, updateTileProps]
  );

  // For addition: clicking a cell toggles it
  const handleAddCellClick = useCallback(
    (val: number, e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const next = highlighted.includes(val)
        ? highlighted.filter((n) => n !== val)
        : [...highlighted, val];
      updateTileProps(id, { highlighted: next });
    },
    [id, highlighted, updateTileProps]
  );

  // For multiplication: clicking a product cell toggles ring highlight
  const handleMulCellClick = useCallback(
    (val: number, e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const next = highlighted.includes(val)
        ? highlighted.filter((n) => n !== val)
        : [...highlighted, val];
      updateTileProps(id, { highlighted: next });
    },
    [id, highlighted, updateTileProps]
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

  // Tab bar heights
  const TAB_Y = 6;
  const TAB_H = 20;
  const CONTENT_Y = TAB_Y + TAB_H + 8;

  // Tab widths
  const tabW = Math.floor((width - 12) / 3);

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={width}
      height={height}
      scaleX={1}
      scaleY={1}
      isLocked={isLocked}
      isSelected={isSelected}
    >
      <Group>
        {/* Background */}
        <Rect
          x={0} y={0} width={width} height={height}
          fill="#FFFFFF" stroke="#1E1E28" strokeWidth={2} cornerRadius={8}
          shadowColor="rgba(0,0,0,0.15)" shadowBlur={6}
        />

        {/* ── Mode Tabs ─────────────────────────────────── */}
        <Group x={6} y={TAB_Y}>
          {(['chart', 'addition', 'multiplication'] as const).map((m, i) => {
            const labels = ['100 Chart', '+ Addition', '× Multiply'];
            const active = mode === m;
            return (
              <Group
                key={m}
                x={i * tabW}
                onClick={(e) => handleSetMode(m, e)}
                onTap={(e) => handleSetMode(m, e)}
              >
                <Rect
                  x={0} y={0} width={tabW - 2} height={TAB_H}
                  fill={active ? '#1E293B' : '#F1F5F9'}
                  cornerRadius={4}
                />
                <Text
                  x={0} y={5} width={tabW - 2}
                  text={labels[i]} align="center" fontSize={7} fontStyle="bold"
                  fill={active ? '#FFFFFF' : '#64748B'}
                />
              </Group>
            );
          })}
        </Group>

        {/* ── MODE 1: 100 Chart ─────────────────────────── */}
        {mode === 'chart' && (
          <Group y={4}>
            {/* Filter pill */}
            <Group x={width - 86} y={CONTENT_Y - 6} onClick={cycleFilter} onTap={cycleFilter}>
              <Rect x={0} y={0} width={78} height={14} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth={1} cornerRadius={3} />
              <Text x={0} y={2} width={78} text={`Filter: ${filter}`} align="center" fontSize={7} fontStyle="bold" fill="#475569" />
            </Group>
            {/* Grid */}
            {Array.from({ length: maxNumber }).map((_, i) => {
              const num = i + 1;
              const cols = 10;
              const cellW = (width - 16) / cols;
              const cellH = (height - CONTENT_Y - 26) / (maxNumber / cols);
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

        {/* ── MODE 2: Addition Table ─────────────────────── */}
        {mode === 'addition' && (() => {
          const count = gridSize + 1;
          const startX = 10;
          const startY = CONTENT_Y + 6;
          const spacing = Math.min(36, (width - 20) / count);
          const radius = spacing * 0.42;
          const elements: React.ReactNode[] = [];

          for (let r = 0; r <= gridSize; r++) {
            for (let c = 0; c <= gridSize; c++) {
              const cx2 = startX + c * spacing + radius;
              const cy2 = startY + r * spacing + radius;

              // Operator corner
              if (r === 0 && c === 0) {
                elements.push(
                  <Group key="add_op">
                    <Circle cx={cx2} cy={cy2} radius={radius} fill="#475569" />
                    <Text x={cx2 - radius} y={cy2 - 7} width={radius * 2} text="+" align="center" fontSize={14} fontStyle="bold" fill="#FFFFFF" />
                  </Group>
                );
                continue;
              }
              // Header row (col headers = 1..N in blue)
              if (r === 0) {
                elements.push(
                  <Group key={`add_col_${c}`}>
                    <Circle cx={cx2} cy={cy2} radius={radius} fill="#3B82F6" />
                    <Text x={cx2 - radius} y={cy2 - 6} width={radius * 2} text={String(c)} align="center" fontSize={11} fontStyle="bold" fill="#FFFFFF" />
                  </Group>
                );
                continue;
              }
              // Header col (row headers = 1..N in red)
              if (c === 0) {
                elements.push(
                  <Group key={`add_row_${r}`}>
                    <Circle cx={cx2} cy={cy2} radius={radius} fill="#EF4444" />
                    <Text x={cx2 - radius} y={cy2 - 6} width={radius * 2} text={String(r)} align="center" fontSize={11} fontStyle="bold" fill="#FFFFFF" />
                  </Group>
                );
                continue;
              }
              // Sum cell
              const sum = r + c;
              const hl = highlighted.includes(sum);
              elements.push(
                <Group key={`add_${r}_${c}`} onClick={(e) => handleAddCellClick(sum, e)} onTap={(e) => handleAddCellClick(sum, e)}>
                  <Circle cx={cx2} cy={cy2} radius={radius} fill="#E2E8F0" stroke={hl ? '#0F172A' : '#CBD5E1'} strokeWidth={hl ? 3.5 : 1} />
                  <Text x={cx2 - radius} y={cy2 - 6} width={radius * 2} text={String(sum)} align="center" fontSize={sum > 9 ? 9 : 11} fontStyle={hl ? 'bold' : 'normal'} fill="#0F172A" />
                </Group>
              );
            }
          }
          return <Group>{elements}</Group>;
        })()}

        {/* ── MODE 3: Multiplication Table ─────────────── */}
        {mode === 'multiplication' && (() => {
          const count = gridSize + 1;
          const startX = 10;
          const startY = CONTENT_Y + 6;
          const spacing = Math.min(36, (width - 20) / count);
          const radius = spacing * 0.42;
          const elements: React.ReactNode[] = [];

          for (let r = 0; r <= gridSize; r++) {
            for (let c = 0; c <= gridSize; c++) {
              const cx2 = startX + c * spacing + radius;
              const cy2 = startY + r * spacing + radius;

              // Operator corner
              if (r === 0 && c === 0) {
                elements.push(
                  <Group key="mul_op">
                    <Circle cx={cx2} cy={cy2} radius={radius} fill="#475569" />
                    <Text x={cx2 - radius} y={cy2 - 7} width={radius * 2} text="×" align="center" fontSize={14} fontStyle="bold" fill="#FFFFFF" />
                  </Group>
                );
                continue;
              }
              // Header row/col — clicking highlights all multiples of that number
              if (r === 0 || c === 0) {
                const num = r === 0 ? c : r;
                const isActive = selectedVal === num;
                elements.push(
                  <Group key={`mul_hdr_${r}_${c}`} onClick={(e) => handleMultiplyHeaderClick(num, e)} onTap={(e) => handleMultiplyHeaderClick(num, e)}>
                    <Circle cx={cx2} cy={cy2} radius={radius} fill={isActive ? '#DC2626' : '#475569'} />
                    <Text x={cx2 - radius} y={cy2 - 6} width={radius * 2} text={String(num)} align="center" fontSize={11} fontStyle="bold" fill="#FFFFFF" />
                  </Group>
                );
                continue;
              }
              // Product cell
              const product = r * c;
              const hl = highlighted.includes(product);
              elements.push(
                <Group key={`mul_${r}_${c}`} onClick={(e) => handleMulCellClick(product, e)} onTap={(e) => handleMulCellClick(product, e)}>
                  {/* Outer ring for multiples */}
                  <Circle cx={cx2} cy={cy2} radius={radius} fill="#E2E8F0" stroke={hl ? '#0F172A' : '#CBD5E1'} strokeWidth={hl ? 3.5 : 1} />
                  <Text x={cx2 - radius} y={cy2 - 6} width={radius * 2} text={String(product)} align="center" fontSize={product > 99 ? 8 : 11} fontStyle={hl ? 'bold' : 'normal'} fill="#0F172A" />
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
