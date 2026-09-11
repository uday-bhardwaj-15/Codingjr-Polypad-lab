'use client';

import React, { memo } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { TileShell } from '../shared/TileShell';

export type ChessColor = 'white' | 'black';
export type ChessPiece = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
export type ChessVariant = 'board' | 'piece';

export interface ChessProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  variant?: ChessVariant;
  piece?: ChessPiece;
  color?: ChessColor;
  isLocked?: boolean;
  isSelected?: boolean;
}

// Unicode chess pieces
const PIECE_UNICODE: Record<ChessPiece, { white: string; black: string }> = {
  K: { white: '♔', black: '♚' },
  Q: { white: '♕', black: '♛' },
  R: { white: '♖', black: '♜' },
  B: { white: '♗', black: '♝' },
  N: { white: '♘', black: '♞' },
  P: { white: '♙', black: '♟' },
};

// Standard chess starting position (rank 8..1, file a..h)
const INITIAL_POSITION: Array<{ rank: number; file: number; piece: ChessPiece; color: ChessColor }> = [
  // White pieces (rank 1 and 2)
  { rank: 1, file: 1, piece: 'R', color: 'white' },
  { rank: 1, file: 2, piece: 'N', color: 'white' },
  { rank: 1, file: 3, piece: 'B', color: 'white' },
  { rank: 1, file: 4, piece: 'Q', color: 'white' },
  { rank: 1, file: 5, piece: 'K', color: 'white' },
  { rank: 1, file: 6, piece: 'B', color: 'white' },
  { rank: 1, file: 7, piece: 'N', color: 'white' },
  { rank: 1, file: 8, piece: 'R', color: 'white' },
  ...Array.from({ length: 8 }, (_, i) => ({ rank: 2, file: i + 1, piece: 'P' as ChessPiece, color: 'white' as ChessColor })),
  // Black pieces (rank 8 and 7)
  { rank: 8, file: 1, piece: 'R', color: 'black' },
  { rank: 8, file: 2, piece: 'N', color: 'black' },
  { rank: 8, file: 3, piece: 'B', color: 'black' },
  { rank: 8, file: 4, piece: 'Q', color: 'black' },
  { rank: 8, file: 5, piece: 'K', color: 'black' },
  { rank: 8, file: 6, piece: 'B', color: 'black' },
  { rank: 8, file: 7, piece: 'N', color: 'black' },
  { rank: 8, file: 8, piece: 'R', color: 'black' },
  ...Array.from({ length: 8 }, (_, i) => ({ rank: 7, file: i + 1, piece: 'P' as ChessPiece, color: 'black' as ChessColor })),
];

