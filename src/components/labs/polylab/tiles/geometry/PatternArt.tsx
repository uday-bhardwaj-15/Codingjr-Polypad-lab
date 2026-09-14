'use client';

import React, { memo, useCallback, useState } from 'react';
import { Group, Rect, Line, Circle, RegularPolygon } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export type PatternArtType =
  | 'mandala-star'
  | 'islamic-rosette'
  | 'fractal-sierpinski'
  | 'geometric-mesh'
  | 'tessellation-kaleidoscope';

export interface PatternArtProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  artType?: PatternArtType;
  seed?: number;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

const ART_PALETTES = [
  ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'],
  ['#06B6D4', '#3B82F6', '#6366F1', '#D946EF', '#F43F5E'],
  ['#10B981', '#059669', '#34D399', '#FDE047', '#F97316'],
  ['#EA580C', '#E11D48', '#BE185D', '#7C3AED', '#4338CA'],
];

export const PatternArt = memo(function PatternArt({
  id,
  x,
  y,
  rotation = 0,
  artType = 'mandala-star',
  seed = 0,
  width = 130,
  height = 130,
  isLocked = false,
  isSelected = false,
}: PatternArtProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const randomizeArt = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const artTypes: PatternArtType[] = [
        'mandala-star',
        'islamic-rosette',
        'fractal-sierpinski',
        'geometric-mesh',
        'tessellation-kaleidoscope',
      ];
      const nextType = artTypes[(artTypes.indexOf(artType) + 1) % artTypes.length];
      const nextSeed = (seed + 1) % 100;
      updateTileProps(id, { artType: nextType, seed: nextSeed });
    },
    [id, artType, seed, updateTileProps]
  );

  const intrinsicW = 130;
  const intrinsicH = 130;
  const cx = intrinsicW / 2;
  const cy = intrinsicH / 2;
  const palette = ART_PALETTES[seed % ART_PALETTES.length];

  // 1. Mandala Geometric Star - Simplified
  if (artType === 'mandala-star') {
    const petals: React.ReactNode[] = [];
    const count = 8; // Simplified from 12 to 8
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x1 = cx + 35 * Math.cos(angle);
      const y1 = cy + 35 * Math.sin(angle);
      const x2 = cx + 55 * Math.cos(angle + Math.PI / count);
      const y2 = cy + 55 * Math.sin(angle + Math.PI / count);
      petals.push(
        <Line
          key={`petal_${i}`}
          points={[cx, cy, x1, y1, x2, y2]}
          closed
          fill={palette[i % palette.length]}
          stroke="#1E1E28"
          strokeWidth={1}
          opacity={0.85}
        />
      );
    }

    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={intrinsicW} height={intrinsicH} isLocked={isLocked} isSelected={isSelected}>
        <Group onClick={randomizeArt} onTap={randomizeArt}>
          <Circle x={cx} y={cy} radius={60} fill="#181926" stroke="#2C2D3E" strokeWidth={2} />
          {petals}
          <Circle x={cx} y={cy} radius={15} fill="#FDE047" stroke="#1E1E28" strokeWidth={1.5} />
        </Group>
      </TileShell>
    );
  }

  // 2. Islamic Geometric Rosette - Simplified
  if (artType === 'islamic-rosette') {
    const stars: React.ReactNode[] = [];
    for (let i = 0; i < 2; i++) {
      const rot = (i * 45);
      stars.push(
        <Rect
          key={`sq_${i}`}
          x={cx}
          y={cy}
          width={64}
          height={64}
          rotation={rot}
          fill="transparent"
          stroke={palette[i % palette.length]}
          strokeWidth={3} // Thicker, simpler
          offset={{ x: 32, y: 32 }}
        />
      );
    }
    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={intrinsicW} height={intrinsicH} isLocked={isLocked} isSelected={isSelected}>
        <Group onClick={randomizeArt} onTap={randomizeArt}>
          <Rect x={0} y={0} width={intrinsicW} height={intrinsicH} fill="#111827" stroke="#374151" strokeWidth={2} cornerRadius={10} />
          {stars}
          <Circle x={cx} y={cy} radius={20} fill="#F59E0B" stroke="#FFFFFF" strokeWidth={1.5} />
        </Group>
      </TileShell>
    );
  }

  // 3. Fractal Sierpinski Triangle - Simplified
  if (artType === 'fractal-sierpinski') {
    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={intrinsicW} height={intrinsicH} isLocked={isLocked} isSelected={isSelected}>
        <Group onClick={randomizeArt} onTap={randomizeArt}>
          <Line points={[cx, 15, cx + 50, intrinsicH - 20, cx - 50, intrinsicH - 20]} closed fill="#3B82F6" stroke="#1E1E28" strokeWidth={2} />
          <Line points={[cx, intrinsicH - 20, cx + 25, 57.5, cx - 25, 57.5]} closed fill="#FFFFFF" stroke="#1E1E28" strokeWidth={1.5} />
        </Group>
      </TileShell>
    );
  }

  // 4. Kaleidoscope Mesh (Default) - Simplified
  const lines: React.ReactNode[] = [];
  const rings = 3; // Simplified from 4 to 3
  for (let r = 1; r <= rings; r++) {
    const rad = r * 18; // Increased spacing
    lines.push(
      <Circle
        key={`circ_${r}`}
        x={cx}
        y={cy}
        radius={rad}
        fill="transparent"
        stroke={palette[r % palette.length]}
        strokeWidth={2}
      />
    );
  }

  return (
    <TileShell id={id} x={x} y={y} rotation={rotation} width={intrinsicW} height={intrinsicH} isLocked={isLocked} isSelected={isSelected}>
      <Group onClick={randomizeArt} onTap={randomizeArt}>
        <Rect x={0} y={0} width={intrinsicW} height={intrinsicH} fill="#0F172A" stroke="#334155" strokeWidth={2} cornerRadius={10} />
        {lines}
        <Line points={[cx, 15, cx, intrinsicH - 15]} stroke="#FFFFFF" strokeWidth={1.5} opacity={0.6} />
        <Line points={[15, cy, intrinsicW - 15, cy]} stroke="#FFFFFF" strokeWidth={1.5} opacity={0.6} />
      </Group>
    </TileShell>
  );
});
