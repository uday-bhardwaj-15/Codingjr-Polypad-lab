"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type Konva from "konva";
import { useCanvasStore } from "./useCanvasStore";
import { useKeyboardShortcuts } from "./useUndoRedo";
import { Toolbar } from "../toolbar/Toolbar";
import { TileSidebar } from "../sidebar/TileSidebar";
import { FloatingToolsDock } from "../toolbar/FloatingToolsDock";
import { RightCanvasDock } from "../toolbar/RightCanvasDock";
import { TileInspector } from "../inspector/TileInspector";
import { InteractiveTour } from "../tour/InteractiveTour";
import { useAutosave } from "@/lib/persistence/useAutosave";
import { loadCanvas as loadCanvasFromStorage } from "@/lib/persistence/polylab.storage";
import { FunctionMachineModalHost } from "./FunctionMachineModalHost";
// Dynamic import with SSR disabled for Konva Canvas stage
const PolyLabStage = dynamic(
  () => import("./PolyLabStage").then((mod) => mod.PolyLabStage),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white text-slate-400 gap-3">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold">
          Loading PolyLab Canvas Engine...
        </span>
      </div>
    ),
  },
);

export interface PolyLabCanvasProps {
  canvasId?: string;
  initialTitle?: string;
}

export function PolyLabCanvas({
  canvasId = "fraction_discovery",
  initialTitle = "Math Manipulatives Workspace",
}: PolyLabCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const stageRef = useRef<Konva.Stage | null>(null);

  const setCanvasId = useCanvasStore((s) => s.setCanvasId);
  const setTitle = useCanvasStore((s) => s.setTitle);
  const loadCanvasIntoStore = useCanvasStore((s) => s.loadCanvas);

  // Enable keyboard shortcuts (undo/redo, delete, duplicate, arrows)
  useKeyboardShortcuts();

  // Enable debounced autosave directly to localStorage
  useAutosave(canvasId);

  // Client mounting and initial document load from LocalStorage
  useEffect(() => {
    setMounted(true);
    setCanvasId(canvasId);
    if (initialTitle) setTitle(initialTitle);

    const doc = loadCanvasFromStorage(canvasId);
    if (doc && doc.tiles) {
      loadCanvasIntoStore(doc);
    }
  }, [canvasId, initialTitle, setCanvasId, setTitle, loadCanvasIntoStore]);

  if (!mounted) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#181923] text-white gap-3 font-sans">
        <div className="w-9 h-9 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold tracking-wide">
          Initializing PolyLab Workspace...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-white font-sans select-none">
      {/* Top Header Toolbar */}
      <Toolbar stageRef={stageRef} onOpenTour={() => setIsTourOpen(true)} />

      {/* Main Workspace Area: Sidebar + Stage + Docks */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left Drag Library with Exact Polypad Sections & Pure Shape Menus */}
        <TileSidebar onOpenTour={() => setIsTourOpen(true)} />

        {/* Center Konva Canvas Area */}
        <main className="relative flex-1 h-full overflow-hidden bg-white">
          <PolyLabStage stageRef={stageRef} />
          <FunctionMachineModalHost />
          {/* Bottom Floating Canvas Tools Dock (Select, Pen, Line, Compass, Text, Math, Eraser, Color) */}
          <FloatingToolsDock />

          {/* Right Floating View Controls Dock (Fullscreen, Undo, Redo, Grid, Zoom) */}
          <RightCanvasDock />

          {/* Floating Contextual Inspector for Active Selection */}
          <TileInspector />
        </main>
      </div>

      {/* Interactive Guided Tour Modal for Students */}
      <InteractiveTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  );
}
