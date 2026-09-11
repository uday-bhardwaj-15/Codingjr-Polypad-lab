'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  PieChart,
  MousePointer,
  Hand,
  Shapes,
  HelpCircle,
  Layers,
  Palette,
  RotateCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

export interface TourStep {
  title: string;
  subtitle: string;
  description: string;
  tip: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  illustration: React.ReactNode;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to PolyLab! 🎉',
    subtitle: 'Your Magical Math & Shape Playground',
    description:
      'PolyLab makes math fun and visual! You can explore fractions, build with colorful geometric shapes, roll dice, spin spinners, and solve equations with balance scales.',
    tip: 'Everything is interactive — click, drag, and discover how shapes connect!',
    icon: Sparkles,
    accentColor: 'from-pink-500 via-purple-500 to-indigo-500',
    illustration: (
      <div className="flex items-center justify-center gap-3 py-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-rose-500/30 animate-bounce">
          ½
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/30 animate-pulse">
          ⬡
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-amber-500/30 animate-bounce">
          🎲
        </div>
      </div>
    ),
  },
  {
    title: '1. The Shapes & Tiles Library 📚',
    subtitle: 'Pick Any Shape on the Left',
    description:
      'On the left sidebar, you have all the math categories: Geometry, Numbers, Fractions, Algebra, Probability, and Games. Click any section to open colorful visual shapes!',
    tip: 'You can DRAG any shape directly onto the canvas, or just CLICK it to add it instantly.',
    icon: Shapes,
    accentColor: 'from-pink-500 to-rose-500',
    illustration: (
      <div className="w-full bg-[#181924] p-3 rounded-xl border border-slate-700/80 flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400 font-bold">
          ⬡
        </div>
        <ArrowRight className="w-5 h-5 text-slate-400 animate-pulse" />
        <div className="w-20 h-8 rounded-md bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
          Drop Here!
        </div>
      </div>
    ),
  },
  {
    title: '2. Move, Rotate & Zoom 🖐',
    subtitle: 'Total Freedom on the Canvas',
    description:
      'Click and drag any shape to move it around. Use your mouse wheel or trackpad to zoom in and out. Hold the Spacebar to pan across the canvas.',
    tip: 'Click on a shape to see the top pin handle — click it to rotate 45° anytime!',
    icon: Hand,
    accentColor: 'from-blue-500 to-cyan-500',
    illustration: (
      <div className="flex items-center justify-center gap-4 py-2">
        <div className="relative p-3 bg-white rounded-xl shadow-md border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-ping" />
          <span>Click & Drag Tile</span>
        </div>
        <div className="p-2 bg-slate-800 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-md">
          <RotateCw className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Rotate 45°</span>
        </div>
      </div>
    ),
  },
  {
    title: '3. Fraction Magic & Shading ✨',
    subtitle: 'Click Segments to Shade & Toggle Modes',
    description:
      'Click on any segment of a Fraction Bar or Fraction Circle to toggle shading. Click the mode button to instantly switch between Fraction (1/2), Percent (50%), Decimal (0.5), or Hide!',
    tip: 'Use the "Split ▶" button in the menu below any tile to split it into smaller pieces!',
    icon: PieChart,
    accentColor: 'from-amber-500 to-orange-500',
    illustration: (
      <div className="w-full flex flex-col items-center gap-2 py-1">
        <div className="w-48 h-8 rounded border-2 border-slate-900 overflow-hidden flex shadow-md">
          <div className="w-1/2 h-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
            ½ Shaded
          </div>
          <div className="w-1/2 h-full bg-white text-slate-700 text-xs font-bold flex items-center justify-center">
            ½ Clear
          </div>
        </div>
        <div className="flex gap-1.5 text-[10px] font-bold text-white bg-slate-900 px-3 py-1 rounded-full shadow-xs">
          <span className="text-amber-400">½ Fraction</span>
          <span>•</span>
          <span className="text-emerald-400">50% Percent</span>
          <span>•</span>
          <span className="text-sky-400">0.5 Decimal</span>
        </div>
      </div>
    ),
  },
  {
    title: '4. Drawing Tools & Automatic Save 🎨',
    subtitle: 'Everything You Need, Always Saved',
    description:
      'Use the bottom toolbar to draw freehand with the pen, write text labels, or use the ruler and eraser. All your work automatically saves directly to your browser!',
    tip: 'Made a mistake? Press Ctrl+Z (or click the Undo arrow at top right) to undo anytime!',
    icon: Palette,
    accentColor: 'from-emerald-500 to-teal-500',
    illustration: (
      <div className="flex items-center justify-center gap-2 py-2">
        <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <Check className="w-3.5 h-3.5" />
          <span>Autosaved Instantly</span>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-bold">
          <span>Undo / Redo (Ctrl+Z)</span>
        </div>
      </div>
    ),
  },
];

export interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InteractiveTour({ isOpen, onClose }: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onClose();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#1E1F2B] border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden select-none">
        {/* Top Gradient Banner */}
        <div className={cn('h-3 w-full bg-gradient-to-r', step.accentColor)} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Tour (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-5">
          {/* Header Icon & Title */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-12 h-12 rounded-2xl bg-gradient-to-tr flex items-center justify-center text-white shadow-lg',
                step.accentColor
              )}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {step.title}
              </h2>
            </div>
          </div>

          {/* Interactive Illustration Box */}
          <div className="w-full rounded-2xl bg-[#151620] border border-slate-800 p-4 flex items-center justify-center overflow-hidden min-h-[90px]">
            {step.illustration}
          </div>

          {/* Subtitle & Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200">
              {step.subtitle}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Kid-Friendly Tip Callout */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-200 text-xs">
            <span className="text-sm">💡</span>
            <span className="leading-snug">{step.tip}</span>
          </div>

          {/* Step Progress Dots & Navigation Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-200',
                    currentStep === i
                      ? 'w-6 bg-blue-500'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  )}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}
              <button
                onClick={handleNext}
                className={cn(
                  'flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all',
                  isLast
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/25 scale-105'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25'
                )}
              >
                <span>{isLast ? "Let's Play & Explore!" : 'Next'}</span>
                {isLast ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
