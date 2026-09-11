'use client';

import React, { memo } from 'react';
import { Group, Rect, Path, Line } from 'react-konva';
import { TileShell } from '../shared/TileShell';

export type PolyominoVariant =
  | 'pentominoes-set'
  | 'tetrominoes-set'
  | 'tetromino-T'
  | 'tetromino-L'
  | 'tetromino-I'
  | 'tetromino-O'
  | 'tetromino-Z'
  | 'pentomino-P'
  | 'pentomino-F'
  | 'pentomino-X';

export interface PolyominoProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  variant?: PolyominoVariant;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const Polyomino = memo(function Polyomino({
  id,
  x,
  y,
  rotation = 0,
  variant = 'pentominoes-set',
  width = 240,
  height = 120,
  isLocked = false,
  isSelected = false,
}: PolyominoProps) {
  // Dimensions and rendering based on variant
  if (variant === 'pentominoes-set') {
    const w = 240;
    const h = 120;
    return (
      <TileShell
        id={id}
        x={x}
        y={y}
        rotation={rotation}
        width={w}
        height={h}
        isLocked={isLocked}
        isSelected={isSelected}
      >
        <Group>
          {/* Outer Border Box */}
          <Rect
            x={0}
            y={0}
            width={w}
            height={h}
            fill="#141520"
            stroke="#1E1E28"
            strokeWidth={3}
            cornerRadius={2}
          />
          {/* Individual Pentomino puzzle pieces matching user screenshot */}
          {/* Green L/I piece */}
          <Path
            data="M 6,6 L 42,6 L 42,42 L 24,42 L 24,114 L 6,114 Z"
            fill="#16A34A"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          {/* Teal piece */}
          <Path
            data="M 42,6 L 114,6 L 114,42 L 78,42 L 78,78 L 42,78 Z"
            fill="#0284C7"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          {/* Purple piece */}
          <Path
            data="M 114,6 L 150,6 L 150,78 L 114,78 Z"
            fill="#7C3AED"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          {/* Pink Cross piece */}
          <Path
            data="M 150,6 L 186,6 L 186,42 L 234,42 L 234,78 L 186,78 L 186,114 L 150,114 Z"
            fill="#DB2777"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          {/* Red Top-Right piece */}
          <Path
            data="M 186,6 L 234,6 L 234,42 L 186,42 Z"
            fill="#EA580C"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          {/* Orange Stepped piece */}
          <Path
            data="M 186,42 L 234,42 L 234,114 L 186,114 L 186,78 Z"
            fill="#F59E0B"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          {/* Bottom Teal strip */}
          <Path
            data="M 6,78 L 114,78 L 114,114 L 6,114 Z"
            fill="#0D9488"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          {/* Bottom Purple base */}
          <Path
            data="M 114,78 L 150,78 L 150,114 L 114,114 Z"
            fill="#9333EA"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
        </Group>
      </TileShell>
    );
  }

  if (variant === 'tetrominoes-set') {
    const w = 180;
    const h = 135;
    return (
      <TileShell
        id={id}
        x={x}
        y={y}
        rotation={rotation}
        width={w}
        height={h}
        isLocked={isLocked}
        isSelected={isSelected}
      >
        <Group>
          {/* Outer Border Box */}
          <Rect
            x={0}
            y={0}
            width={w}
            height={h}
            fill="#141520"
            stroke="#1E1E28"
            strokeWidth={3}
            cornerRadius={2}
          />
          {/* Tetromino T (Pink) */}
          <Path
            data="M 15,10 L 105,10 L 105,45 L 75,45 L 75,80 L 45,80 L 45,45 L 15,45 Z"
            fill="#DB2777"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          {/* Tetromino L (Blue) */}
          <Path
            data="M 105,10 L 165,10 L 165,80 L 135,80 L 135,45 L 105,45 Z"
            fill="#0284C7"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          {/* Tetromino O Square (Orange) */}
          <Path
            data="M 105,55 L 165,55 L 165,115 L 105,115 Z"
            fill="#EA580C"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          {/* Tetromino Z (Green) */}
          <Path
            data="M 15,55 L 65,55 L 65,115 L 35,115 L 35,85 L 15,85 Z"
            fill="#16A34A"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          {/* Tetromino I (Purple) */}
          <Path
            data="M 45,85 L 165,85 L 165,120 L 45,120 Z"
            fill="#7C3AED"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
        </Group>
      </TileShell>
    );
  }

  // Individual Tetromino / Pentomino Piece
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
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="#3B82F6"
        stroke="#1E1E28"
        strokeWidth={2.5}
        cornerRadius={3}
      />
    </TileShell>
  );
});
