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
  const removeTile = useCanvasStore((s) => s.removeTile);
  const removeSelected = useCanvasStore((s) => s.removeSelected);
  const bringToFront = useCanvasStore((s) => s.bringToFront);
  const addTile = useCanvasStore((s) => s.addTile);

  const [resizeStart, setResizeStart] = React.useState<{
    boundsW: number;
    boundsH: number;
    tiles: Record<string, { width: number; height: number }>;
  } | null>(null);

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

  // Split action: supports FractionBar (units) and Polyomino (prebuilt puzzle set to pieces)
  const handleSplit = (e: Konva.KonvaEventObject<any>) => {
    e.cancelBubble = true;
    selectedIds.forEach((id) => {
      const t = tiles[id];
      if (!t) return;

      // Fraction bar splitting
      if (t.type === 'fraction-bar') {
        const count = t.props.count || 1;
        const denom = t.props.denominator || 1;
        if (count > 1) {
          const unitW = (t.width || 240) / denom;
          updateTileProps(id, { count: 1 });
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

      // Polyomino prebuilt set splitting
      if (t.type === 'polyomino') {
        const v = t.props.variant || 'pentominoes-set';
        if (v === 'tetrominoes-set') {
          removeTile(id);
          const pieces = [
            { variant: 'tetromino-T', x: t.x + 10, y: t.y + 10, width: 90, height: 60, color: '#DB2777' },
            { variant: 'tetromino-L', x: t.x + 100, y: t.y + 10, width: 60, height: 90, color: '#0284C7' },
            { variant: 'tetromino-O', x: t.x + 100, y: t.y + 60, width: 60, height: 60, color: '#EA580C' },
            { variant: 'tetromino-Z', x: t.x + 10, y: t.y + 55, width: 60, height: 60, color: '#16A34A' },
            { variant: 'tetromino-I', x: t.x + 40, y: t.y + 85, width: 120, height: 35, color: '#7C3AED' },
          ];
          pieces.forEach((p) => {
            addTile({
              type: 'polyomino',
              x: p.x,
              y: p.y,
              width: p.width,
              height: p.height,
              props: { variant: p.variant, color: p.color, baseWidth: p.width, baseHeight: p.height },
            });
          });
        } else if (v === 'pentominoes-set') {
          removeTile(id);
          const pieces = [
            { variant: 'pentomino-L', x: t.x + 6, y: t.y + 6, width: 36, height: 108, color: '#16A34A' },
            { variant: 'pentomino-U', x: t.x + 42, y: t.y + 6, width: 72, height: 72, color: '#0284C7' },
            { variant: 'pentomino-I', x: t.x + 114, y: t.y + 6, width: 36, height: 72, color: '#7C3AED' },
            { variant: 'pentomino-X', x: t.x + 150, y: t.y + 6, width: 84, height: 108, color: '#DB2777' },
            { variant: 'pentomino-P', x: t.x + 186, y: t.y + 6, width: 48, height: 36, color: '#EA580C' },
            { variant: 'pentomino-Z', x: t.x + 186, y: t.y + 42, width: 48, height: 72, color: '#F59E0B' },
            { variant: 'pentomino-F', x: t.x + 6, y: t.y + 78, width: 108, height: 36, color: '#0D9488' },
            { variant: 'pentomino-W', x: t.x + 114, y: t.y + 78, width: 36, height: 36, color: '#9333EA' },
          ];
          pieces.forEach((p) => {
            addTile({
              type: 'polyomino',
              x: p.x,
              y: p.y,
              width: p.width,
              height: p.height,
              props: { variant: p.variant, color: p.color, baseWidth: p.width, baseHeight: p.height },
            });
          });
        }
      }
    });
  };

  const handleResizeStart = (e: Konva.KonvaEventObject<any>) => {
    e.cancelBubble = true;
    const tileSizes: Record<string, { width: number; height: number }> = {};
    selectedTiles.forEach((t) => {
      tileSizes[t.id] = { width: t.width || 100, height: t.height || 100 };
    });
    setResizeStart({
      boundsW: Math.max(10, bounds.width),
      boundsH: Math.max(10, bounds.height),
      tiles: tileSizes,
    });
  };

  const handleResizeMove = (e: Konva.KonvaEventObject<any>) => {
    e.cancelBubble = true;
    if (!resizeStart) return;

    const node = e.target;
    const currentX = node.x();
    const currentY = node.y();

    const newTotalW = Math.max(24, currentX - bounds.minX - 3);
    const newTotalH = Math.max(24, currentY - bounds.minY - 3);

    const scaleFactorX = newTotalW / resizeStart.boundsW;
    const scaleFactorY = newTotalH / resizeStart.boundsH;

    selectedTiles.forEach((t) => {
      const orig = resizeStart.tiles[t.id];
      if (orig) {
        updateTile(t.id, {
          width: Math.max(20, Math.round(orig.width * scaleFactorX)),
          height: Math.max(20, Math.round(orig.height * scaleFactorY)),
        });
      }
    });
  };

  const handleResizeEnd = (e: Konva.KonvaEventObject<any>) => {
    e.cancelBubble = true;
    setResizeStart(null);
    e.target.position({
      x: bounds.minX + bounds.width + 3,
      y: bounds.minY + bounds.height + 3,
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

          {/* Bottom-Right Resize Handle Dot */}
          <Circle
            x={bounds.minX + bounds.width + 3}
            y={bounds.minY + bounds.height + 3}
            radius={7}
            fill="#1E1E28"
            stroke="#FFFFFF"
            strokeWidth={2}
            draggable
            onDragStart={handleResizeStart}
            onDragMove={handleResizeMove}
            onDragEnd={handleResizeEnd}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = 'nwse-resize';
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = 'default';
            }}
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
