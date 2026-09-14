'use client';

import React, { memo } from 'react';
import { Group, Rect, Line, Text, Circle, Arc } from 'react-konva';
import { TileShell } from '../shared/TileShell';

export type UtensilType = 'protractor' | 'compass' | 'ruler';

export interface UtensilProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  utensilType?: UtensilType;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

// Base sizes for each utensil
const BASE = { protractor: { w: 200, h: 110 }, compass: { w: 120, h: 140 }, ruler: { w: 240, h: 45 } };

export const Utensil = memo(function Utensil({
  id,
  x,
  y,
  rotation = 0,
  utensilType = 'protractor',
  width,
  height,
  scaleX = 1,
  scaleY = 1,
  isLocked = false,
  isSelected = false,
}: UtensilProps) {
  // ── 1. 180° Protractor ────────────────────────────────────────────────────
  if (utensilType === 'protractor') {
    const BASE_W = BASE.protractor.w, BASE_H = BASE.protractor.h;

    const cx = BASE_W / 2;
    const cy = BASE_H - 15;
    const r = 85;

    const angleTicks: React.ReactNode[] = [];
    for (let deg = 0; deg <= 180; deg += 10) {
      const rad = (deg * Math.PI) / 180;
      const isMajor = deg % 30 === 0;
      const tickLen = isMajor ? 12 : 6;
      const x1 = cx - r * Math.cos(rad);
      const y1 = cy - r * Math.sin(rad);
      const x2 = cx - (r - tickLen) * Math.cos(rad);
      const y2 = cy - (r - tickLen) * Math.sin(rad);
      angleTicks.push(<Line key={`tick_${deg}`} points={[x1, y1, x2, y2]} stroke="#1E293B" strokeWidth={isMajor ? 1.5 : 1} />);
      if (isMajor) {
        const tx = cx - (r - 20) * Math.cos(rad);
        const ty = cy - (r - 20) * Math.sin(rad);
        angleTicks.push(
          <Text key={`lbl_${deg}`} x={tx - 10} y={ty - 5} width={20} text={String(deg)} align="center" fontSize={7} fontStyle="bold" fill="#334155" />
        );
      }
    }

    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={BASE_W} height={BASE_H} scaleX={scaleX} scaleY={scaleY} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          <Arc x={cx} y={cy} innerRadius={25} outerRadius={r} angle={180} rotation={180} fill="rgba(56,189,248,0.25)" stroke="#0284C7" strokeWidth={2} />
          <Line points={[cx - r, cy, cx + r, cy]} stroke="#0284C7" strokeWidth={2} />
          <Circle x={cx} y={cy} radius={3} fill="#0284C7" />
          <Line points={[cx - 6, cy, cx + 6, cy]} stroke="#0284C7" strokeWidth={1} />
          <Line points={[cx, cy - 6, cx, cy + 6]} stroke="#0284C7" strokeWidth={1} />
          {angleTicks}
        </Group>
      </TileShell>
    );
  }

  // ── 2. Drafting Compass ────────────────────────────────────────────────────
  if (utensilType === 'compass') {
    const BASE_W = BASE.compass.w, BASE_H = BASE.compass.h;

    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={BASE_W} height={BASE_H} scaleX={scaleX} scaleY={scaleY} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          <Circle x={60} y={15} radius={8} fill="#64748B" stroke="#1E1E28" strokeWidth={2} />
          <Line points={[60, 15, 25, 120]} stroke="#94A3B8" strokeWidth={5} lineCap="round" />
          <Line points={[25, 120, 20, 135]} stroke="#0F172A" strokeWidth={2} />
          <Line points={[60, 15, 95, 100]} stroke="#94A3B8" strokeWidth={5} lineCap="round" />
          <Rect x={90} y={95} width={10} height={35} fill="#F59E0B" stroke="#1E1E28" strokeWidth={1.5} cornerRadius={2} />
          <Line points={[90, 130, 100, 130, 95, 138]} closed fill="#1E293B" />
          <Line points={[42, 60, 78, 60]} stroke="#475569" strokeWidth={3} />
          <Circle x={60} y={60} radius={6} fill="#CBD5E1" stroke="#334155" strokeWidth={1.5} />
        </Group>
      </TileShell>
    );
  }

  // ── 3. Precision Ruler ────────────────────────────────────────────────────
  const BASE_W = BASE.ruler.w, BASE_H = BASE.ruler.h;
  const finalW = width ?? BASE_W;
  const finalH = height ?? BASE_H;
  const gScaleX = finalW / BASE_W;
  const gScaleY = finalH / BASE_H;

  const mmTicks: React.ReactNode[] = [];
  for (let i = 0; i <= 20; i++) {
    const px = 10 + i * 11;
    const isMajor = i % 5 === 0;
    const tickH = isMajor ? 14 : 7;
    mmTicks.push(<Line key={`r_tick_${i}`} points={[px, 0, px, tickH]} stroke="#334155" strokeWidth={isMajor ? 1.5 : 1} />);
    if (isMajor) {
      mmTicks.push(<Text key={`r_lbl_${i}`} x={px - 4} y={16} text={String(i)} fontSize={8} fontStyle="bold" fill="#1E293B" />);
    }
  }

  return (
    <TileShell id={id} x={x} y={y} rotation={rotation} width={BASE_W} height={BASE_H} scaleX={scaleX} scaleY={scaleY} isLocked={isLocked} isSelected={isSelected}>
      <Group>
        <Rect x={0} y={0} width={BASE_W} height={BASE_H}
          fill="rgba(254,240,138,0.75)" stroke="#CA8A04" strokeWidth={2} cornerRadius={4}
          shadowColor="rgba(0,0,0,0.15)" shadowBlur={6}
        />
        {mmTicks}
        <Text x={BASE_W - 30} y={26} text="cm" fontSize={9} fontStyle="bold" fill="#854D0E" />
      </Group>
    </TileShell>
  );
});
