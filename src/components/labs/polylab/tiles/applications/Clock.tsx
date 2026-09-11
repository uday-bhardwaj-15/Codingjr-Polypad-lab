'use client';

import React, { memo, useCallback } from 'react';
import { Group, Circle, Line, Text, Rect } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface ClockProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  hours?: number; // 1 to 12
  minutes?: number; // 0 to 59
  radius?: number;
  showDigital?: boolean;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const Clock = memo(function Clock({
  id,
  x,
  y,
  rotation = 0,
  hours = 10,
  minutes = 10,
  radius = 70,
  showDigital = true,
  isLocked = false,
  isSelected = false,
}: ClockProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);
  const diameter = radius * 2;

  // Calculate hand angles
  // Minute hand: 6 deg per minute (0 min -> top -90 deg)
  const minuteAngleDeg = minutes * 6 - 90;
  const minuteAngleRad = (minuteAngleDeg * Math.PI) / 180;

  // Hour hand: 30 deg per hour + 0.5 deg per minute (12 hr -> top -90 deg)
  const hourAngleDeg = ((hours % 12) + minutes / 60) * 30 - 90;
  const hourAngleRad = (hourAngleDeg * Math.PI) / 180;

  const minuteHandLen = radius * 0.72;
  const hourHandLen = radius * 0.48;

  const handleTimeStep = useCallback(
    (deltaMin: number, e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      let totalMin = (hours % 12) * 60 + minutes + deltaMin;
      if (totalMin < 0) totalMin += 720;
      totalMin = totalMin % 720;

      const nextHours = Math.floor(totalMin / 60) || 12;
      const nextMinutes = totalMin % 60;
      updateTileProps(id, { hours: nextHours, minutes: nextMinutes });
    },
    [id, hours, minutes, updateTileProps]
  );

  const formattedDigital = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={diameter}
      height={diameter + (showDigital ? 30 : 0)}
      isLocked={isLocked}
      isSelected={isSelected}
    >
      <Group x={radius} y={radius}>
        {/* Clock Face Rim */}
        <Circle
          radius={radius}
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth={3}
          shadowColor="rgba(0, 0, 0, 0.12)"
          shadowBlur={8}
          shadowOffsetY={3}
        />

        {/* Hour marks 1..12 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const num = i + 1;
          const markAngleRad = (num * 30 - 90) * (Math.PI / 180);
          const tx = (radius - 16) * Math.cos(markAngleRad);
          const ty = (radius - 16) * Math.sin(markAngleRad);

          return (
            <Text
              key={num}
              x={tx - 10}
              y={ty - 6}
              width={20}
              text={String(num)}
              align="center"
              fontSize={11}
              fontStyle="bold"
              fontFamily="Inter, system-ui, sans-serif"
              fill="#334155"
              listening={false}
            />
          );
        })}

        {/* Hour Hand */}
        <Line
          points={[
            0,
            0,
            hourHandLen * Math.cos(hourAngleRad),
            hourHandLen * Math.sin(hourAngleRad),
          ]}
          stroke="#0F172A"
          strokeWidth={4.5}
          lineCap="round"
        />

        {/* Minute Hand */}
        <Line
          points={[
            0,
            0,
            minuteHandLen * Math.cos(minuteAngleRad),
            minuteHandLen * Math.sin(minuteAngleRad),
          ]}
          stroke="#E11D48"
          strokeWidth={2.5}
          lineCap="round"
        />

        {/* Center Pin */}
        <Circle radius={4} fill="#0F172A" stroke="#FFFFFF" strokeWidth={1} />

        {/* Digital Time Badge */}
        {showDigital && (
          <Group x={-32} y={radius + 8}>
            <Rect
              x={0}
              y={0}
              width={64}
              height={20}
              fill="#0F172A"
              cornerRadius={6}
            />
            <Text
              x={0}
              y={3}
              width={64}
              text={formattedDigital}
              align="center"
              fontSize={11}
              fontStyle="bold"
              fontFamily="monospace"
              fill="#38BDF8"
            />
          </Group>
        )}

        {/* Interactive step adjusters when selected */}
        {isSelected && (
          <Group x={radius + 8} y={-24}>
            <Group onClick={(e) => handleTimeStep(5, e)}>
              <Circle radius={10} fill="#3B82F6" />
              <Text x={-10} y={-6} width={20} text="+5" align="center" fontSize={9} fontStyle="bold" fill="#FFFFFF" />
            </Group>
            <Group onClick={(e) => handleTimeStep(-5, e)} y={24}>
              <Circle radius={10} fill="#64748B" />
              <Text x={-10} y={-6} width={20} text="-5" align="center" fontSize={9} fontStyle="bold" fill="#FFFFFF" />
            </Group>
          </Group>
        )}
      </Group>
    </TileShell>
  );
});