export const Chess = memo(function Chess({
  id,
  x,
  y,
  rotation = 0,
  variant = 'board',
  piece = 'K',
  color = 'white',
  isLocked = false,
  isSelected = false,
}: ChessProps) {
  // ── Single piece tile ──────────────────────────────────────────────────────
  if (variant === 'piece') {
    const symbol = PIECE_UNICODE[piece][color];
    const tileW = 56;
    const tileH = 56;
    const bg = color === 'white' ? '#F8FAFC' : '#1E293B';
    const fg = color === 'white' ? '#0F172A' : '#F8FAFC';

    return (
      <TileShell
        id={id}
        x={x}
        y={y}
        rotation={rotation}
        width={tileW}
        height={tileH}
        isLocked={isLocked}
        isSelected={isSelected}
      >
        <Group>
          <Rect
            x={0}
            y={0}
            width={tileW}
            height={tileH}
            fill={bg}
            stroke={color === 'white' ? '#CBD5E1' : '#475569'}
            strokeWidth={2}
            cornerRadius={8}
            shadowColor="rgba(0,0,0,0.2)"
            shadowBlur={6}
            shadowOffsetY={2}
          />
          <Text
            x={0}
            y={6}
            width={tileW}
            text={symbol}
            align="center"
            fontSize={34}
            fontFamily="Georgia, 'Times New Roman', serif"
            fill={fg}
            listening={false}
          />
        </Group>
      </TileShell>
    );
  }

  // ── Full chessboard tile ───────────────────────────────────────────────────
  const CELL = 36; // cell size in px
  const BOARD = 8 * CELL; // 288px
  const BORDER = 20; // border with rank/file labels
  const totalW = BOARD + BORDER * 2;
  const totalH = BOARD + BORDER * 2;

  const lightSquare = '#F0D9B5';
  const darkSquare = '#B58863';
  const lightPiece = '#FFFFFF';
  const darkPiece = '#1E293B';

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={totalW}
      height={totalH}
      isLocked={isLocked}
      isSelected={isSelected}
    >
      <Group>
        {/* Board Border */}
        <Rect
          x={0}
          y={0}
          width={totalW}
          height={totalH}
          fill="#8B6914"
          cornerRadius={4}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={10}
          shadowOffsetY={4}
        />

        {/* Rank labels (1-8) on left */}
        {ranks.map((rank, i) => (
          <Text
            key={`rank-${rank}`}
            x={4}
            y={BORDER + i * CELL + CELL / 2 - 6}
            width={14}
            text={rank}
            align="center"
            fontSize={9}
            fontStyle="bold"
            fontFamily="Georgia, serif"
            fill="#F0D9B5"
            listening={false}
          />
        ))}
        {/* Rank labels on right */}
        {ranks.map((rank, i) => (
          <Text
            key={`rank-r-${rank}`}
            x={BOARD + BORDER + 4}
            y={BORDER + i * CELL + CELL / 2 - 6}
            width={14}
            text={rank}
            align="center"
            fontSize={9}
            fontStyle="bold"
            fontFamily="Georgia, serif"
            fill="#F0D9B5"
            listening={false}
          />
        ))}
        {/* File labels (a-h) on bottom */}
        {files.map((file, i) => (
          <Text
            key={`file-b-${file}`}
            x={BORDER + i * CELL}
            y={BOARD + BORDER + 4}
            width={CELL}
            text={file}
            align="center"
            fontSize={9}
            fontStyle="bold"
            fontFamily="Georgia, serif"
            fill="#F0D9B5"
            listening={false}
          />
        ))}
        {/* File labels on top */}
        {files.map((file, i) => (
          <Text
            key={`file-t-${file}`}
            x={BORDER + i * CELL}
            y={5}
            width={CELL}
            text={file}
            align="center"
            fontSize={9}
            fontStyle="bold"
            fontFamily="Georgia, serif"
            fill="#F0D9B5"
            listening={false}
          />
        ))}

        {/* Squares */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => {
            const isLight = (row + col) % 2 === 0;
            return (
              <Rect
                key={`sq-${row}-${col}`}
                x={BORDER + col * CELL}
                y={BORDER + row * CELL}
                width={CELL}
                height={CELL}
                fill={isLight ? lightSquare : darkSquare}
                listening={false}
              />
            );
          })
        )}

        {/* Chess pieces in starting position */}
        {INITIAL_POSITION.map(({ rank, file, piece: p, color: c }) => {
          const col = file - 1; // 0-indexed
          const row = 8 - rank; // rank 8 = row 0
          const symbol = PIECE_UNICODE[p][c];
          const textColor = c === 'white' ? lightPiece : darkPiece;
          const shadowColor = c === 'white' ? '#4A4A4A' : '#F0F0F0';
          return (
            <React.Fragment key={`piece-${rank}-${file}`}>
              {/* Shadow text for contrast */}
              <Text
                x={BORDER + col * CELL + 1}
                y={BORDER + row * CELL + 2}
                width={CELL}
                text={symbol}
                align="center"
                fontSize={20}
                fontFamily="Georgia, 'Times New Roman', serif"
                fill={shadowColor}
                opacity={0.35}
                listening={false}
              />
              <Text
                x={BORDER + col * CELL}
                y={BORDER + row * CELL + 1}
                width={CELL}
                text={symbol}
                align="center"
                fontSize={20}
                fontFamily="Georgia, 'Times New Roman', serif"
                fill={textColor}
                listening={false}
              />
            </React.Fragment>
          );
        })}
      </Group>
    </TileShell>
  );
});
