"use client";

import React, { useState } from "react";
import type { CategoryType } from "../canvas/types";
import { ShapeTileItem } from "./ShapeTileItem";
import { FRACTION_COLORS } from "../tiles/shared/palette";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Shapes,
  Hash,
  PieChart,
  Scale,
  Dices,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface TileSidebarProps {
  onOpenTour?: () => void;
}

export function TileSidebar({ onOpenTour }: TileSidebarProps) {
  const [activeCategory, setActiveCategory] =
    useState<CategoryType>("geometry");
  const [activeSubSection, setActiveSubSection] =
    useState<string>("polygons_shapes");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCategory = (catId: CategoryType, defaultSub: string) => {
    if (activeCategory === catId) {
      // Toggle category open/close
    } else {
      setActiveCategory(catId);
      setActiveSubSection(defaultSub);
    }
  };

  const toggleSub = (subId: string) => {
    setActiveSubSection(activeSubSection === subId ? "" : subId);
  };

  return (
    <aside className="w-[320px] h-full bg-[#1E1F2B] text-slate-200 border-r border-[#2C2D3E] flex flex-col z-20 select-none shadow-xl font-sans">
      {/* Top Header Tab Bar matching Polypad */}
      <div className="flex items-center justify-between border-b border-[#2C2D3E] bg-[#181923] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2A2B3D] text-white shadow-xs">
            <span className="text-sm">▲</span>
            <span>Tiles</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Tour Button for Kids */}
          <button
            onClick={onOpenTour}
            title="Interactive Tour for Students"
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-pink-600/20 text-pink-400 hover:bg-pink-600/30 border border-pink-500/30 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span>Tour</span>
          </button>

          <button
            onClick={onOpenTour}
            title="Help & Info"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2A2B3D] transition-colors relative cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 pt-2.5 pb-1.5">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search all shapes & tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#15161F] border border-[#2C2D3E] rounded-md text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Main Categories & Exact Polypad Nested Structure */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5 scrollbar-thin">
        {/* ========================================================================= */}
        {/* CATEGORY 1: GEOMETRY */}
        {/* Sub-sections: 
            1. Polygons and Shapes
            2. Polyominoes
            3. Tangram
            4. Aperiodic Tiles
            5. Pentagon Tilings
            6. 3D Solids
            7. Linkages
            8. Utensils
            9. Patterns and Art
        */}
        {/* ========================================================================= */}
        <div className="rounded-xl overflow-hidden">
          <button
            onClick={() => toggleCategory("geometry", "geo_polygons")}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 transition-all text-left group cursor-pointer",
              activeCategory === "geometry"
                ? "bg-[#2A2B3D] shadow-xs"
                : "hover:bg-[#252636]",
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ⬡
              </div>
              <span className="font-bold text-sm tracking-tight text-pink-500">
                Geometry
              </span>
            </div>
            <div className="text-slate-400 group-hover:text-slate-200">
              {activeCategory === "geometry" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </button>

          {activeCategory === "geometry" && (
            <div className="bg-[#181924] border-t border-[#2C2D3E]/60 divide-y divide-[#2C2D3E]/40">
              {/* 1. Polygons and Shapes */}
              <div>
                <button
                  onClick={() => toggleSub("geo_polygons")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "geo_polygons"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Polygons and Shapes</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "geo_polygons" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "geo_polygons" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-3 gap-2">
                    <ShapeTileItem
                      type="polygon"
                      title="Equilateral Triangle"
                      presetProps={{
                        sides: 3,
                        radius: 40,
                        fillColor: "#10B981",
                        strokeColor: "#047857",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 60 60" className="w-12 h-12">
                          <polygon
                            points="30,8 54,50 6,50"
                            fill="#10B981"
                            stroke="#047857"
                            strokeWidth="3"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="polygon"
                      title="Square"
                      presetProps={{
                        sides: 4,
                        radius: 40,
                        fillColor: "#3B82F6",
                        strokeColor: "#1D4ED8",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 60 60" className="w-12 h-12">
                          <rect
                            x="10"
                            y="10"
                            width="40"
                            height="40"
                            rx="2"
                            fill="#3B82F6"
                            stroke="#1D4ED8"
                            strokeWidth="3"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="polygon"
                      title="Pentagon"
                      presetProps={{
                        sides: 5,
                        radius: 40,
                        fillColor: "#F59E0B",
                        strokeColor: "#D97706",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 60 60" className="w-12 h-12">
                          <polygon
                            points="30,8 53,24 44,52 16,52 7,24"
                            fill="#F59E0B"
                            stroke="#D97706"
                            strokeWidth="3"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="polygon"
                      title="Hexagon"
                      presetProps={{
                        sides: 6,
                        radius: 40,
                        fillColor: "#EC4899",
                        strokeColor: "#DB2777",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 60 60" className="w-12 h-12">
                          <polygon
                            points="30,8 50,20 50,42 30,54 10,42 10,20"
                            fill="#EC4899"
                            stroke="#DB2777"
                            strokeWidth="3"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="polygon"
                      title="Octagon"
                      presetProps={{
                        sides: 8,
                        radius: 40,
                        fillColor: "#8B5CF6",
                        strokeColor: "#6D28D9",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 60 60" className="w-12 h-12">
                          <polygon
                            points="20,8 40,8 52,20 52,40 40,52 20,52 8,40 8,20"
                            fill="#8B5CF6"
                            stroke="#6D28D9"
                            strokeWidth="3"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="polygon"
                      title="Circle"
                      presetProps={{
                        sides: 0,
                        radius: 40,
                        fillColor: "#06B6D4",
                        strokeColor: "#0891B2",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 60 60" className="w-12 h-12">
                          <circle
                            cx="30"
                            cy="30"
                            r="22"
                            fill="#06B6D4"
                            stroke="#0891B2"
                            strokeWidth="3"
                          />
                        </svg>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 2. Polyominoes */}
              <div>
                <button
                  onClick={() => toggleSub("geo_polyominoes")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "geo_polyominoes"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Polyominoes</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "geo_polyominoes" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "geo_polyominoes" && (
                  <div className="p-3 bg-[#141520] space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">
                        Pentominoes
                      </span>
                      <ShapeTileItem
                        type="polyomino"
                        title="Pentominoes Puzzle Set"
                        presetProps={{
                          variant: "pentominoes-set",
                          width: 240,
                          height: 120,
                        }}
                        shapeRender={
                          <svg
                            viewBox="0 0 240 120"
                            className="w-full h-20 rounded-md border-2 border-white/20 bg-slate-900 shadow-md"
                          >
                            <path
                              d="M6,6 L42,6 L42,42 L24,42 L24,114 L6,114 Z"
                              fill="#16A34A"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                            <path
                              d="M42,6 L114,6 L114,42 L78,42 L78,78 L42,78 Z"
                              fill="#0284C7"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                            <path
                              d="M114,6 L150,6 L150,78 L114,78 Z"
                              fill="#7C3AED"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                            <path
                              d="M150,6 L186,6 L186,42 L234,42 L234,78 L186,78 L186,114 L150,114 Z"
                              fill="#DB2777"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                            <path
                              d="M186,6 L234,6 L234,42 L186,42 Z"
                              fill="#EA580C"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                            <path
                              d="M186,42 L234,42 L234,114 L186,114 L186,78 Z"
                              fill="#F59E0B"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                            <path
                              d="M6,78 L114,78 L114,114 L6,114 Z"
                              fill="#0D9488"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                            <path
                              d="M114,78 L150,78 L150,114 L114,114 Z"
                              fill="#9333EA"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                          </svg>
                        }
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">
                        Tetrominoes
                      </span>
                      <ShapeTileItem
                        type="polyomino"
                        title="Tetrominoes Puzzle Set"
                        presetProps={{
                          variant: "tetrominoes-set",
                          width: 180,
                          height: 135,
                        }}
                        shapeRender={
                          <svg
                            viewBox="0 0 180 135"
                            className="w-36 h-20 mx-auto rounded-md border-2 border-white/20 bg-slate-900 shadow-md"
                          >
                            <path
                              d="M15,10 L105,10 L105,45 L75,45 L75,80 L45,80 L45,45 L15,45 Z"
                              fill="#DB2777"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                            <path
                              d="M105,10 L165,10 L165,80 L135,80 L135,45 L105,45 Z"
                              fill="#0284C7"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                            <path
                              d="M105,55 L165,55 L165,115 L105,115 Z"
                              fill="#EA580C"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                            <path
                              d="M15,55 L65,55 L65,115 L35,115 L35,85 L15,85 Z"
                              fill="#16A34A"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                            <path
                              d="M45,85 L165,85 L165,120 L45,120 Z"
                              fill="#7C3AED"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                          </svg>
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Tangram */}
              <div>
                <button
                  onClick={() => toggleSub("geo_tangram")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "geo_tangram"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Tangram</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "geo_tangram" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "geo_tangram" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-3 gap-2">
                    <ShapeTileItem
                      type="tangram"
                      title="Large Triangle (Red)"
                      presetProps={{
                        pieceType: "large-triangle-1",
                        unitSize: 32,
                      }}
                      shapeRender={
                        <svg viewBox="0 0 60 40" className="w-12 h-9">
                          <polygon
                            points="0,0 60,0 30,30"
                            fill="#EF4444"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="tangram"
                      title="Large Triangle (Blue)"
                      presetProps={{
                        pieceType: "large-triangle-2",
                        unitSize: 32,
                      }}
                      shapeRender={
                        <svg viewBox="0 0 40 60" className="w-9 h-12">
                          <polygon
                            points="0,0 0,60 30,30"
                            fill="#3B82F6"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="tangram"
                      title="Medium Triangle (Green)"
                      presetProps={{
                        pieceType: "medium-triangle",
                        unitSize: 32,
                      }}
                      shapeRender={
                        <svg viewBox="0 0 50 50" className="w-10 h-10">
                          <polygon
                            points="0,0 50,50 0,50"
                            fill="#10B981"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="tangram"
                      title="Square (Pink)"
                      presetProps={{ pieceType: "square", unitSize: 32 }}
                      shapeRender={
                        <svg viewBox="0 0 50 50" className="w-10 h-10">
                          <polygon
                            points="25,0 50,25 25,50 0,25"
                            fill="#EC4899"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="tangram"
                      title="Parallelogram (Cyan)"
                      presetProps={{ pieceType: "parallelogram", unitSize: 32 }}
                      shapeRender={
                        <svg viewBox="0 0 60 30" className="w-12 h-6">
                          <polygon
                            points="0,0 40,0 60,30 20,30"
                            fill="#06B6D4"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="tangram"
                      title="Small Triangle (Amber)"
                      presetProps={{
                        pieceType: "small-triangle-1",
                        unitSize: 32,
                      }}
                      shapeRender={
                        <svg viewBox="0 0 50 30" className="w-10 h-7">
                          <polygon
                            points="0,0 50,0 25,25"
                            fill="#F59E0B"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 4. Aperiodic Tiles */}
              <div>
                <button
                  onClick={() => toggleSub("geo_aperiodic")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "geo_aperiodic"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Aperiodic Tiles</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "geo_aperiodic" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "geo_aperiodic" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-4 gap-2">
                    <ShapeTileItem
                      type="aperiodic-tile"
                      title="Penrose Kite"
                      presetProps={{
                        variant: "penrose-kite",
                        color: "#3B82F6",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 50 50" className="w-10 h-10">
                          <polygon
                            points="25,5 45,22 25,45 5,22"
                            fill="#3B82F6"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="aperiodic-tile"
                      title="Penrose Dart"
                      presetProps={{
                        variant: "penrose-dart",
                        color: "#EC4899",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 50 50" className="w-10 h-10">
                          <polygon
                            points="25,5 45,45 25,30 5,45"
                            fill="#EC4899"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="aperiodic-tile"
                      title="Einstein Hat Monotile"
                      presetProps={{
                        variant: "einstein-hat",
                        color: "#10B981",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 60 60" className="w-11 h-11">
                          <polygon
                            points="15,10 32,7 45,18 58,14 52,35 55,52 42,55 32,45 22,55 12,45 18,32 8,25"
                            fill="#10B981"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="aperiodic-tile"
                      title="Penrose Rhombus"
                      presetProps={{
                        variant: "penrose-thick-rhomb",
                        color: "#F59E0B",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 50 50" className="w-10 h-10">
                          <polygon
                            points="25,5 45,25 25,45 5,25"
                            fill="#F59E0B"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 5. Pentagon Tilings */}
              <div>
                <button
                  onClick={() => toggleSub("geo_pentagons")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "geo_pentagons"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Pentagon Tilings</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "geo_pentagons" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "geo_pentagons" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-3 gap-2">
                    <ShapeTileItem
                      type="pentagon-tile"
                      title="Cairo Pentagon"
                      presetProps={{
                        variant: "cairo-pentagon",
                        color: "#0284C7",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 50 50" className="w-10 h-10">
                          <polygon
                            points="25,5 45,20 37,45 13,45 5,20"
                            fill="#0284C7"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="pentagon-tile"
                      title="Hirschhorn Pentagon"
                      presetProps={{
                        variant: "hirschhorn-pentagon",
                        color: "#D946EF",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 50 50" className="w-10 h-10">
                          <polygon
                            points="12,5 42,12 45,38 25,45 5,28"
                            fill="#D946EF"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="pentagon-tile"
                      title="Floret Pentagon"
                      presetProps={{
                        variant: "floret-pentagon",
                        color: "#F59E0B",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 50 50" className="w-10 h-10">
                          <polygon
                            points="25,5 46,22 38,45 12,45 4,22"
                            fill="#F59E0B"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 6. 3D Solids */}
              <div>
                <button
                  onClick={() => toggleSub("geo_solids")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "geo_solids"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>3D Solids</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "geo_solids" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "geo_solids" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-3 gap-2">
                    <ShapeTileItem
                      type="solid-3d"
                      title="3D Cube"
                      presetProps={{ solidType: "cube", size: 120 }}
                      shapeRender={
                        <svg viewBox="0 0 60 60" className="w-11 h-11">
                          <polygon
                            points="30,6 54,18 30,30 6,18"
                            fill="#A78BFA"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                          <polygon
                            points="6,18 30,30 30,54 6,42"
                            fill="#7C3AED"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                          <polygon
                            points="30,30 54,18 54,42 30,54"
                            fill="#6D28D9"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="solid-3d"
                      title="3D Cylinder"
                      presetProps={{ solidType: "cylinder", size: 120 }}
                      shapeRender={
                        <svg viewBox="0 0 60 60" className="w-11 h-11">
                          <path
                            d="M 12,18 L 48,18 L 48,42 A 18,7 0 0,1 12,42 Z"
                            fill="#0EA5E9"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                          <ellipse
                            cx="30"
                            cy="42"
                            rx="18"
                            ry="7"
                            fill="#0284C7"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                          <ellipse
                            cx="30"
                            cy="18"
                            rx="18"
                            ry="7"
                            fill="#38BDF8"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="solid-3d"
                      title="3D Cone"
                      presetProps={{ solidType: "cone", size: 120 }}
                      shapeRender={
                        <svg viewBox="0 0 60 60" className="w-11 h-11">
                          <polygon
                            points="30,10 10,44 50,44"
                            fill="#F59E0B"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                          <ellipse
                            cx="30"
                            cy="44"
                            rx="20"
                            ry="7"
                            fill="#D97706"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="solid-3d"
                      title="3D Sphere"
                      presetProps={{ solidType: "sphere", size: 120 }}
                      shapeRender={
                        <svg viewBox="0 0 60 60" className="w-11 h-11">
                          <circle
                            cx="30"
                            cy="30"
                            r="22"
                            fill="#10B981"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                          <ellipse
                            cx="30"
                            cy="30"
                            rx="22"
                            ry="7"
                            fill="none"
                            stroke="#047857"
                            strokeWidth="1"
                            strokeDasharray="3,3"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="solid-3d"
                      title="3D Pyramid"
                      presetProps={{ solidType: "pyramid", size: 120 }}
                      shapeRender={
                        <svg viewBox="0 0 60 60" className="w-11 h-11">
                          <polygon
                            points="30,8 8,44 34,48"
                            fill="#EC4899"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                          <polygon
                            points="30,8 34,48 54,38"
                            fill="#BE185D"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="solid-3d"
                      title="Triangular Prism"
                      presetProps={{ solidType: "triangular-prism", size: 120 }}
                      shapeRender={
                        <svg viewBox="0 0 60 60" className="w-11 h-11">
                          <polygon
                            points="12,18 42,10 52,35 22,44"
                            fill="#34D399"
                            stroke="#065F46"
                            strokeWidth="1.5"
                          />
                          <polygon
                            points="12,18 22,44 5,48"
                            fill="#10B981"
                            stroke="#065F46"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 7. Linkages */}
              <div>
                <button
                  onClick={() => toggleSub("geo_linkages")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "geo_linkages"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Linkages</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "geo_linkages" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "geo_linkages" && (
                  <div className="p-3 bg-[#141520]">
                    <ShapeTileItem
                      type="linkage"
                      title="4-Bar Linkage"
                      presetProps={{ linkageType: "four-bar", angle: 45 }}
                      shapeRender={
                        <svg viewBox="0 0 100 60" className="w-28 h-16 mx-auto">
                          <line
                            x1="15"
                            y1="50"
                            x2="85"
                            y2="50"
                            stroke="#64748B"
                            strokeWidth="2"
                          />
                          <line
                            x1="20"
                            y1="50"
                            x2="40"
                            y2="20"
                            stroke="#F97316"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <line
                            x1="40"
                            y1="20"
                            x2="70"
                            y2="15"
                            stroke="#3B82F6"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <line
                            x1="80"
                            y1="50"
                            x2="70"
                            y2="15"
                            stroke="#10B981"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <circle
                            cx="20"
                            cy="50"
                            r="3"
                            fill="#FFF"
                            stroke="#000"
                          />
                          <circle
                            cx="80"
                            cy="50"
                            r="3"
                            fill="#FFF"
                            stroke="#000"
                          />
                          <circle
                            cx="40"
                            cy="20"
                            r="3"
                            fill="#F97316"
                            stroke="#FFF"
                          />
                          <circle
                            cx="70"
                            cy="15"
                            r="3"
                            fill="#3B82F6"
                            stroke="#FFF"
                          />
                        </svg>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 8. Utensils */}
              <div>
                <button
                  onClick={() => toggleSub("geo_utensils")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "geo_utensils"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Utensils</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "geo_utensils" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "geo_utensils" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-3 gap-2">
                    <ShapeTileItem
                      type="utensil"
                      title="180° Protractor"
                      presetProps={{ utensilType: "protractor" }}
                      shapeRender={
                        <svg viewBox="0 0 60 40" className="w-12 h-8">
                          <path
                            d="M 5,35 A 25,25 0 0,1 55,35 Z"
                            fill="rgba(56, 189, 248, 0.4)"
                            stroke="#0284C7"
                            strokeWidth="1.5"
                          />
                          <line
                            x1="5"
                            y1="35"
                            x2="55"
                            y2="35"
                            stroke="#0284C7"
                            strokeWidth="1.5"
                          />
                          <line
                            x1="30"
                            y1="35"
                            x2="30"
                            y2="10"
                            stroke="#0284C7"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="utensil"
                      title="Drafting Compass"
                      presetProps={{ utensilType: "compass" }}
                      shapeRender={
                        <svg viewBox="0 0 50 60" className="w-10 h-12">
                          <circle cx="25" cy="8" r="4" fill="#64748B" />
                          <line
                            x1="25"
                            y1="8"
                            x2="10"
                            y2="52"
                            stroke="#94A3B8"
                            strokeWidth="3"
                          />
                          <line
                            x1="25"
                            y1="8"
                            x2="40"
                            y2="45"
                            stroke="#94A3B8"
                            strokeWidth="3"
                          />
                          <rect
                            x="38"
                            y="42"
                            width="5"
                            height="15"
                            fill="#F59E0B"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="utensil"
                      title="Precision Ruler"
                      presetProps={{ utensilType: "ruler" }}
                      shapeRender={
                        <div className="w-full h-8 bg-amber-200 border-2 border-amber-500 rounded flex items-center justify-between px-1 text-[7px] font-mono text-amber-900 font-bold">
                          <span>0</span>
                          <span>|</span>
                          <span>5</span>
                          <span>|</span>
                          <span>10</span>
                        </div>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 9. Patterns and Art */}
              <div>
                <button
                  onClick={() => toggleSub("geo_patterns_art")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "geo_patterns_art"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Patterns and Art</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "geo_patterns_art" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "geo_patterns_art" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-3 gap-2">
                    <ShapeTileItem
                      type="pattern-art"
                      title="Mandala Star Art"
                      presetProps={{ artType: "mandala-star" }}
                      shapeRender={
                        <svg viewBox="0 0 50 50" className="w-10 h-10">
                          <circle
                            cx="25"
                            cy="25"
                            r="22"
                            fill="#181926"
                            stroke="#8B5CF6"
                            strokeWidth="1.5"
                          />
                          <polygon
                            points="25,5 30,20 45,25 30,30 25,45 20,30 5,25 20,20"
                            fill="#EC4899"
                            opacity="0.8"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="pattern-art"
                      title="Islamic Rosette"
                      presetProps={{ artType: "islamic-rosette" }}
                      shapeRender={
                        <svg viewBox="0 0 50 50" className="w-10 h-10">
                          <rect
                            x="10"
                            y="10"
                            width="30"
                            height="30"
                            fill="none"
                            stroke="#06B6D4"
                            strokeWidth="1.5"
                          />
                          <rect
                            x="10"
                            y="10"
                            width="30"
                            height="30"
                            transform="rotate(45 25 25)"
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="1.5"
                          />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="pattern-art"
                      title="Sierpinski Fractal"
                      presetProps={{ artType: "fractal-sierpinski" }}
                      shapeRender={
                        <svg viewBox="0 0 50 50" className="w-10 h-10">
                          <polygon points="25,5 45,45 5,45" fill="#3B82F6" />
                          <polygon points="25,45 35,25 15,25" fill="#FFFFFF" />
                        </svg>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CATEGORY 2: NUMBERS */}
        {/* Sub-sections:
            1. Number Tiles and Cubes
            2. Number Bars
            3. Number Frames
            4. Number Cards
            5. Number Line
            6. Prime Factor Circles
            7. Dot Arrangements
            8. Number Grids
            9. Additional Tools
        */}
        {/* ========================================================================= */}
        <div className="rounded-xl overflow-hidden">
          <button
            onClick={() => toggleCategory("numbers", "num_tiles_cubes")}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 transition-all text-left group cursor-pointer",
              activeCategory === "numbers"
                ? "bg-[#2A2B3D] shadow-xs"
                : "hover:bg-[#252636]",
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                1²³
              </div>
              <span className="font-bold text-sm tracking-tight text-orange-500">
                Numbers
              </span>
            </div>
            <div className="text-slate-400 group-hover:text-slate-200">
              {activeCategory === "numbers" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </button>

          {activeCategory === "numbers" && (
            <div className="bg-[#181924] border-t border-[#2C2D3E]/60 divide-y divide-[#2C2D3E]/40">
              {/* 1. Number Tiles and Cubes */}
              <div>
                <button
                  onClick={() => toggleSub("num_tiles_cubes")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "num_tiles_cubes"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Number Tiles and Cubes</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "num_tiles_cubes" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "num_tiles_cubes" && (
                  <div className="p-3 bg-[#141520] space-y-3">
                    {/* Thousand Cube Hero */}
                    <div className="p-2 bg-slate-900/80 rounded-xl border border-purple-500/30">
                      <span className="text-[10px] font-bold text-purple-300 block mb-1">
                        3D Thousand Cube (1000)
                      </span>
                      <ShapeTileItem
                        type="base10-cube"
                        title="3D Thousand Cube (1000)"
                        presetProps={{ blockType: "thousand-cube", size: 140 }}
                        shapeRender={
                          <svg
                            viewBox="0 0 100 100"
                            className="w-20 h-20 mx-auto"
                          >
                            <polygon
                              points="50,10 85,30 50,50 15,30"
                              fill="#8B5CF6"
                              stroke="#1E1E28"
                              strokeWidth="2"
                            />
                            <polygon
                              points="15,30 50,50 50,90 15,70"
                              fill="#6D28D9"
                              stroke="#1E1E28"
                              strokeWidth="2"
                            />
                            <polygon
                              points="50,50 85,30 85,70 50,90"
                              fill="#5B21B6"
                              stroke="#1E1E28"
                              strokeWidth="2"
                            />
                          </svg>
                        }
                      />
                    </div>

                    {/* Unit Cube, 10-Rod, 100-Flat */}
                    <div className="flex items-end justify-between gap-2 p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                      <ShapeTileItem
                        type="base10-cube"
                        title="Unit Cube (1)"
                        widthClass="w-10"
                        presetProps={{ blockType: "unit-cube", size: 44 }}
                        shapeRender={
                          <svg viewBox="0 0 30 30" className="w-6 h-6">
                            <polygon
                              points="15,4 26,10 15,16 4,10"
                              fill="#FDBA74"
                              stroke="#9A3412"
                              strokeWidth="1"
                            />
                            <polygon
                              points="4,10 15,16 15,26 4,20"
                              fill="#FB923C"
                              stroke="#9A3412"
                              strokeWidth="1"
                            />
                            <polygon
                              points="15,16 26,10 26,20 15,26"
                              fill="#EA580C"
                              stroke="#9A3412"
                              strokeWidth="1"
                            />
                          </svg>
                        }
                      />
                      <ShapeTileItem
                        type="base10-cube"
                        title="Ten Rod (10)"
                        widthClass="w-24"
                        presetProps={{
                          blockType: "ten-rod",
                          width: 120,
                          height: 40,
                        }}
                        shapeRender={
                          <div className="w-20 h-5 bg-blue-600 border border-blue-400 rounded-xs flex divide-x divide-white/40 shadow-xs">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <div key={i} className="flex-1" />
                            ))}
                          </div>
                        }
                      />
                      <ShapeTileItem
                        type="base10-cube"
                        title="Hundred Flat (100)"
                        widthClass="w-16"
                        presetProps={{ blockType: "hundred-flat", size: 110 }}
                        shapeRender={
                          <div className="w-12 h-12 bg-green-600 border border-green-400 rounded-xs grid grid-cols-4 grid-rows-4 gap-px p-0.5 shadow-xs">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div
                                key={i}
                                className="bg-green-500 rounded-xs"
                              />
                            ))}
                          </div>
                        }
                      />
                    </div>

                    {/* Connecting Cubes */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">
                        3D Connecting Cubes
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        <ShapeTileItem
                          type="base10-cube"
                          title="Orange Cube"
                          presetProps={{
                            blockType: "connecting-cube",
                            color: "#EA580C",
                            size: 60,
                          }}
                          shapeRender={
                            <svg viewBox="0 0 40 40" className="w-8 h-8">
                              <polygon
                                points="20,4 36,12 20,20 4,12"
                                fill="#FB923C"
                                stroke="#C2410C"
                                strokeWidth="1.5"
                              />
                              <polygon
                                points="4,12 20,20 20,36 4,28"
                                fill="#EA580C"
                                stroke="#C2410C"
                                strokeWidth="1.5"
                              />
                              <polygon
                                points="20,20 36,12 36,28 20,36"
                                fill="#C2410C"
                                stroke="#C2410C"
                                strokeWidth="1.5"
                              />
                            </svg>
                          }
                        />
                        <ShapeTileItem
                          type="base10-cube"
                          title="Blue Cube"
                          presetProps={{
                            blockType: "connecting-cube",
                            color: "#2563EB",
                            size: 60,
                          }}
                          shapeRender={
                            <svg viewBox="0 0 40 40" className="w-8 h-8">
                              <polygon
                                points="20,4 36,12 20,20 4,12"
                                fill="#60A5FA"
                                stroke="#1D4ED8"
                                strokeWidth="1.5"
                              />
                              <polygon
                                points="4,12 20,20 20,36 4,28"
                                fill="#2563EB"
                                stroke="#1D4ED8"
                                strokeWidth="1.5"
                              />
                              <polygon
                                points="20,20 36,12 36,28 20,36"
                                fill="#1D4ED8"
                                stroke="#1D4ED8"
                                strokeWidth="1.5"
                              />
                            </svg>
                          }
                        />
                        <ShapeTileItem
                          type="base10-cube"
                          title="Green Cube"
                          presetProps={{
                            blockType: "connecting-cube",
                            color: "#16A34A",
                            size: 60,
                          }}
                          shapeRender={
                            <svg viewBox="0 0 40 40" className="w-8 h-8">
                              <polygon
                                points="20,4 36,12 20,20 4,12"
                                fill="#4ADE80"
                                stroke="#15803D"
                                strokeWidth="1.5"
                              />
                              <polygon
                                points="4,12 20,20 20,36 4,28"
                                fill="#16A34A"
                                stroke="#15803D"
                                strokeWidth="1.5"
                              />
                              <polygon
                                points="20,20 36,12 36,28 20,36"
                                fill="#15803D"
                                stroke="#15803D"
                                strokeWidth="1.5"
                              />
                            </svg>
                          }
                        />
                        <ShapeTileItem
                          type="base10-cube"
                          title="Purple Cube"
                          presetProps={{
                            blockType: "connecting-cube",
                            color: "#8B5CF6",
                            size: 60,
                          }}
                          shapeRender={
                            <svg viewBox="0 0 40 40" className="w-8 h-8">
                              <polygon
                                points="20,4 36,12 20,20 4,12"
                                fill="#C4B5FD"
                                stroke="#6D28D9"
                                strokeWidth="1.5"
                              />
                              <polygon
                                points="4,12 20,20 20,36 4,28"
                                fill="#8B5CF6"
                                stroke="#6D28D9"
                                strokeWidth="1.5"
                              />
                              <polygon
                                points="20,20 36,12 36,28 20,36"
                                fill="#6D28D9"
                                stroke="#6D28D9"
                                strokeWidth="1.5"
                              />
                            </svg>
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Number Bars */}
              <div>
                <button
                  onClick={() => toggleSub("num_bars")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "num_bars"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Number Bars</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "num_bars" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "num_bars" && (
                  <div className="p-3 bg-[#141520] space-y-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                      <ShapeTileItem
                        key={`rod_visual_${v}`}
                        type="number-bar"
                        title={`Rod ${v}`}
                        presetProps={{ value: v, unitWidth: 28 }}
                        shapeRender={
                          <div
                            className="h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-md border border-white/20"
                            style={{
                              width: `${Math.min(100, v * 10)}%`,
                              backgroundColor:
                                v === 1
                                  ? "#94A3B8"
                                  : v === 2
                                    ? "#EF4444"
                                    : v === 3
                                      ? "#22C55E"
                                      : v === 4
                                        ? "#A855F7"
                                        : v === 5
                                          ? "#EAB308"
                                          : v === 6
                                            ? "#15803D"
                                            : v === 7
                                              ? "#334155"
                                              : v === 8
                                                ? "#854D0E"
                                                : v === 9
                                                  ? "#3B82F6"
                                                  : "#F97316",
                            }}
                          >
                            {v}
                          </div>
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Number Frames */}
              <div>
                <button
                  onClick={() => toggleSub("num_frames")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "num_frames"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Number Frames</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "num_frames" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "num_frames" && (
                  <div className="p-3 bg-[#141520] space-y-2">
                    <ShapeTileItem
                      type="ten-frame"
                      title="Ten-Frame (3 Dots)"
                      presetProps={{ count: 3 }}
                      shapeRender={
                        <div className="w-36 h-12 bg-white border-2 border-slate-900 rounded grid grid-cols-5 grid-rows-2 p-1 gap-1">
                          <div className="w-3.5 h-3.5 rounded-full bg-red-600 mx-auto" />
                          <div className="w-3.5 h-3.5 rounded-full bg-red-600 mx-auto" />
                          <div className="w-3.5 h-3.5 rounded-full bg-red-600 mx-auto" />
                        </div>
                      }
                    />
                    <ShapeTileItem
                      type="ten-frame"
                      title="Ten-Frame (5 Dots)"
                      presetProps={{ count: 5 }}
                      shapeRender={
                        <div className="w-36 h-12 bg-white border-2 border-slate-900 rounded grid grid-cols-5 grid-rows-2 p-1 gap-1">
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-600 mx-auto" />
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-600 mx-auto" />
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-600 mx-auto" />
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-600 mx-auto" />
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-600 mx-auto" />
                        </div>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 4. Number Cards */}
              <div>
                <button
                  onClick={() => toggleSub("num_cards")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "num_cards"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Number Cards</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "num_cards" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "num_cards" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                      <ShapeTileItem
                        key={`nc_${num}`}
                        type="number-card"
                        title={`Number Card ${num}`}
                        presetProps={{ value: num, variant: "digit" }}
                        shapeRender={
                          <div className="w-8 h-10 rounded-md bg-white border border-slate-700 flex items-center justify-center font-bold text-base text-slate-900 shadow-xs">
                            {num}
                          </div>
                        }
                      />
                    ))}
                    {["+", "-", "×", "÷", "="].map((op) => (
                      <ShapeTileItem
                        key={`nc_op_${op}`}
                        type="number-card"
                        title={`Operator ${op}`}
                        presetProps={{ value: op, variant: "operator" }}
                        shapeRender={
                          <div className="w-8 h-10 rounded-md bg-indigo-600 border border-indigo-700 flex items-center justify-center font-bold text-base text-white shadow-xs">
                            {op}
                          </div>
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Number Line */}
              <div>
                <button
                  onClick={() => toggleSub("num_line")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "num_line"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Number Line</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "num_line" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "num_line" && (
                  <div className="p-3 bg-[#141520] space-y-2">
                    <ShapeTileItem
                      type="number-line"
                      title="Number Line 0–10"
                      presetProps={{ min: 0, max: 10, step: 1 }}
                      shapeRender={
                        <div className="w-full h-8 bg-white border border-slate-700 rounded flex items-center justify-between px-2 text-[8px] font-mono text-slate-900 font-bold">
                          <span>0</span>
                          <span>2</span>
                          <span>4</span>
                          <span>6</span>
                          <span>8</span>
                          <span>10</span>
                        </div>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 6. Prime Factor Circles */}
              <div>
                <button
                  onClick={() => toggleSub("num_primes")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "num_primes"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Prime Factor Circles</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "num_primes" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "num_primes" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-3 gap-2">
                    {[12, 18, 30].map((v) => (
                      <ShapeTileItem
                        key={`pr_c_${v}`}
                        type="prime-circles"
                        title={`Prime Circle ${v}`}
                        presetProps={{ value: v }}
                        shapeRender={
                          <div className="w-12 h-12 rounded-full border-2 border-slate-400 bg-slate-900 flex items-center justify-center text-xs font-bold text-white relative shadow-md">
                            <span>{v}</span>
                            <div className="w-2 h-2 rounded-full bg-red-500 absolute -top-1 left-1" />
                            <div className="w-2 h-2 rounded-full bg-blue-500 absolute -top-1 right-1" />
                            <div className="w-2 h-2 rounded-full bg-green-500 absolute -bottom-1 left-4" />
                          </div>
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 7. Dot Arrangements */}
              <div>
                <button
                  onClick={() => toggleSub("num_dots")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "num_dots"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Dot Arrangements</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "num_dots" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "num_dots" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-3 gap-2">
                    <ShapeTileItem
                      type="dot-arrangement"
                      title="3x4 Dot Array (12)"
                      presetProps={{ pattern: "array", rows: 3, cols: 4 }}
                      shapeRender={
                        <div className="w-12 h-10 bg-white rounded border border-slate-600 p-1 grid grid-cols-4 grid-rows-3 gap-0.5 shadow-xs">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-blue-600 mx-auto"
                            />
                          ))}
                        </div>
                      }
                    />
                    <ShapeTileItem
                      type="dot-arrangement"
                      title="Triangular Dots (10)"
                      presetProps={{ pattern: "triangular" }}
                      shapeRender={
                        <div className="w-12 h-10 bg-white rounded border border-slate-600 p-1 flex flex-col items-center justify-around shadow-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                          </div>
                        </div>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 8. Number Grids */}
              <div>
                <button
                  onClick={() => toggleSub("num_grids")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "num_grids"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Number Grids</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "num_grids" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "num_grids" && (
                  <div className="p-3 bg-[#141520]">
                    <ShapeTileItem
                      type="number-grid"
                      title="1–100 Number Chart"
                      presetProps={{ maxNumber: 100 }}
                      shapeRender={
                        <div className="w-28 h-18 bg-white border-2 border-slate-700 rounded p-1 mx-auto grid grid-cols-5 grid-rows-3 gap-0.5 text-[6px] font-bold text-slate-900 text-center">
                          <div className="bg-yellow-200">1</div>
                          <div>2</div>
                          <div className="bg-yellow-200">3</div>
                          <div>4</div>
                          <div className="bg-yellow-200">5</div>
                          <div>10</div>
                          <div>50</div>
                          <div className="bg-yellow-300">100</div>
                        </div>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 9. Additional Tools */}
              <div>
                <button
                  onClick={() => toggleSub("num_additional")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "num_additional"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Additional Tools</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "num_additional" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "num_additional" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-2 gap-2">
                    <ShapeTileItem
                      type="number-card"
                      title="Random Generator ?"
                      presetProps={{ value: "?", variant: "digit" }}
                      shapeRender={
                        <div className="w-10 h-10 rounded-lg bg-green-600 border-2 border-dashed border-white/60 flex items-center justify-center font-bold text-lg text-white shadow-md">
                          ?
                        </div>
                      }
                    />
                    <ShapeTileItem
                      type="number-card"
                      title="Pi Constant π"
                      presetProps={{ value: "π", variant: "digit" }}
                      shapeRender={
                        <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                          π
                        </div>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CATEGORY 3: FRACTIONS */}
        {/* ========================================================================= */}
        <div className="rounded-xl overflow-hidden">
          <button
            onClick={() => toggleCategory("fractions", "frac_bars")}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 transition-all text-left group cursor-pointer",
              activeCategory === "fractions"
                ? "bg-[#2A2B3D] shadow-xs"
                : "hover:bg-[#252636]",
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ½
              </div>
              <span className="font-bold text-sm tracking-tight text-amber-500">
                Fractions
              </span>
            </div>
            <div className="text-slate-400 group-hover:text-slate-200">
              {activeCategory === "fractions" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </button>

          {activeCategory === "fractions" && (
            <div className="bg-[#181924] border-t border-[#2C2D3E]/60 divide-y divide-[#2C2D3E]/40">
              {/* Fraction Bars */}
              <div>
                <button
                  onClick={() => toggleSub("frac_bars")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "frac_bars"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Fraction Bars</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "frac_bars" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "frac_bars" && (
                  <div className="p-3 bg-[#141520] space-y-2">
                    {[1, 2, 3, 4, 5, 6, 8, 12].map((den) => (
                      <ShapeTileItem
                        key={`fbar_strip_${den}`}
                        type="fraction-bar"
                        title={`1/${den} Fraction Bar`}
                        presetProps={{
                          denominator: den,
                          count: 1,
                          mode: "fraction",
                          color: FRACTION_COLORS[den] || "#0284C7",
                        }}
                        shapeRender={
                          <div className="w-full h-7 rounded border-2 border-slate-900 flex overflow-hidden shadow-md bg-white">
                            <div
                              className="h-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                              style={{
                                width: `${(1 / den) * 100}%`,
                                backgroundColor:
                                  FRACTION_COLORS[den] || "#0284C7",
                              }}
                            >
                              1/{den}
                            </div>
                            <div className="flex-1 bg-white" />
                          </div>
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Fraction Circles */}
              <div>
                <button
                  onClick={() => toggleSub("frac_circles")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "frac_circles"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Fraction Circles</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "frac_circles" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "frac_circles" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-3 gap-2">
                    {[2, 3, 4, 6, 8, 12].map((den) => (
                      <ShapeTileItem
                        key={`fcirc_pie_${den}`}
                        type="fraction-circle"
                        title={`1/${den} Fraction Circle`}
                        presetProps={{
                          denominator: den,
                          count: 1,
                          mode: "fraction",
                          radius: 64,
                          color: FRACTION_COLORS[den] || "#0284C7",
                        }}
                        shapeRender={
                          <div
                            className="w-12 h-12 rounded-full border-2 border-slate-900 shadow-md flex items-center justify-center"
                            style={{
                              background: `conic-gradient(${FRACTION_COLORS[den] || "#0284C7"} 0deg ${360 / den}deg, #FFFFFF ${360 / den}deg 360deg)`,
                            }}
                          >
                            <div className="w-4 h-4 rounded-full bg-slate-900 text-[8px] font-bold text-white flex items-center justify-center shadow-xs">
                              {den}
                            </div>
                          </div>
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CATEGORY 4: ALGEBRA */}
        {/* Sub-sections:
            1. Algebra Tiles
            2. Balance Scale
            3. Function Machines
            4. Coordinate Axes and Tables
            5. Variable Sliders
        */}
        {/* ========================================================================= */}
        <div className="rounded-xl overflow-hidden">
          <button
            onClick={() => toggleCategory("algebra", "alg_tiles")}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 transition-all text-left group cursor-pointer",
              activeCategory === "algebra"
                ? "bg-[#2A2B3D] shadow-xs"
                : "hover:bg-[#252636]",
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                x²
              </div>
              <span className="font-bold text-sm tracking-tight text-emerald-500">
                Algebra
              </span>
            </div>
            <div className="text-slate-400 group-hover:text-slate-200">
              {activeCategory === "algebra" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </button>

          {activeCategory === "algebra" && (
            <div className="bg-[#181924] border-t border-[#2C2D3E]/60 divide-y divide-[#2C2D3E]/40">
              {/* 1. Algebra Tiles */}
              <div>
                <button
                  onClick={() => toggleSub("alg_tiles")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "alg_tiles"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Algebra Tiles</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "alg_tiles" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "alg_tiles" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-4 gap-2">
                    <ShapeTileItem
                      type="algebra-tile"
                      title="+1 Unit"
                      presetProps={{ variant: "1" }}
                      shapeRender={
                        <div className="w-7 h-7 rounded bg-amber-500 text-white font-bold text-xs flex items-center justify-center border border-amber-600 shadow-xs">
                          1
                        </div>
                      }
                    />
                    <ShapeTileItem
                      type="algebra-tile"
                      title="-1 Unit"
                      presetProps={{ variant: "-1" }}
                      shapeRender={
                        <div className="w-7 h-7 rounded bg-red-500 text-white font-bold text-xs flex items-center justify-center border border-red-600 shadow-xs">
                          -1
                        </div>
                      }
                    />
                    <ShapeTileItem
                      type="algebra-tile"
                      title="+x Tile"
                      presetProps={{ variant: "x" }}
                      shapeRender={
                        <div className="w-7 h-14 rounded bg-blue-500 text-white font-bold text-xs flex items-center justify-center border border-blue-600 shadow-xs">
                          x
                        </div>
                      }
                    />
                    <ShapeTileItem
                      type="algebra-tile"
                      title="+x² Tile"
                      presetProps={{ variant: "x2" }}
                      shapeRender={
                        <div className="w-12 h-12 rounded bg-emerald-500 text-white font-bold text-xs flex items-center justify-center border border-emerald-600 shadow-xs">
                          x²
                        </div>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 2. Balance Scale */}
              <div>
                <button
                  onClick={() => toggleSub("alg_scale")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "alg_scale"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Balance Scale</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "alg_scale" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "alg_scale" && (
                  <div className="p-3 bg-[#141520]">
                    <ShapeTileItem
                      type="balance-scale"
                      title="Equation Balance Scale"
                      presetProps={{ leftWeight: 5, rightWeight: 5 }}
                      shapeRender={
                        <svg viewBox="0 0 120 70" className="w-32 h-18 mx-auto">
                          <line
                            x1="20"
                            y1="25"
                            x2="100"
                            y2="25"
                            stroke="#FFFFFF"
                            strokeWidth="3"
                          />
                          <polygon points="60,25 50,60 70,60" fill="#64748B" />
                          <rect
                            x="10"
                            y="38"
                            width="22"
                            height="6"
                            rx="2"
                            fill="#3B82F6"
                          />
                          <line
                            x1="21"
                            y1="25"
                            x2="21"
                            y2="38"
                            stroke="#94A3B8"
                            strokeWidth="1"
                          />
                          <rect
                            x="88"
                            y="38"
                            width="22"
                            height="6"
                            rx="2"
                            fill="#8B5CF6"
                          />
                          <line
                            x1="99"
                            y1="25"
                            x2="99"
                            y2="38"
                            stroke="#94A3B8"
                            strokeWidth="1"
                          />
                        </svg>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 3. Function Machines */}
              <div>
                <button
                  onClick={() => toggleSub("alg_func")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "alg_func"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Function Machines</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "alg_func" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "alg_func" && (
                  <div className="p-3 bg-[#141520]">
                    <ShapeTileItem
                      type="function-machine"
                      title="Function Machine"
                      presetProps={{ inputVal: 4, rule: "× 3 + 2" }}
                      shapeRender={
                        <div className="w-36 h-18 bg-indigo-700 rounded-lg border-2 border-slate-900 flex items-center justify-between px-2 text-white font-bold text-xs shadow-md">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px]">
                            4
                          </div>
                          <div className="bg-indigo-950 px-2 py-1 rounded text-[10px] text-yellow-300">
                            f(x): × 3 + 2
                          </div>
                          <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px]">
                            14
                          </div>
                        </div>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 4. Coordinate Axes and Tables */}
              <div>
                <button
                  onClick={() => toggleSub("alg_axes")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "alg_axes"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Coordinate Axes and Tables</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "alg_axes" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "alg_axes" && (
                  <div className="p-3 bg-[#141520]">
                    <ShapeTileItem
                      type="coordinate-axes"
                      title="Cartesian (x, y) Grid & Table"
                      presetProps={{ showTable: true, showLine: true }}
                      shapeRender={
                        <div className="w-36 h-20 bg-white border-2 border-slate-900 rounded p-1 flex items-center justify-between shadow-md">
                          <div className="w-16 h-16 border border-slate-400 relative">
                            <div className="absolute top-1/2 w-full h-px bg-slate-900" />
                            <div className="absolute left-1/2 h-full w-px bg-slate-900" />
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute top-2 right-2" />
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600 absolute bottom-3 left-3" />
                          </div>
                          <div className="w-14 h-16 bg-slate-100 rounded text-[7px] text-slate-800 p-1 flex flex-col justify-between font-bold">
                            <div className="border-b border-slate-300">
                              x | y
                            </div>
                            <div>0 | 1</div>
                            <div>2 | 3</div>
                          </div>
                        </div>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 5. Variable Sliders */}
              <div>
                <button
                  onClick={() => toggleSub("alg_sliders")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "alg_sliders"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Variable Sliders</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "alg_sliders" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "alg_sliders" && (
                  <div className="p-3 bg-[#141520] space-y-2">
                    {["a", "b", "x"].map((vName) => (
                      <ShapeTileItem
                        key={`vsl_${vName}`}
                        type="variable-slider"
                        title={`Variable Slider ${vName}`}
                        presetProps={{
                          variableName: vName,
                          value: 5,
                          min: 0,
                          max: 10,
                          step: 1,
                        }}
                        shapeRender={
                          <div className="w-full h-10 bg-white rounded border border-slate-700 p-1.5 flex items-center gap-2 shadow-xs">
                            <div className="w-6 h-6 rounded bg-purple-600 text-white font-bold text-xs flex items-center justify-center font-serif">
                              {vName}
                            </div>
                            <div className="flex-1 h-2 bg-slate-200 rounded-full relative">
                              <div className="w-1/2 h-full bg-purple-600 rounded-full" />
                              <div className="w-3 h-3 rounded-full bg-white border-2 border-purple-600 absolute top-1/2 -translate-y-1/2 left-1/2" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-800">
                              5
                            </span>
                          </div>
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CATEGORY 5: PROBABILITY AND DATA */}
        {/* Sub-sections:
            1. Coins, Dice and Spinners
            2. Charts and Statistics
            3. Playing Cards
            4. Polyhedral Dice
            5. Non-transitive Dice
        */}
        {/* ========================================================================= */}
        <div className="rounded-xl overflow-hidden">
          <button
            onClick={() => toggleCategory("probability", "prob_coins_dice")}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 transition-all text-left group cursor-pointer",
              activeCategory === "probability"
                ? "bg-[#2A2B3D] shadow-xs"
                : "hover:bg-[#252636]",
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                🎲
              </div>
              <span className="font-bold text-sm tracking-tight text-teal-400">
                Probability and Data
              </span>
            </div>
            <div className="text-slate-400 group-hover:text-slate-200">
              {activeCategory === "probability" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </button>

          {activeCategory === "probability" && (
            <div className="bg-[#181924] border-t border-[#2C2D3E]/60 divide-y divide-[#2C2D3E]/40">
              {/* 1. Coins, Dice and Spinners */}
              <div>
                <button
                  onClick={() => toggleSub("prob_coins_dice")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "prob_coins_dice"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Coins, Dice and Spinners</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "prob_coins_dice" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "prob_coins_dice" && (
                  <div className="p-3 bg-[#141520] space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <ShapeTileItem
                        type="dice"
                        title="6-Sided Die"
                        presetProps={{ sides: 6, value: 5 }}
                        shapeRender={
                          <div className="w-10 h-10 rounded-xl bg-red-600 p-1.5 border border-red-700 shadow-md grid grid-cols-3 grid-rows-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            <div />
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            <div />
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            <div />
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            <div />
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                        }
                      />
                      <ShapeTileItem
                        type="coin"
                        title="Gold Coin"
                        presetProps={{ side: "heads" }}
                        shapeRender={
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-amber-600 flex items-center justify-center font-black text-sm text-amber-900 shadow-md">
                            H
                          </div>
                        }
                      />
                      <ShapeTileItem
                        type="spinner"
                        title="Uniform Rainbow Spinner"
                        presetProps={{ sectors: 4 }}
                        shapeRender={
                          <div
                            className="w-10 h-10 rounded-full border-2 border-white/30 relative overflow-hidden shadow-md flex items-center justify-center"
                            style={{
                              background:
                                "conic-gradient(#EF4444 0deg 90deg, #3B82F6 90deg 180deg, #10B981 180deg 270deg, #F59E0B 270deg 360deg)",
                            }}
                          >
                            <div className="w-2 h-2 rounded-full bg-slate-900 border border-white" />
                          </div>
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Charts and Statistics */}
              <div>
                <button
                  onClick={() => toggleSub("prob_charts")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "prob_charts"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Charts and Statistics</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "prob_charts" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "prob_charts" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-2 gap-2">
                    <ShapeTileItem
                      type="chart"
                      title="Interactive Bar Chart"
                      presetProps={{ variant: "bar-chart", title: "Bar Chart" }}
                      shapeRender={
                        <div className="w-full h-16 bg-white rounded border border-slate-700 p-1 flex items-end justify-around">
                          <div className="w-2.5 bg-blue-500 rounded-t h-8" />
                          <div className="w-2.5 bg-green-500 rounded-t h-12" />
                          <div className="w-2.5 bg-amber-500 rounded-t h-5" />
                          <div className="w-2.5 bg-pink-500 rounded-t h-10" />
                        </div>
                      }
                    />
                    <ShapeTileItem
                      type="chart"
                      title="Line Plot / Frequency Graph"
                      presetProps={{
                        variant: "line-chart",
                        title: "Line Plot",
                      }}
                      shapeRender={
                        <svg
                          viewBox="0 0 80 50"
                          className="w-full h-16 bg-white rounded border border-slate-700 p-1"
                        >
                          <polyline
                            points="10,40 30,20 50,30 70,10"
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="2.5"
                          />
                          <circle cx="10" cy="40" r="3" fill="#4F46E5" />
                          <circle cx="30" cy="20" r="3" fill="#4F46E5" />
                          <circle cx="50" cy="30" r="3" fill="#4F46E5" />
                          <circle cx="70" cy="10" r="3" fill="#4F46E5" />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="chart"
                      title="Frequency & Tally Table"
                      presetProps={{
                        variant: "frequency-table",
                        title: "Tally Table",
                      }}
                      shapeRender={
                        <div className="w-full h-16 bg-white rounded border border-slate-700 p-1 flex flex-col justify-between text-[7px] text-slate-800 font-bold">
                          <div className="bg-slate-200 px-1 py-0.5 rounded flex justify-between">
                            <span>Item</span>
                            <span>Tally</span>
                          </div>
                          <div className="flex justify-between px-1">
                            <span>A</span>
                            <span className="font-mono text-blue-600">
                              ||||/
                            </span>
                          </div>
                        </div>
                      }
                    />
                    <ShapeTileItem
                      type="chart"
                      title="Box & Whisker Plot"
                      presetProps={{ variant: "box-plot", title: "Box Plot" }}
                      shapeRender={
                        <svg
                          viewBox="0 0 80 50"
                          className="w-full h-16 bg-white rounded border border-slate-700 p-1"
                        >
                          <line
                            x1="10"
                            y1="25"
                            x2="70"
                            y2="25"
                            stroke="#1E1E28"
                            strokeWidth="1.5"
                          />
                          <rect
                            x="25"
                            y="15"
                            width="30"
                            height="20"
                            fill="#DDD6FE"
                            stroke="#7C3AED"
                            strokeWidth="1.5"
                          />
                          <line
                            x1="40"
                            y1="15"
                            x2="40"
                            y2="35"
                            stroke="#6D28D9"
                            strokeWidth="2"
                          />
                        </svg>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 3. Playing Cards */}
              <div>
                <button
                  onClick={() => toggleSub("prob_cards")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "prob_cards"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Playing Cards</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "prob_cards" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "prob_cards" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-4 gap-2">
                    <ShapeTileItem
                      type="playing-card"
                      title="Ace of Spades"
                      presetProps={{ suit: "♠", rank: "A", isFaceUp: true }}
                      shapeRender={
                        <div className="w-10 h-14 bg-white rounded border border-slate-900 flex flex-col items-center justify-between p-1 text-slate-900 font-bold shadow-md">
                          <div className="text-[9px] self-start leading-none">
                            A♠
                          </div>
                          <div className="text-base leading-none">♠</div>
                          <div className="text-[9px] self-end leading-none">
                            A♠
                          </div>
                        </div>
                      }
                    />
                    <ShapeTileItem
                      type="playing-card"
                      title="King of Hearts"
                      presetProps={{ suit: "♥", rank: "K", isFaceUp: true }}
                      shapeRender={
                        <div className="w-10 h-14 bg-white rounded border border-slate-900 flex flex-col items-center justify-between p-1 text-red-600 font-bold shadow-md">
                          <div className="text-[9px] self-start leading-none">
                            K♥
                          </div>
                          <div className="text-base leading-none">♥</div>
                          <div className="text-[9px] self-end leading-none">
                            K♥
                          </div>
                        </div>
                      }
                    />
                    <ShapeTileItem
                      type="playing-card"
                      title="Queen of Diamonds"
                      presetProps={{ suit: "♦", rank: "Q", isFaceUp: true }}
                      shapeRender={
                        <div className="w-10 h-14 bg-white rounded border border-slate-900 flex flex-col items-center justify-between p-1 text-red-600 font-bold shadow-md">
                          <div className="text-[9px] self-start leading-none">
                            Q♦
                          </div>
                          <div className="text-base leading-none">♦</div>
                          <div className="text-[9px] self-end leading-none">
                            Q♦
                          </div>
                        </div>
                      }
                    />
                    <ShapeTileItem
                      type="playing-card"
                      title="Jack of Clubs"
                      presetProps={{ suit: "♣", rank: "J", isFaceUp: true }}
                      shapeRender={
                        <div className="w-10 h-14 bg-white rounded border border-slate-900 flex flex-col items-center justify-between p-1 text-slate-900 font-bold shadow-md">
                          <div className="text-[9px] self-start leading-none">
                            J♣
                          </div>
                          <div className="text-base leading-none">♣</div>
                          <div className="text-[9px] self-end leading-none">
                            J♣
                          </div>
                        </div>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 4. Polyhedral Dice */}
              <div>
                <button
                  onClick={() => toggleSub("prob_polyhedral")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "prob_polyhedral"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Polyhedral Dice</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "prob_polyhedral" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "prob_polyhedral" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-5 gap-1.5">
                    <ShapeTileItem
                      type="polyhedral-dice"
                      title="D4 Die"
                      presetProps={{
                        diceType: "D4",
                        value: 4,
                        color: "#EF4444",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 40 40" className="w-9 h-9">
                          <polygon
                            points="20,4 36,34 4,34"
                            fill="#EF4444"
                            stroke="#1E1E28"
                            strokeWidth="2"
                          />
                          <text
                            x="20"
                            y="26"
                            textAnchor="middle"
                            fill="#FFF"
                            fontSize="12"
                            fontWeight="bold"
                          >
                            4
                          </text>
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="polyhedral-dice"
                      title="D8 Die"
                      presetProps={{
                        diceType: "D8",
                        value: 8,
                        color: "#3B82F6",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 40 40" className="w-9 h-9">
                          <polygon
                            points="20,4 36,20 20,36 4,20"
                            fill="#3B82F6"
                            stroke="#1E1E28"
                            strokeWidth="2"
                          />
                          <text
                            x="20"
                            y="24"
                            textAnchor="middle"
                            fill="#FFF"
                            fontSize="12"
                            fontWeight="bold"
                          >
                            8
                          </text>
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="polyhedral-dice"
                      title="D10 Die"
                      presetProps={{
                        diceType: "D10",
                        value: 10,
                        color: "#10B981",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 40 40" className="w-9 h-9">
                          <polygon
                            points="20,4 36,15 28,36 12,36 4,15"
                            fill="#10B981"
                            stroke="#1E1E28"
                            strokeWidth="2"
                          />
                          <text
                            x="20"
                            y="25"
                            textAnchor="middle"
                            fill="#FFF"
                            fontSize="11"
                            fontWeight="bold"
                          >
                            10
                          </text>
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="polyhedral-dice"
                      title="D12 Die"
                      presetProps={{
                        diceType: "D12",
                        value: 12,
                        color: "#F59E0B",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 40 40" className="w-9 h-9">
                          <polygon
                            points="20,4 34,14 34,28 20,36 6,28 6,14"
                            fill="#F59E0B"
                            stroke="#1E1E28"
                            strokeWidth="2"
                          />
                          <text
                            x="20"
                            y="24"
                            textAnchor="middle"
                            fill="#FFF"
                            fontSize="11"
                            fontWeight="bold"
                          >
                            12
                          </text>
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="polyhedral-dice"
                      title="D20 Die"
                      presetProps={{
                        diceType: "D20",
                        value: 20,
                        color: "#8B5CF6",
                      }}
                      shapeRender={
                        <svg viewBox="0 0 40 40" className="w-9 h-9">
                          <polygon
                            points="20,4 36,12 36,28 20,36 4,28 4,12"
                            fill="#8B5CF6"
                            stroke="#1E1E28"
                            strokeWidth="2"
                          />
                          <line
                            x1="20"
                            y1="4"
                            x2="20"
                            y2="36"
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth="1"
                          />
                          <text
                            x="20"
                            y="24"
                            textAnchor="middle"
                            fill="#FFF"
                            fontSize="11"
                            fontWeight="bold"
                          >
                            20
                          </text>
                        </svg>
                      }
                    />
                  </div>
                )}
              </div>

              {/* 5. Non-transitive Dice */}
              <div>
                <button
                  onClick={() => toggleSub("prob_nontransitive")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "prob_nontransitive"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Non-transitive Dice</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "prob_nontransitive" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "prob_nontransitive" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-4 gap-2">
                    <ShapeTileItem
                      type="polyhedral-dice"
                      title="Die A [4,4,4,4,0,0]"
                      presetProps={{
                        diceType: "efron-A",
                        value: 4,
                        color: "#2563EB",
                      }}
                      shapeRender={
                        <div className="w-11 h-11 bg-blue-600 rounded-lg border-2 border-slate-900 flex flex-col items-center justify-center text-white font-bold shadow-md">
                          <span className="text-xs">A</span>
                          <span className="text-[8px] opacity-80">(4,0)</span>
                        </div>
                      }
                    />
                    <ShapeTileItem
                      type="polyhedral-dice"
                      title="Die B [3,3,3,3,3,3]"
                      presetProps={{
                        diceType: "efron-B",
                        value: 3,
                        color: "#DC2626",
                      }}
                      shapeRender={
                        <div className="w-11 h-11 bg-red-600 rounded-lg border-2 border-slate-900 flex flex-col items-center justify-center text-white font-bold shadow-md">
                          <span className="text-xs">B</span>
                          <span className="text-[8px] opacity-80">(3)</span>
                        </div>
                      }
                    />
                    <ShapeTileItem
                      type="polyhedral-dice"
                      title="Die C [6,6,2,2,2,2]"
                      presetProps={{
                        diceType: "efron-C",
                        value: 6,
                        color: "#16A34A",
                      }}
                      shapeRender={
                        <div className="w-11 h-11 bg-green-600 rounded-lg border-2 border-slate-900 flex flex-col items-center justify-center text-white font-bold shadow-md">
                          <span className="text-xs">C</span>
                          <span className="text-[8px] opacity-80">(6,2)</span>
                        </div>
                      }
                    />
                    <ShapeTileItem
                      type="polyhedral-dice"
                      title="Die D [5,5,5,1,1,1]"
                      presetProps={{
                        diceType: "efron-D",
                        value: 5,
                        color: "#D97706",
                      }}
                      shapeRender={
                        <div className="w-11 h-11 bg-amber-600 rounded-lg border-2 border-slate-900 flex flex-col items-center justify-center text-white font-bold shadow-md">
                          <span className="text-xs">D</span>
                          <span className="text-[8px] opacity-80">(5,1)</span>
                        </div>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CATEGORY 6: GAMES AND APPLICATIONS */}
        {/* ========================================================================= */}
        <div className="rounded-xl overflow-hidden">
          <button
            onClick={() => toggleCategory("applications", "app_clocks")}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 transition-all text-left group cursor-pointer",
              activeCategory === "applications"
                ? "bg-[#2A2B3D] shadow-xs"
                : "hover:bg-[#252636]",
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                💡
              </div>
              <span className="font-bold text-sm tracking-tight text-blue-400">
                Games and Applications
              </span>
            </div>
            <div className="text-slate-400 group-hover:text-slate-200">
              {activeCategory === "applications" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </button>

          {activeCategory === "applications" && (
            <div className="bg-[#181924] border-t border-[#2C2D3E]/60 divide-y divide-[#2C2D3E]/40">
              {/* Clocks & Chess */}
              <div>
                <button
                  onClick={() => toggleSub("app_clocks")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors text-left cursor-pointer",
                    activeSubSection === "app_clocks"
                      ? "text-white bg-[#252638]"
                      : "text-slate-300 hover:text-white hover:bg-[#202130]",
                  )}
                >
                  <span>Clocks and Chess</span>
                  <span className="text-[10px] text-slate-500">
                    {activeSubSection === "app_clocks" ? "▲" : "▼"}
                  </span>
                </button>

                {activeSubSection === "app_clocks" && (
                  <div className="p-3 bg-[#141520] grid grid-cols-2 gap-2">
                    <ShapeTileItem
                      type="clock"
                      title="Analog Clock"
                      presetProps={{
                        hours: 10,
                        minutes: 10,
                        showDigital: true,
                      }}
                      shapeRender={
                        <svg viewBox="0 0 60 60" className="w-12 h-12">
                          <circle
                            cx="30"
                            cy="30"
                            r="26"
                            fill="#FFFFFF"
                            stroke="#0F172A"
                            strokeWidth="3"
                          />
                          <line
                            x1="30"
                            y1="30"
                            x2="30"
                            y2="12"
                            stroke="#E11D48"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <line
                            x1="30"
                            y1="30"
                            x2="42"
                            y2="30"
                            stroke="#0F172A"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <circle cx="30" cy="30" r="3" fill="#0F172A" />
                        </svg>
                      }
                    />
                    <ShapeTileItem
                      type="number-card"
                      title="Chess Knight"
                      presetProps={{ value: "♞", color: "#1E293B" }}
                      shapeRender={
                        <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                          ♞
                        </div>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer matching Polypad */}
      {/* <div className="p-3 border-t border-[#2C2D3E] bg-[#181923] flex items-center justify-center">
        <Image
          src="/codingjr.webp"
          alt={"Codingjr-image"}
          height={50}
          width={50}
          className="flex items-center justify-center"
        />
      </div> */}
    </aside>
  );
}
