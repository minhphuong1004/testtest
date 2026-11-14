"use client";

import React from "react";
import { Globe, Volume2 } from "lucide-react";

interface HeaderProps {
  isMockData?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isMockData = true }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-space-800 bg-space-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Mission Tag */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/30 bg-space-900 shadow-glow-cyan">
            <Globe className="h-5 w-5 text-cyan-400 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500">
              <Volume2 className="h-2.5 w-2.5 text-space-950" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider text-white">BREATHE</span>
              <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-cyan-400 border border-cyan-500/20">
                NASA SPACE APPS 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Hear what the atmosphere is telling us.
            </p>
          </div>
        </div>

        {/* Data Status & Nav Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mock vs Verified Data Badge */}
          {isMockData ? (
            <div
              className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300"
              title="Development mock data is active. Not real NASA observations."
            >
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span>DEVELOPMENT MOCK DATA</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300"
              title="Verified NASA Earth Observation Dataset Active"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>VERIFIED NASA DATA</span>
            </div>
          )}

          {/* Quick Links */}
          <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-300">
            <a href="#visualization" className="hover:text-cyan-400 transition-colors">
              Visualization
            </a>
            <a href="#timeline" className="hover:text-cyan-400 transition-colors">
              Timeline
            </a>
            <a href="#sonification" className="hover:text-cyan-400 transition-colors">
              Sonification
            </a>
            <a href="#science" className="hover:text-cyan-400 transition-colors">
              Science
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
