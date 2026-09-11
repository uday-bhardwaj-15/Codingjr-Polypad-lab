'use client';

import React, { memo, useCallback } from 'react';
import { Group, Rect, Text, Line, Circle } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface FunctionMachineProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  inputVal?: number;
  rule?: string; // e.g. '+ 3', '× 2', '2x + 1', 'x² - 1'
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const FunctionMachine = memo(function FunctionMachine({
  id,
  x,
  y,
  rotation = 0,
  inputVal = 4,
  rule = '× 3 + 2',
  width = 220,
  height = 140,
  isLocked = false,
  isSelected = false,
}: FunctionMachineProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  // Compute output based on rule
  const computeOutput = (inp: number, r: string): number => {
    try {
      if (r === '+ 3') return inp + 3;
      if (r === '× 2') return inp * 2;
      if (r === '× 3 + 2') return inp * 3 + 2;
      if (r === 'x²') return inp * inp;
      if (r === '- 5') return inp - 5;
      if (r === '÷ 2') return Number((inp / 2).toFixed(1));
      return inp * 2 + 1;
    } catch {
      return inp;
    }
  };

  const outputVal = computeOutput(inputVal, rule);

  const cycleInput = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const nextInput = inputVal >= 10 ? 1 : inputVal + 1;
      updateTileProps(id, { inputVal: nextInput });
    },
    [id, inputVal, updateTileProps]
  );

  const cycleRule = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      const rules = ['+ 3', '× 2', '× 3 + 2', 'x²', '- 5'];
      const currentIdx = rules.indexOf(rule);
      const nextRule = rules[(currentIdx + 1) % rules.length];
      updateTileProps(id, { rule: nextRule });
    },
    [id, rule, updateTileProps]
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
        {/* Machine Body Background */}
        <Rect
          x={40}
          y={20}
          width={140}
          height={100}
          fill="#4F46E5"
          stroke="#1E1E28"
          strokeWidth={3}
          cornerRadius={12}
          shadowColor="rgba(0,0,0,0.2)"
          shadowBlur={10}
        />

        {/* Top Funnel / Input Pipe */}
        <Line points={[20, 45, 40, 45, 40, 65, 20, 65]} closed fill="#3730A3" stroke="#1E1E28" strokeWidth={2} />
        {/* Output Pipe */}
        <Line points={[180, 45, 200, 45, 200, 65, 180, 65]} closed fill="#3730A3" stroke="#1E1E28" strokeWidth={2} />

        {/* Input Badge (Clickable) */}
        <Group x={10} y={40} onClick={cycleInput} onTap={cycleInput}>
          <Circle x={15} y={15} radius={16} fill="#10B981" stroke="#1E1E28" strokeWidth={2} />
          <Text x={0} y={7} width={30} text={String(inputVal)} align="center" fontSize={14} fontStyle="bold" fill="#FFFFFF" listening={false} />
        </Group>

        {/* Machine Label / Screen */}
        <Rect x={55} y={35} width={110} height={50} fill="#1E1B4B" stroke="#818CF8" strokeWidth={2} cornerRadius={6} />
        <Text x={55} y={40} width={110} text="FUNCTION f(x)" align="center" fontSize={9} fontStyle="bold" fill="#A5B4FC" />
        
        {/* Clickable Rule */}
        <Group onClick={cycleRule} onTap={cycleRule}>
          <Text
            x={55}
            y={56}
            width={110}
            text={rule}
            align="center"
            fontSize={16}
            fontStyle="bold"
            fill="#FDE047"
          />
        </Group>

        {/* Decorative Gears/Indicators */}
        <Circle x={60} y={104} radius={5} fill="#F43F5E" />
        <Circle x={75} y={104} radius={5} fill="#38BDF8" />
        <Circle x={90} y={104} radius={5} fill="#4ADE80" />

        {/* Output Badge */}
        <Group x={185} y={40}>
          <Circle x={15} y={15} radius={16} fill="#F59E0B" stroke="#1E1E28" strokeWidth={2} />
          <Text x={0} y={7} width={30} text={String(outputVal)} align="center" fontSize={13} fontStyle="bold" fill="#FFFFFF" />
        </Group>
      </Group>
    </TileShell>
  );
});
