'use client';

import React from 'react';
import { useCanvasStore } from '../canvas/useCanvasStore';
import { FractionModeToggle } from '../tiles/fraction/FractionModeToggle';
import { COLOR_SWATCHES, getFractionColor } from '../tiles/shared/palette';
import {
  RotateCcw,
  RotateCw,
  Copy,
  Trash2,
  Lock,
  Unlock,
  ChevronsUp,
  ChevronsDown,
  Layers,
  Palette,
  Minus,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FractionDisplayMode } from '../tiles/fraction/fraction.types';

export function TileInspector() {
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const tiles = useCanvasStore((s) => s.tiles);
  const updateTile = useCanvasStore((s) => s.updateTile);
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);
  const duplicateSelected = useCanvasStore((s) => s.duplicateSelected);
  const removeSelected = useCanvasStore((s) => s.removeSelected);
  const bringToFront = useCanvasStore((s) => s.bringToFront);
  const sendToBack = useCanvasStore((s) => s.sendToBack);

  if (selectedIds.length === 0) return null;

  const firstId = selectedIds[0];
  const tile = tiles[firstId];
  if (!tile) return null;

  const isMultiple = selectedIds.length > 1;

  const handleRotate = (delta: number) => {
    selectedIds.forEach((id) => {
      const t = tiles[id];
      if (t && !t.isLocked) {
        updateTile(id, { rotation: ((t.rotation || 0) + delta + 360) % 360 });
      }
    });
  };

  const handleToggleLock = () => {
    updateTile(firstId, { isLocked: !tile.isLocked });
  };

  const isFraction = tile.type === 'fraction-bar' || tile.type === 'fraction-circle';
  const isPolygon = tile.type === 'polygon';
  const isBalanceScale = tile.type === 'balance-scale';
  const isNumberBar = tile.type === 'number-bar';
  const isTenFrame = tile.type === 'ten-frame';
  const isPlayingCard = tile.type === 'playing-card';
  const isDice = tile.type === 'dice' || tile.type === 'polyhedral-dice';

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-md flex items-center gap-3 select-none transition-all">
      {/* Selection count badge */}
      <div className="flex items-center gap-1 text-xs font-semibold text-slate-300 pr-2 border-r border-slate-800">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span>{isMultiple ? `${selectedIds.length} items` : tile.type}</span>
      </div>

      {/* Playing Card Flip */}
      {isPlayingCard && (
        <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
          <button
            onClick={() => updateTileProps(firstId, { isFaceUp: !tile.props.isFaceUp })}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            {tile.props.isFaceUp === false ? 'Turn Face Up' : 'Turn Face Down'}
          </button>
        </div>
      )}

      {/* Dice Roll Action */}
      {isDice && (
        <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
          <button
            onClick={() => {
              const max = tile.type === 'polyhedral-dice' ? (tile.props.diceType === 'D20' ? 20 : tile.props.diceType === 'D12' ? 12 : tile.props.diceType === 'D10' ? 10 : tile.props.diceType === 'D8' ? 8 : tile.props.diceType === 'D4' ? 4 : 6) : 6;
              updateTileProps(firstId, { value: Math.floor(Math.random() * max) + 1 });
            }}
            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            🎲 Roll Die
          </button>
        </div>
      )}

      {/* Fraction Mode Toggle (when fraction is selected) */}
      {isFraction && (
        <div className="flex items-center gap-3 pr-2 border-r border-slate-800">
          <FractionModeToggle
            currentMode={(tile.props.mode as FractionDisplayMode) || 'fraction'}
            onModeChange={(m) => updateTileProps(firstId, { mode: m })}
            size="sm"
          />

          {/* Denominator Stepper */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Denom:</span>
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => {
                  const d = Math.max(1, (tile.props.denominator || 4) - 1);
                  const c = Math.min(tile.props.count || 1, d);
                  updateTileProps(firstId, { denominator: d, count: c });
                }}
                className="p-1 hover:bg-slate-700 rounded text-slate-300"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center font-bold text-white">
                {tile.props.denominator || 4}
              </span>
              <button
                onClick={() => {
                  const d = Math.min(24, (tile.props.denominator || 4) + 1);
                  updateTileProps(firstId, { denominator: d });
                }}
                className="p-1 hover:bg-slate-700 rounded text-slate-300"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Number Rod Value Stepper */}
      {isNumberBar && (
        <div className="flex items-center gap-2 pr-2 border-r border-slate-800 text-xs">
          <span className="text-slate-400">Length:</span>
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => {
                const v = Math.max(1, (tile.props.value || 5) - 1);
                updateTileProps(firstId, { value: v });
              }}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center font-bold text-white">
              {tile.props.value || 5}
            </span>
            <button
              onClick={() => {
                const v = Math.min(10, (tile.props.value || 5) + 1);
                updateTileProps(firstId, { value: v });
              }}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Polygon Sides Stepper */}
      {isPolygon && (
        <div className="flex items-center gap-2 pr-2 border-r border-slate-800 text-xs">
          <span className="text-slate-400">Sides:</span>
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => {
                const s = Math.max(3, (tile.props.sides || 6) - 1);
                updateTileProps(firstId, { sides: s });
              }}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center font-bold text-white">
              {tile.props.sides || 6}
            </span>
            <button
              onClick={() => {
                const s = Math.min(12, (tile.props.sides || 6) + 1);
                updateTileProps(firstId, { sides: s });
              }}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Ten Frame Counter Stepper */}
      {isTenFrame && (
        <div className="flex items-center gap-2 pr-2 border-r border-slate-800 text-xs">
          <span className="text-slate-400">Counters:</span>
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => {
                const c = Math.max(0, (tile.props.count || 3) - 1);
                updateTileProps(firstId, { count: c });
              }}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center font-bold text-white">
              {tile.props.count || 0}
            </span>
            <button
              onClick={() => {
                const c = Math.min(10, (tile.props.count || 3) + 1);
                updateTileProps(firstId, { count: c });
              }}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Color Palette Swatches (when single tile allows color customization) */}
      {(isFraction || isPolygon) && (
        <div className="flex items-center gap-1 pr-2 border-r border-slate-800">
          {COLOR_SWATCHES.slice(0, 6).map((swatch) => (
            <button
              key={swatch}
              onClick={() => {
                if (isFraction) updateTileProps(firstId, { color: swatch });
                if (isPolygon) updateTileProps(firstId, { fillColor: swatch });
              }}
              className="w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-transform"
              style={{ backgroundColor: swatch }}
            />
          ))}
        </div>
      )}

      {/* Universal Action Buttons */}
      <div className="flex items-center gap-1">
        {/* Rotate 45° CCW */}
        <button
          onClick={() => handleRotate(-45)}
          title="Rotate -45°"
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Rotate 45° CW */}
        <button
          onClick={() => handleRotate(45)}
          title="Rotate +45°"
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* Duplicate */}
        <button
          onClick={duplicateSelected}
          title="Duplicate (Ctrl+D)"
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
        >
          <Copy className="w-4 h-4" />
        </button>

        {/* Bring to Front */}
        <button
          onClick={() => selectedIds.forEach(bringToFront)}
          title="Bring to Front"
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
        >
          <ChevronsUp className="w-4 h-4" />
        </button>

        {/* Send to Back */}
        <button
          onClick={() => selectedIds.forEach(sendToBack)}
          title="Send to Back"
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
        >
          <ChevronsDown className="w-4 h-4" />
        </button>

        {/* Lock/Unlock */}
        <button
          onClick={handleToggleLock}
          title={tile.isLocked ? 'Unlock tile' : 'Lock tile position'}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            tile.isLocked
              ? 'bg-amber-500/20 text-amber-400'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          )}
        >
          {tile.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>

        {/* Delete */}
        <button
          onClick={removeSelected}
          title="Delete (Del)"
          className="p-1.5 hover:bg-rose-900/60 rounded-lg text-slate-300 hover:text-rose-400 transition-colors ml-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
