'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Group } from 'react-konva';
import type Konva from 'konva';
import { useCanvasStore } from './useCanvasStore';
import { TILE_REGISTRY } from '../tiles/registry';
import { SelectionLayer } from './SelectionLayer';
import { snapToGrid } from './snap';

export interface PolyLabStageProps {
  stageRef?: React.RefObject<Konva.Stage | null>;
}

export function PolyLabStage({ stageRef: externalStageRef }: PolyLabStageProps) {
  const internalStageRef = useRef<Konva.Stage | null>(null);
  const stageRef = externalStageRef || internalStageRef;
  const containerRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [marquee, setMarquee] = useState<{ startX: number; startY: number; box: { x: number; y: number; width: number; height: number } } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const tiles = useCanvasStore((s) => s.tiles);
  const tileOrder = useCanvasStore((s) => s.tileOrder);
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const viewport = useCanvasStore((s) => s.viewport);
  const grid = useCanvasStore((s) => s.grid);
  const tool = useCanvasStore((s) => s.tool);

  const setViewport = useCanvasStore((s) => s.setViewport);
  const setSelection = useCanvasStore((s) => s.setSelection);
  const clearSelection = useCanvasStore((s) => s.clearSelection);
  const addTile = useCanvasStore((s) => s.addTile);

  // Resize observer to fill container
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Zoom on mouse wheel
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = stageRef.current;
      if (!stage) return;

      const oldScale = viewport.scale;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const scaleBy = 1.08;
      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const newScale = direction > 0
        ? Math.min(3.5, Number((oldScale * scaleBy).toFixed(2)))
        : Math.max(0.25, Number((oldScale / scaleBy).toFixed(2)));

      const mousePointTo = {
        x: (pointer.x - viewport.x) / oldScale,
        y: (pointer.y - viewport.y) / oldScale,
      };

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      setViewport({
        x: newPos.x,
        y: newPos.y,
        scale: newScale,
      });
    },
    [viewport, setViewport, stageRef]
  );

  // Stage pointer down: pan or marquee selection or deselect
  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      // Click on empty canvas background
      const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'background-layer';
      const isMiddleClick = 'button' in e.evt && e.evt.button === 1;

      if (tool === 'pan' || isMiddleClick) {
        const clientX = 'clientX' in e.evt ? e.evt.clientX : e.evt.touches[0].clientX;
        const clientY = 'clientY' in e.evt ? e.evt.clientY : e.evt.touches[0].clientY;
        setIsPanning(true);
        setPanStart({ x: clientX - viewport.x, y: clientY - viewport.y });
        return;
      }

      if (clickedOnEmpty) {
        if (!e.evt.shiftKey) {
          clearSelection();
        }

        // Start marquee selection in 'select' mode
        if (tool === 'select' && ('button' in e.evt ? e.evt.button === 0 : true)) {
          const stage = stageRef.current;
          if (!stage) return;
          const pointer = stage.getPointerPosition();
          if (pointer) {
            const canvasX = (pointer.x - viewport.x) / viewport.scale;
            const canvasY = (pointer.y - viewport.y) / viewport.scale;
            setMarquee({
              startX: canvasX,
              startY: canvasY,
              box: { x: canvasX, y: canvasY, width: 0, height: 0 },
            });
          }
        }
      }
    },
    [tool, viewport, clearSelection, stageRef]
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      if (isPanning) {
        const clientX = 'clientX' in e.evt ? e.evt.clientX : e.evt.touches[0].clientX;
        const clientY = 'clientY' in e.evt ? e.evt.clientY : e.evt.touches[0].clientY;
        setViewport({
          x: clientX - panStart.x,
          y: clientY - panStart.y,
        });
        return;
      }

      if (marquee) {
        const stage = stageRef.current;
        if (!stage) return;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const currentX = (pointer.x - viewport.x) / viewport.scale;
        const currentY = (pointer.y - viewport.y) / viewport.scale;

        const minX = Math.min(marquee.startX, currentX);
        const minY = Math.min(marquee.startY, currentY);
        const width = Math.abs(currentX - marquee.startX);
        const height = Math.abs(currentY - marquee.startY);

        setMarquee({
          ...marquee,
          box: { x: minX, y: minY, width, height },
        });

        // Find tiles inside marquee box
        const matchingIds = tileOrder.filter((id) => {
          const t = tiles[id];
          if (!t) return false;
          const tw = t.width ?? 100;
          const th = t.height ?? 100;
          return (
            t.x < minX + width &&
            t.x + tw > minX &&
            t.y < minY + height &&
            t.y + th > minY
          );
        });

        setSelection(matchingIds);
      }
    },
    [isPanning, panStart, marquee, viewport, tiles, tileOrder, setViewport, setSelection, stageRef]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setMarquee(null);
  }, []);

  // HTML5 Drag & Drop from Sidebar onto Canvas
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const rawData = e.dataTransfer.getData('application/polylab-tile');
      if (!rawData) return;

      try {
        const payload = JSON.parse(rawData);
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Calculate drop coordinates in canvas coordinate space
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        let canvasX = (screenX - viewport.x) / viewport.scale;
        let canvasY = (screenY - viewport.y) / viewport.scale;

        const reg = TILE_REGISTRY[payload.type as keyof typeof TILE_REGISTRY];
        const defaultW = payload.presetProps?.width || payload.presetProps?.size || reg?.defaultWidth || 120;
        const defaultH = payload.presetProps?.height || payload.presetProps?.size || reg?.defaultHeight || 80;

        // Center tile at drop point
        canvasX -= defaultW / 2;
        canvasY -= defaultH / 2;

        // Snap to grid if enabled
        if (grid.enabled && grid.snapToGrid) {
          const snapped = snapToGrid({ x: canvasX, y: canvasY }, grid.size, 15);
          canvasX = snapped.x;
          canvasY = snapped.y;
        }

        const initialProps = {
          ...(reg?.defaultProps || {}),
          ...(payload.presetProps || {}),
          baseWidth: defaultW,
          baseHeight: defaultH,
        };

        addTile({
          type: payload.type,
          x: Math.round(canvasX),
          y: Math.round(canvasY),
          width: defaultW,
          height: defaultH,
          props: initialProps,
        });
      } catch (err) {
        console.error('Failed to parse dropped tile payload', err);
      }
    },
    [viewport, grid, addTile]
  );

  // Background Grid calculations
  const renderGridLines = () => {
    if (!grid.enabled || grid.type === 'none') return null;

    const gridSize = grid.size * viewport.scale;
    const offsetX = viewport.x % gridSize;
    const offsetY = viewport.y % gridSize;

    const lines: React.ReactNode[] = [];
    const numCols = Math.ceil(dimensions.width / gridSize) + 2;
    const numRows = Math.ceil(dimensions.height / gridSize) + 2;

    for (let i = -1; i < numCols; i++) {
      const x = offsetX + i * gridSize;
      lines.push(
        <Line
          key={`v_${i}`}
          points={[x, 0, x, dimensions.height]}
          stroke="#E2E8F0"
          strokeWidth={1}
          opacity={0.65}
          listening={false}
        />
      );
    }

    for (let j = -1; j < numRows; j++) {
      const y = offsetY + j * gridSize;
      lines.push(
        <Line
          key={`h_${j}`}
          points={[0, y, dimensions.width, y]}
          stroke="#E2E8F0"
          strokeWidth={1}
          opacity={0.65}
          listening={false}
        />
      );
    }

    return lines;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-slate-50 overflow-hidden select-none"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Layer 1: Background & Grid (non-interactive) */}
        <Layer name="background-layer" listening={false}>
          <Rect
            x={0}
            y={0}
            width={dimensions.width}
            height={dimensions.height}
            fill="#F8FAFC"
          />
          {renderGridLines()}
        </Layer>

        {/* Layer 2: Interactive Tiles & Selection */}
        <Layer
          x={viewport.x}
          y={viewport.y}
          scaleX={viewport.scale}
          scaleY={viewport.scale}
        >
          {/* Render all tiles in zIndex order */}
          {tileOrder.map((id) => {
            const tile = tiles[id];
            if (!tile) return null;
            const entry = TILE_REGISTRY[tile.type];
            const Component = entry.component;
            const isSelected = selectedIds.includes(id);
            const baseW = tile.props?.baseWidth || entry.defaultWidth || tile.width || 120;
            const baseH = tile.props?.baseHeight || entry.defaultHeight || tile.height || 80;
            const scaleX = tile.props?.scaleX !== undefined ? tile.props.scaleX : (tile.width && baseW ? tile.width / baseW : 1);
            const scaleY = tile.props?.scaleY !== undefined ? tile.props.scaleY : (tile.height && baseH ? tile.height / baseH : 1);

            return (
              <Component
                key={id}
                id={id}
                x={tile.x}
                y={tile.y}
                rotation={tile.rotation || 0}
                width={tile.width}
                height={tile.height}
                scaleX={scaleX}
                scaleY={scaleY}
                isLocked={tile.isLocked}
                isSelected={isSelected}
                {...tile.props}
              />
            );
          })}

          {/* Selection & Marquee Bounding Box */}
          <SelectionLayer marqueeBox={marquee?.box || null} />
        </Layer>
      </Stage>
    </div>
  );
}
