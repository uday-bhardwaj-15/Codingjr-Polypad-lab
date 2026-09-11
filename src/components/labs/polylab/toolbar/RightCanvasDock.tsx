'use client';

import React, { useState } from 'react';
import { useCanvasStore } from '../canvas/useCanvasStore';
import {
  Maximize2,
  Minimize2,
  Undo2,
  Redo2,
  Grid3X3,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function RightCanvasDock() {
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);
  const canUndo = useCanvasStore((s) => s.canUndo());
  const canRedo = useCanvasStore((s) => s.canRedo());
  const zoomIn = useCanvasStore((s) => s.zoomIn);
  const zoomOut = useCanvasStore((s) => s.zoomOut);
  const resetViewport = useCanvasStore((s) => s.resetViewport);
  const grid = useCanvasStore((s) => s.grid);
  const setGrid = useCanvasStore((s) => s.setGrid);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const cycleGrid = () => {
    if (!grid.enabled) {
      setGrid({ enabled: true, snapToGrid: true, type: 'square' });
    } else if (grid.type === 'square') {
      setGrid({ enabled: true, snapToGrid: true, type: 'dot' });
    } else if (grid.type === 'dot') {
      setGrid({ enabled: true, snapToGrid: true, type: 'isometric' });
    } else {
      setGrid({ enabled: false, snapToGrid: false, type: 'none' });
    }
  };

  return (
    <aside aria-label="Canvas view controls" className="absolute top-6 right-6 z-30 flex flex-col items-center gap-1 bg-[#1E1F2B]/95 text-slate-300 p-1.5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md select-none">
      {/* Fullscreen */}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      {/* Undo */}
      <button
        onClick={undo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className={cn(
          'p-2 rounded-xl transition-colors',
          canUndo
            ? 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            : 'text-slate-600 cursor-not-allowed'
        )}
      >
        <Undo2 className="w-4 h-4" />
      </button>

      {/* Redo */}
      <button
        onClick={redo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
        className={cn(
          'p-2 rounded-xl transition-colors',
          canRedo
            ? 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            : 'text-slate-600 cursor-not-allowed'
        )}
      >
        <Redo2 className="w-4 h-4" />
      </button>

      <div className="w-4 h-px bg-slate-700 my-0.5" />

      {/* Grid mode toggle */}
      <button
        onClick={cycleGrid}
        title={`Grid: ${grid.enabled ? grid.type : 'off'} (Click to cycle)`}
        className={cn(
          'p-2 rounded-xl transition-colors',
          grid.enabled
            ? 'text-blue-400 bg-blue-500/10'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
        )}
      >
        <Grid3X3 className="w-4 h-4" />
      </button>

      {/* Background / Snap toggle */}
      <button
        onClick={() => setGrid({ snapToTiles: !grid.snapToTiles })}
        title={grid.snapToTiles ? 'Tile Snapping: On' : 'Tile Snapping: Off'}
        className={cn(
          'p-2 rounded-xl transition-colors',
          grid.snapToTiles
            ? 'text-emerald-400 bg-emerald-500/10'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
        )}
      >
        <ImageIcon className="w-4 h-4" />
      </button>

      <div className="w-4 h-px bg-slate-700 my-0.5" />

      {/* Zoom In */}
      <button
        onClick={zoomIn}
        title="Zoom In"
        className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {/* Zoom Out */}
      <button
        onClick={zoomOut}
        title="Zoom Out"
        className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      {/* Reset Viewport */}
      <button
        onClick={resetViewport}
        title="Reset Zoom & Pan"
        className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </aside>
  );
}
