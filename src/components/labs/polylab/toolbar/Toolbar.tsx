"use client";

import React, { useState } from "react";
import { useCanvasStore } from "../canvas/useCanvasStore";
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Hand,
  MousePointer2,
  Grid3X3,
  Download,
  Trash2,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type Konva from "konva";

export interface ToolbarProps {
  stageRef?: React.RefObject<Konva.Stage | null>;
  onExportPng?: () => void;
  onOpenTour?: () => void;
}

export function Toolbar({ stageRef, onExportPng, onOpenTour }: ToolbarProps) {
  const title = useCanvasStore((s) => s.title);
  const setTitle = useCanvasStore((s) => s.setTitle);
  const saveStatus = useCanvasStore((s) => s.saveStatus);
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);
  const canUndo = useCanvasStore((s) => s.canUndo());
  const canRedo = useCanvasStore((s) => s.canRedo());
  const viewport = useCanvasStore((s) => s.viewport);
  const zoomIn = useCanvasStore((s) => s.zoomIn);
  const zoomOut = useCanvasStore((s) => s.zoomOut);
  const resetViewport = useCanvasStore((s) => s.resetViewport);
  const tool = useCanvasStore((s) => s.tool);
  const setTool = useCanvasStore((s) => s.setTool);
  const grid = useCanvasStore((s) => s.grid);
  const setGrid = useCanvasStore((s) => s.setGrid);
  const clearCanvas = useCanvasStore((s) => s.clearCanvas);
  const tiles = useCanvasStore((s) => s.tiles);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExportPNG = () => {
    if (onExportPng) {
      onExportPng();
      return;
    }
    const stage = stageRef?.current;
    if (!stage) return;

    // Export high-resolution PNG
    const dataUrl = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `${title.toLowerCase().replace(/\s+/g, "_")}_polylab.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tileCount = Object.keys(tiles).length;

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 select-none shadow-xs">
      {/* Left: Back & Title & Save Status */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Back to PolyLab Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">Dashboard</span>
        </Link>

        <div className="h-4 w-px bg-slate-200" />

        {/* Title Editor */}
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setIsEditingTitle(false);
            }}
            autoFocus
            className="px-2 py-0.5 text-sm font-bold text-slate-800 bg-slate-50 border border-blue-500 rounded focus:outline-none"
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-100"
            title="Click to rename canvas"
          >
            {title}
          </button>
        )}

        {/* Autosave Status Pill */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border bg-slate-50">
          {saveStatus === "saved" && (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-slate-600">Saved</span>
            </>
          )}
          {saveStatus === "saving" && (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span className="text-slate-600">Saving...</span>
            </>
          )}
          {saveStatus === "unsaved" && (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-slate-500">Unsaved edits</span>
            </>
          )}
          {saveStatus === "error" && (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-rose-600">Sync error</span>
            </>
          )}
        </div>
      </div>

      {/* Center: Tools & Undo/Redo Engine */}
      <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
        {/* Undo */}
        <button
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            canUndo
              ? "text-slate-700 hover:bg-white hover:shadow-xs"
              : "text-slate-300 cursor-not-allowed",
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
            "p-1.5 rounded-lg transition-colors",
            canRedo
              ? "text-slate-700 hover:bg-white hover:shadow-xs"
              : "text-slate-300 cursor-not-allowed",
          )}
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-0.5" />

        {/* Select Tool */}
        <button
          onClick={() => setTool("select")}
          title="Select Tool (V)"
          className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
            tool === "select"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-white",
          )}
        >
          <MousePointer2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Select</span>
        </button>

        {/* Pan Tool */}
        <button
          onClick={() => setTool("pan")}
          title="Pan Canvas (H / Space+Drag)"
          className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
            tool === "pan"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-white",
          )}
        >
          <Hand className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Pan</span>
        </button>

        <div className="h-4 w-px bg-slate-300 mx-0.5" />

        {/* Grid Snapping Toggle */}
        <button
          onClick={() =>
            setGrid({
              enabled: !grid.enabled || !grid.snapToGrid,
              snapToGrid: !grid.snapToGrid,
            })
          }
          title="Toggle Grid & Snapping"
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all",
            grid.snapToGrid
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-white",
          )}
        >
          <Grid3X3 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Snap</span>
        </button>
      </div>

      {/* Right: Zoom & Export Actions */}
      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/80">
          <button
            onClick={zoomOut}
            title="Zoom Out"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetViewport}
            title="Reset Zoom to 100%"
            className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-white rounded transition-colors"
          >
            {Math.round(viewport.scale * 100)}%
          </button>
          <button
            onClick={zoomIn}
            title="Zoom In"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Student Guided Tour Button */}
        {onOpenTour && (
          <button
            onClick={onOpenTour}
            title="Start Interactive Tour"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 text-xs font-bold border border-pink-200 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
            <span className="hidden sm:inline">Guided Tour</span>
          </button>
        )}

        {/* Export PNG */}
        <button
          onClick={handleExportPNG}
          title="Export as Image"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold border border-blue-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export PNG</span>
        </button>

        {/* Clear Canvas */}
        {showClearConfirm ? (
          <div className="flex items-center gap-1 bg-rose-50 p-0.5 rounded-lg border border-rose-200">
            <span className="text-[11px] font-bold text-rose-600 px-1.5">
              Clear all?
            </span>
            <button
              onClick={() => {
                clearCanvas();
                setShowClearConfirm(false);
              }}
              className="px-2 py-1 bg-rose-600 text-white rounded text-xs font-bold hover:bg-rose-700"
            >
              Yes
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded text-xs"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              if (tileCount > 0) setShowClearConfirm(true);
            }}
            disabled={tileCount === 0}
            title="Clear Canvas"
            className={cn(
              "p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors",
              tileCount === 0 && "opacity-40 cursor-not-allowed",
            )}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
