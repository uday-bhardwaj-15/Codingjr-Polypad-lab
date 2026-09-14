'use client';

import React, { memo, useCallback, useState } from 'react';
import { Group, Rect, Text } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface PlayingCardProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  suit?: '♠' | '♥' | '♦' | '♣';
  rank?: string;
  isFaceUp?: boolean;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const PlayingCard = memo(function PlayingCard({
  id,
  x,
  y,
  rotation = 0,
  suit = '♠',
  rank = 'A',
  isFaceUp = true,
  width = 64,
  height = 90,
  isLocked = false,
  isSelected = false,
}: PlayingCardProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const isJoker = rank === 'Joker';
  const isRed = suit === '♥' || suit === '♦';
  const suitColor = isJoker ? '#7C3AED' : isRed ? '#DC2626' : '#0F172A';

  const toggleFlip = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      updateTileProps(id, { isFaceUp: !isFaceUp });
    },
    [id, isFaceUp, updateTileProps]
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
      <Group onClick={toggleFlip} onTap={toggleFlip}>
        {isFaceUp ? (
          <>
            {/* Card Background */}
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill="#FFFFFF"
              stroke="#1E1E28"
              strokeWidth={2}
              cornerRadius={6}
              shadowColor="rgba(0,0,0,0.15)"
              shadowBlur={6}
            />

            {/* Top-Left Rank & Suit */}
            <Text
              x={4}
              y={4}
              text={isJoker ? "JOKER\n★" : `${rank}\n${suit}`}
              fontSize={isJoker ? 7 : 11}
              fontStyle="bold"
              fontFamily={isJoker ? "Inter, system-ui, sans-serif" : "Georgia, serif"}
              fill={suitColor}
              listening={false}
            />

            {/* Center Graphic */}
            {isJoker ? (
              <Group listening={false}>
                <Text
                  x={0}
                  y={height / 2 - 20}
                  width={width}
                  text="🃏"
                  align="center"
                  fontSize={26}
                />
                <Text
                  x={0}
                  y={height / 2 + 8}
                  width={width}
                  text="JOKER"
                  align="center"
                  fontSize={8}
                  fontStyle="bold"
                  fontFamily="Inter, system-ui, sans-serif"
                  fill="#7C3AED"
                />
              </Group>
            ) : (
              <Text
                x={0}
                y={height / 2 - 16}
                width={width}
                text={suit}
                align="center"
                fontSize={32}
                fontFamily="Georgia, serif"
                fill={suitColor}
                listening={false}
              />
            )}

            {/* Bottom-Right Rank & Suit */}
            <Text
              x={0}
              y={height - (isJoker ? 22 : 26)}
              width={width - 4}
              text={isJoker ? "★\nJOKER" : `${rank}\n${suit}`}
              align="right"
              fontSize={isJoker ? 7 : 11}
              fontStyle="bold"
              fontFamily={isJoker ? "Inter, system-ui, sans-serif" : "Georgia, serif"}
              fill={suitColor}
              listening={false}
            />
          </>
        ) : (
          <>
            {/* Card Back */}
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill="#1E40AF"
              stroke="#1E1E28"
              strokeWidth={2}
              cornerRadius={6}
              shadowColor="rgba(0,0,0,0.15)"
              shadowBlur={6}
            />
            <Rect
              x={4}
              y={4}
              width={width - 8}
              height={height - 8}
              stroke="#FFFFFF"
              strokeWidth={1.5}
              dash={[3, 3]}
              cornerRadius={4}
            />
          </>
        )}
      </Group>
    </TileShell>
  );
});
