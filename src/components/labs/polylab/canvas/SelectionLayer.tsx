'use client';

import React, { memo } from 'react';
import { Group, Rect, Circle, Line, Text } from 'react-konva';
import type Konva from 'konva';
import { useCanvasStore } from './useCanvasStore';
import { getBoundingBox } from './snap';

export interface SelectionLayerProps {
  marqueeBox: { x: number; y: number; width: number; height: number } | null;
}

export const SelectionLayer = memo(function SelectionLayer({
  marqueeBox,
}: SelectionLayerProps) {
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const tiles = useCanvasStore((s) => s.tiles);
  const updateTile = useCanvasStore((s) => s.updateTile);
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);
  const duplicateSelected = useCanvasStore((s) => s.duplicateSelected);
  const removeSelected = useCanvasStore((s) => s.removeSelected);
  const bringToFront = useCanvasStore((s) => s.bringToFront);
  const addTile = useCanvasStore((s) => s.addTile);

  if (selectedIds.length === 0 && !marqueeBox) return null;

  const selectedTiles = selectedIds.map((id) => tiles[id]).filter(Boolean);
  const bounds = getBoundingBox(selectedTiles);

  const handleRotate = (deltaDeg: number, e: Konva.KonvaEventObject<any>) => {
    e.cancelBubble = true;
    selectedIds.forEach((id) => {
      const t = tiles[id];
      if (t && !t.isLocked) {
        updateTile(id, { rotation: ((t.rotation || 0) + deltaDeg + 360) % 360 });
      }
    });
  };

  // Split action: e.g. For a FractionBar with count=3, splits it into 3 separate unit fraction bars!
  const handleSplit = (e: Konva.KonvaEventObject<any>) => {
    e.cancelBubble = true;
    selectedIds.forEach((id) => {
      const t = tiles[id];
      if (!t) return;
      if (t.type === 'fraction-bar') {
        const count = t.props.count || 1;
        const denom = t.props.denominator || 1;
        if (count > 1) {
          const unitW = (t.width || 240) / denom;
          // Replace current with 1 unit
          updateTileProps(id, { count: 1 });
          // Spawn remaining units
          for (let i = 1; i < count; i++) {
            addTile({
              type: 'fraction-bar',
              x: t.x + i * (unitW + 10),
              y: t.y,
              width: t.width,
              height: t.height,
              props: { ...t.props, count: 1 },
            });
          }
        }
      }
    });
  };

  const isSingle = selectedTiles.length === 1;
  const primaryTile = selectedTiles[0];

  return (
    <Group>
      {/* Marquee Drag Box */}
      {marqueeBox && (
        <Rect
          x={marqueeBox.x}
          y={marqueeBox.y}
          width={marqueeBox.width}
          height={marqueeBox.height}
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3B82F6"
          strokeWidth={1}
          dash={[4, 4]}
          listening={false}
        />
      )}

      {/* Selected Tile Highlight Box */}
      {selectedTiles.length > 0 && (
        <Group>
          {/* Outer Border Highlight */}
          <Rect
            x={bounds.minX - 3}
            y={bounds.minY - 3}
            width={bounds.width + 6}
            height={bounds.height + 6}
            stroke="#1E1E28"
            strokeWidth={2}
            cornerRadius={6}
            listening={false}
          />

          {/* Top Center Rotation Handle Pin */}
          <Group
            x={bounds.minX + bounds.width / 2}
            y={bounds.minY}
            onClick={(e) => handleRotate(45, e)}
            onTap={(e) => handleRotate(45, e)}
          >
            {/* Pin Stem */}
            <Line
              points={[0, 0, 0, -22]}
              stroke="#1E1E28"
              strokeWidth={3}
              listening={false}
            />
            {/* Pin Head */}
            <Circle
              x={0}
              y={-22}
              radius={7}
              fill="#1E1E28"
              stroke="#FFFFFF"
              strokeWidth={1.5}
            />
          </Group>

          {/* Contextual Action Chip Pill Underneath the Selected Tile */}
          <Group
            x={bounds.minX + bounds.width / 2 - 130}
            y={bounds.minY + bounds.height + 14}
          >
            {/* Background pill */}
            <Rect
              x={0}
              y={0}
              width={260}
              height={32}
              fill="#1E1E28"
              cornerRadius={16}
              shadowColor="rgba(0, 0, 0, 0.35)"
              shadowBlur={10}
              shadowOffsetY={4}
            />

            {/* Split ▶ Button */}
            <Group
              x={12}
              y={6}
              onClick={handleSplit}
              onTap={handleSplit}
            >
              <Rect
                x={0}
                y={0}
                width={62}
                height={20}
                fill="#2E2F40"
                cornerRadius={10}
              />
              <Text
                x={0}
                y={4}
                width={62}
                text="Split ▶"
                align="center"
                fontSize={10}
                fontStyle="bold"
                fontFamily="Inter, system-ui, sans-serif"
                fill="#F8FAFC"
              />
            </Group>

            {/* Rotate 45° */}
            <Group
              x={84}
              y={7}
              onClick={(e) => handleRotate(45, e)}
              onTap={(e) => handleRotate(45, e)}
            >
              <Circle x={9} y={9} radius={9} fill="#2E2F40" />
              <Text
                x={0}
                y={3}
                width={18}
                text="↻"
                align="center"
                fontSize={11}
                fill="#E2E8F0"
              />
            </Group>

            {/* Duplicate Button */}
            <Group
              x={112}
              y={7}
              onClick={() => duplicateSelected()}
              onTap={() => duplicateSelected()}
            >
              <Circle x={9} y={9} radius={9} fill="#2E2F40" />
              <Text
                x={0}
                y={2}
                width={18}
                text="⧉"
                align="center"
                fontSize={12}
                fill="#E2E8F0"
              />
            </Group>

            {/* Bring to Front */}
            <Group
              x={140}
              y={7}
              onClick={() => selectedIds.forEach(bringToFront)}
              onTap={() => selectedIds.forEach(bringToFront)}
            >
              <Circle x={9} y={9} radius={9} fill="#2E2F40" />
              <Text
                x={0}
                y={3}
                width={18}
                text="▲"
                align="center"
                fontSize={9}
                fill="#E2E8F0"
              />
            </Group>

            {/* Delete Button */}
            <Group
              x={168}
              y={7}
              onClick={() => removeSelected()}
              onTap={() => removeSelected()}
            >
              <Circle x={9} y={9} radius={9} fill="#DC2626" />
              <Text
                x={0}
                y={2}
                width={18}
                text="🗑"
                align="center"
                fontSize={10}
                fill="#FFFFFF"
              />
            </Group>

            {/* More Options / Info */}
            <Group
              x={196}
              y={7}
              onClick={(e) => handleRotate(-45, e)}
              onTap={(e) => handleRotate(-45, e)}
            >
              <Circle x={9} y={9} radius={9} fill="#2E2F40" />
              <Text
                x={0}
                y={3}
                width={18}
                text="↺"
                align="center"
                fontSize={11}
                fill="#E2E8F0"
              />
            </Group>

            {/* Extra Menu ⋮ */}
            <Group x={224} y={7}>
              <Circle x={9} y={9} radius={9} fill="#2E2F40" />
              <Text
                x={0}
                y={3}
                width={18}
                text="⋮"
                align="center"
                fontSize={12}
                fontStyle="bold"
                fill="#94A3B8"
              />
            </Group>
          </Group>
        </Group>
      )}
    </Group>
  );
});
