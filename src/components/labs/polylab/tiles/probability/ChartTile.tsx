'use client';

import React, { memo, useCallback, useState } from 'react';
import { Group, Rect, Line, Text, Circle } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export type ChartVariant =
  | 'bar-chart'
  | 'line-chart'
  | 'pie-chart'
  | 'frequency-table'
  | 'box-plot';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartTileProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  variant?: ChartVariant;
  title?: string;
  data?: ChartDataPoint[];
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

const DEFAULT_BAR_DATA: ChartDataPoint[] = [
  { label: 'A', value: 6, color: '#3B82F6' },
  { label: 'B', value: 9, color: '#10B981' },
  { label: 'C', value: 4, color: '#F59E0B' },
  { label: 'D', value: 8, color: '#EC4899' },
  { label: 'E', value: 5, color: '#8B5CF6' },
];

export const ChartTile = memo(function ChartTile({
  id,
  x,
  y,
  rotation = 0,
  variant = 'bar-chart',
  title = 'Data Chart',
  data = DEFAULT_BAR_DATA,
  width = 280,
  height = 200,
  isLocked = false,
  isSelected = false,
}: ChartTileProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  // Click on a bar to increment or cycle value
  const handleBarClick = useCallback(
    (index: number, e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const currentData = [...data];
      const currentVal = currentData[index]?.value ?? 0;
      const nextVal = currentVal >= 10 ? 1 : currentVal + 1;
      currentData[index] = { ...currentData[index], value: nextVal };
      updateTileProps(id, { data: currentData });
    },
    [id, data, updateTileProps]
  );

  const padding = 28;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2 - 16;
  const maxValue = Math.max(10, ...data.map((d) => d.value));

  // 1. Interactive Bar Chart
  if (variant === 'bar-chart') {
    const barWidth = Math.max(16, (chartW / data.length) * 0.65);
    const gap = (chartW - barWidth * data.length) / (data.length + 1);

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
          {/* Card Container */}
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
            shadowBlur={8}
          />

          {/* Title Header */}
          <Text
            x={12}
            y={8}
            text={title || 'Statistics: Bar Chart'}
            fontSize={12}
            fontStyle="bold"
            fontFamily="Inter, system-ui, sans-serif"
            fill="#1E293B"
          />

          {/* Y Axis Line */}
          <Line
            points={[padding, 28, padding, 28 + chartH]}
            stroke="#94A3B8"
            strokeWidth={1.5}
          />
          {/* X Axis Line */}
          <Line
            points={[padding, 28 + chartH, padding + chartW, 28 + chartH]}
            stroke="#94A3B8"
            strokeWidth={1.5}
          />

          {/* Horizontal Grid lines */}
          {[0, 2, 4, 6, 8, 10].map((tick) => {
            const yPos = 28 + chartH - (tick / 10) * chartH;
            return (
              <Group key={`grid_${tick}`}>
                <Line
                  points={[padding, yPos, padding + chartW, yPos]}
                  stroke="#E2E8F0"
                  strokeWidth={1}
                  dash={[2, 2]}
                />
                <Text
                  x={8}
                  y={yPos - 5}
                  text={String(tick)}
                  fontSize={8}
                  fontFamily="Inter, sans-serif"
                  fill="#94A3B8"
                />
              </Group>
            );
          })}

          {/* Interactive Bars */}
          {data.map((item, i) => {
            const bHeight = (item.value / 10) * chartH;
            const bX = padding + gap + i * (barWidth + gap);
            const bY = 28 + chartH - bHeight;
            const barFill = item.color || '#3B82F6';

            return (
              <Group key={`bar_${i}`} onClick={(e) => handleBarClick(i, e)} onTap={(e) => handleBarClick(i, e)}>
                <Rect
                  x={bX}
                  y={bY}
                  width={barWidth}
                  height={bHeight}
                  fill={barFill}
                  stroke="#1E1E28"
                  strokeWidth={1.5}
                  cornerRadius={[3, 3, 0, 0]}
                />
                {/* Bar Value on top */}
                <Text
                  x={bX}
                  y={bY - 12}
                  width={barWidth}
                  text={String(item.value)}
                  align="center"
                  fontSize={9}
                  fontStyle="bold"
                  fill="#1E293B"
                />
                {/* Bar Label under X axis */}
                <Text
                  x={bX}
                  y={28 + chartH + 4}
                  width={barWidth}
                  text={item.label}
                  align="center"
                  fontSize={9}
                  fontStyle="bold"
                  fill="#64748B"
                />
              </Group>
            );
          })}
        </Group>
      </TileShell>
    );
  }

  // 2. Line Chart / Frequency Plot
  if (variant === 'line-chart') {
    const points: number[] = [];
    const step = chartW / (data.length - 1 || 1);

    data.forEach((d, i) => {
      const px = padding + i * step;
      const py = 28 + chartH - (d.value / 10) * chartH;
      points.push(px, py);
    });

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
            shadowBlur={8}
          />
          <Text
            x={12}
            y={8}
            text={title || 'Statistics: Line Chart'}
            fontSize={12}
            fontStyle="bold"
            fontFamily="Inter, sans-serif"
            fill="#1E293B"
          />

          {/* Axes */}
          <Line points={[padding, 28, padding, 28 + chartH, padding + chartW, 28 + chartH]} stroke="#94A3B8" strokeWidth={1.5} />

          {/* Connected Line */}
          <Line points={points} stroke="#6366F1" strokeWidth={3} tension={0.2} />

          {/* Data Points */}
          {data.map((d, i) => {
            const px = padding + i * step;
            const py = 28 + chartH - (d.value / 10) * chartH;
            return (
              <Group key={`pt_${i}`} onClick={(e) => handleBarClick(i, e)} onTap={(e) => handleBarClick(i, e)}>
                <Circle x={px} y={py} radius={5} fill="#4F46E5" stroke="#FFFFFF" strokeWidth={2} />
                <Text x={px - 10} y={py - 14} width={20} text={String(d.value)} align="center" fontSize={9} fontStyle="bold" fill="#1E293B" />
                <Text x={px - 10} y={28 + chartH + 4} width={20} text={d.label} align="center" fontSize={9} fill="#64748B" />
              </Group>
            );
          })}
        </Group>
      </TileShell>
    );
  }

  // 3. Frequency / Tally Table
  if (variant === 'frequency-table') {
    const rowH = 22;
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
            shadowBlur={8}
          />
          <Text
            x={12}
            y={8}
            text={title || 'Frequency & Tally Table'}
            fontSize={12}
            fontStyle="bold"
            fill="#1E293B"
          />

          {/* Table Header */}
          <Rect x={12} y={26} width={width - 24} height={20} fill="#F1F5F9" cornerRadius={3} />
          <Text x={18} y={30} text="Category" fontSize={9} fontStyle="bold" fill="#475569" />
          <Text x={90} y={30} text="Tally" fontSize={9} fontStyle="bold" fill="#475569" />
          <Text x={width - 55} y={30} text="Frequency" fontSize={9} fontStyle="bold" fill="#475569" />

          {/* Table Rows */}
          {data.slice(0, 5).map((d, i) => {
            const ry = 48 + i * rowH;
            const tallies = '||||/ '.repeat(Math.floor(d.value / 5)) + '|'.repeat(d.value % 5);
            return (
              <Group key={`row_${i}`} onClick={(e) => handleBarClick(i, e)} onTap={(e) => handleBarClick(i, e)}>
                <Rect x={12} y={ry} width={width - 24} height={rowH} fill={i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'} />
                <Text x={18} y={ry + 5} text={d.label} fontSize={10} fontStyle="bold" fill="#1E293B" />
                <Text x={90} y={ry + 5} text={tallies || '•'} fontSize={10} fontStyle="bold" fill="#0284C7" fontFamily="monospace" />
                <Text x={width - 45} y={ry + 5} text={String(d.value)} fontSize={10} fontStyle="bold" fill="#1E293B" />
                <Line points={[12, ry + rowH, width - 12, ry + rowH]} stroke="#E2E8F0" strokeWidth={1} />
              </Group>
            );
          })}
        </Group>
      </TileShell>
    );
  }

  // 4. Box & Whisker Plot (Min, Q1, Median, Q3, Max)
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
          shadowBlur={8}
        />
        <Text
          x={12}
          y={8}
          text={title || 'Box & Whisker Plot'}
          fontSize={12}
          fontStyle="bold"
          fill="#1E293B"
        />

        {/* Whisker line */}
        <Line points={[40, 90, 240, 90]} stroke="#1E1E28" strokeWidth={2} />
        {/* Min tick */}
        <Line points={[40, 75, 40, 105]} stroke="#1E1E28" strokeWidth={2} />
        {/* Max tick */}
        <Line points={[240, 75, 240, 105]} stroke="#1E1E28" strokeWidth={2} />

        {/* Box (Q1 to Q3) */}
        <Rect
          x={80}
          y={65}
          width={110}
          height={50}
          fill="#DDD6FE"
          stroke="#7C3AED"
          strokeWidth={2}
          cornerRadius={2}
        />
        {/* Median Line */}
        <Line points={[135, 65, 135, 115]} stroke="#6D28D9" strokeWidth={3} />

        {/* Labels */}
        <Text x={30} y={115} text="Min: 2" fontSize={8} fill="#64748B" />
        <Text x={75} y={115} text="Q1: 5" fontSize={8} fill="#64748B" />
        <Text x={125} y={115} text="Med: 8" fontSize={8} fontStyle="bold" fill="#6D28D9" />
        <Text x={180} y={115} text="Q3: 12" fontSize={8} fill="#64748B" />
        <Text x={230} y={115} text="Max: 15" fontSize={8} fill="#64748B" />
      </Group>
    </TileShell>
  );
});
