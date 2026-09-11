import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  LayoutGrid,
  Calculator,
  Brain,
} from 'lucide-react';

export default function RootPage() {
  const canvasUrl = '/labs/polylab/fraction_discovery';

  return (
    <main className="h-screen max-h-screen w-screen overflow-hidden bg-gradient-to-b from-[#F0F7FF] via-[#E8F3FE] to-[#DFEEFD] text-slate-800 flex flex-col justify-between p-4 md:p-6 select-none relative font-sans">
      {/* Background Decorative Dashed Curves & Grid Elements */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M -100 450 Q 200 400 400 480 T 900 430 T 1600 460"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <path
          d="M 100 200 Q 600 120 1100 240 T 1700 180"
          fill="none"
          stroke="#BFDBFE"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        <circle cx="120" cy="180" r="3" fill="#60A5FA" opacity="0.6" />
        <circle cx="1420" cy="120" r="4" fill="#818CF8" opacity="0.5" />
        <circle cx="1380" cy="380" r="3" fill="#34D399" opacity="0.6" />
      </svg>

      {/* Floating Playful Math Elements */}
      {/* 1. Top-Left: "2 + 3 = ?" Pill Card */}
      <div className="absolute top-[22%] left-[6%] md:left-[10%] transform -rotate-12 bg-white/90 backdrop-blur-xs px-4 py-2 rounded-2xl shadow-md border border-blue-100 z-10 hidden sm:flex items-center gap-1.5 animate-bounce-slow">
        <span className="text-sm md:text-base font-bold text-slate-500 font-mono">2 + 3 = ?</span>
      </div>

      {/* 2. Bottom-Left: "1 2 3" Purple Block + Yellow "+" */}
      <div className="absolute bottom-[28%] left-[5%] md:left-[9%] z-10 hidden sm:block">
        <div className="w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-tr from-purple-200 to-indigo-100 border border-purple-300 shadow-md flex items-center justify-center transform -rotate-6">
          <span className="text-base md:text-lg font-black text-purple-600 tracking-wider">1 2 3</span>
        </div>
        <div className="absolute -top-3 -right-8 text-2xl font-black text-amber-400 transform rotate-12 drop-shadow-xs">
          +
        </div>
      </div>

      {/* 3. Top-Right: Green Triangle + "5 - 2 = ?" */}
      <div className="absolute top-[18%] right-[8%] md:right-[12%] z-10 hidden sm:block">
        <svg viewBox="0 0 40 40" className="w-8 h-8 md:w-10 md:h-10 transform rotate-12 mb-2 ml-auto drop-shadow-xs">
          <polygon points="20,5 37,35 3,35" fill="none" stroke="#34D399" strokeWidth="4" strokeLinejoin="round" />
        </svg>
        <div className="text-slate-400 font-bold text-sm md:text-base font-mono transform rotate-6 drop-shadow-xs">
          5 - 2 = ?
        </div>
      </div>

      {/* 4. Right: Purple "÷" + Shapes Box */}
      <div className="absolute bottom-[28%] right-[5%] md:right-[9%] z-10 hidden sm:flex flex-col items-center gap-3">
        <div className="text-3xl font-black text-purple-400 transform rotate-12 select-none">
          ÷
        </div>
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-cyan-50 border border-cyan-200 shadow-md p-2 grid grid-cols-2 gap-1.5 items-center justify-items-center transform rotate-6">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-cyan-500" />
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-500" />
          <div className="w-2.5 h-2.5 bg-cyan-500 rounded-xs" />
          <div className="w-3.5 h-3.5 border-2 border-cyan-500 rounded-xs" />
        </div>
      </div>

      {/* Top Header Bar */}
      <header className="w-full flex items-center justify-between z-20 max-w-7xl mx-auto pt-1">
        {/* Left: CodingJr Logo */}
        <Link href="/" className="flex items-center group transition-transform hover:scale-102">
          <Image
            src="/codingjr.webp"
            alt="CodingJr"
            width={160}
            height={44}
            priority
            className="h-9 md:h-10 w-auto object-contain drop-shadow-xs"
          />
        </Link>

        {/* Right: Math Lab Direct Canvas Button */}
        <Link
          href={canvasUrl}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/80 hover:bg-white text-blue-600 border border-blue-200/80 shadow-xs hover:shadow-md transition-all text-xs md:text-sm font-bold backdrop-blur-xs group cursor-pointer"
        >
          <div className="w-5 h-5 rounded-md bg-blue-500 text-white flex items-center justify-center shadow-xs">
            <LayoutGrid className="w-3 h-3 group-hover:rotate-12 transition-transform" />
          </div>
          <span>Math Lab</span>
        </Link>
      </header>

      {/* Central Hero Banner Area */}
      <section className="flex-1 flex flex-col items-center justify-center text-center z-10 max-w-3xl mx-auto px-4 my-auto">
        {/* Explore • Practice • Grow Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E0EFFF] border border-blue-200/70 text-blue-600 text-[11px] md:text-xs font-extrabold tracking-widest uppercase mb-4 md:mb-5 shadow-xs">
          <span>EXPLORE</span>
          <span className="text-blue-400">•</span>
          <span>PRACTICE</span>
          <span className="text-blue-400">•</span>
          <span>GROW</span>
        </div>

        {/* Main Title with Sunburst Rays */}
        <div className="relative inline-block mb-3 md:mb-4">
          {/* Top-Left Sunburst Rays */}
          <div className="absolute -top-4 -left-7 md:-left-9 flex items-center pointer-events-none">
            <div className="w-4 md:w-5 h-1 md:h-1.5 bg-blue-500 rounded-full transform -rotate-45" />
            <div className="w-5 md:w-6 h-1 md:h-1.5 bg-amber-400 rounded-full transform -rotate-15 -ml-1 mt-3" />
          </div>

          {/* Title Heading: "Math Lab" */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none">
            <span className="text-[#12285E]">Math </span>
            <span className="text-[#2563EB]">Lab</span>
          </h1>

          {/* Top-Right Sunburst Rays */}
          <div className="absolute -top-4 -right-7 md:-right-9 flex items-center pointer-events-none">
            <div className="w-5 md:w-6 h-1 md:h-1.5 bg-amber-400 rounded-full transform rotate-45" />
            <div className="w-4 md:w-5 h-1 md:h-1.5 bg-blue-500 rounded-full transform rotate-15 -ml-1 mt-3" />
          </div>
        </div>

        {/* Subtitle Description */}
        <p className="text-sm md:text-base lg:text-lg text-slate-600 font-medium max-w-xl leading-relaxed mb-6 md:mb-7">
          Explore numbers, shapes, patterns and more.
          <br />
          Build strong math skills, one step at a time!
        </p>

        {/* Primary CTA Button: "→ Start Lab" */}
        <Link
          href={canvasUrl}
          className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 md:py-4 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm md:text-base shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>Start Lab</span>
        </Link>
      </section>

      {/* Bottom Feature Strip (5 Columns matching reference image) */}
      <footer className="w-full max-w-6xl mx-auto z-10 mb-1">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/80 shadow-lg shadow-blue-900/5 px-4 md:px-6 py-3.5 md:py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100/80">
          {/* 1. Numbers */}
          <Link
            href={canvasUrl}
            className="flex flex-col items-center text-center px-2 pt-2 sm:pt-0 group hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-110 transition-transform">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-xs text-[7px] font-bold text-white flex items-center justify-center">1</div>
                <div className="w-2.5 h-2.5 bg-purple-600 rounded-xs text-[7px] font-bold text-white flex items-center justify-center">2</div>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-xs text-[7px] font-bold text-white flex items-center justify-center col-span-2 mx-auto">3</div>
              </div>
            </div>
            <h3 className="font-bold text-xs md:text-sm text-[#1E3A8A] group-hover:text-blue-600 transition-colors">Numbers</h3>
            <p className="text-[10px] md:text-[11px] text-slate-500 leading-tight">Count, add, subtract and more!</p>
          </Link>

          {/* 2. Shapes */}
          <Link
            href={canvasUrl}
            className="flex flex-col items-center text-center px-2 pt-2 sm:pt-0 group hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-110 transition-transform">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-purple-500" />
                <div className="flex gap-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                </div>
              </div>
            </div>
            <h3 className="font-bold text-xs md:text-sm text-[#1E3A8A] group-hover:text-blue-600 transition-colors">Shapes</h3>
            <p className="text-[10px] md:text-[11px] text-slate-500 leading-tight">Discover shapes around you!</p>
          </Link>

          {/* 3. Patterns */}
          <Link
            href={canvasUrl}
            className="flex flex-col items-center text-center px-2 pt-2 sm:pt-0 group hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-110 transition-transform">
              <div className="flex items-end gap-1 h-5">
                <div className="w-1.5 h-3 bg-blue-500 rounded-t-xs" />
                <div className="w-1.5 h-5 bg-teal-500 rounded-t-xs" />
                <div className="w-1.5 h-2.5 bg-amber-400 rounded-t-xs" />
              </div>
            </div>
            <h3 className="font-bold text-xs md:text-sm text-[#1E3A8A] group-hover:text-blue-600 transition-colors">Patterns</h3>
            <p className="text-[10px] md:text-[11px] text-slate-500 leading-tight">Spot, continue and create!</p>
          </Link>

          {/* 4. Problem Solving */}
          <Link
            href={canvasUrl}
            className="flex flex-col items-center text-center px-2 pt-2 sm:pt-0 group hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-110 transition-transform text-blue-600">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs md:text-sm text-[#1E3A8A] group-hover:text-blue-600 transition-colors">Problem Solving</h3>
            <p className="text-[10px] md:text-[11px] text-slate-500 leading-tight">Think, try, find the answer!</p>
          </Link>

          {/* 5. Build Skills */}
          <Link
            href={canvasUrl}
            className="flex flex-col items-center text-center px-2 pt-2 sm:pt-0 group hover:opacity-90 transition-opacity col-span-2 sm:col-span-1 cursor-pointer"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-110 transition-transform text-purple-600">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs md:text-sm text-[#1E3A8A] group-hover:text-blue-600 transition-colors">Build Skills</h3>
            <p className="text-[10px] md:text-[11px] text-slate-500 leading-tight">Better math today, brighter tomorrow!</p>
          </Link>
        </div>
      </footer>
    </main>
  );
}
