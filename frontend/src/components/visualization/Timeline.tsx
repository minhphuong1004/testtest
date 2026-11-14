"use client";

import React from "react";
import { Observation } from "@/types/observation";
import { formatTimestamp } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface TimelineProps {
  observations: Observation[];
  selectedObservation: Observation | null;
  onSelectObservation: (obs: Observation) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  observations,
  selectedObservation,
  onSelectObservation,
}) => {
  const currentIndex = observations.findIndex(
    (obs) => obs.id === selectedObservation?.id
  );

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onSelectObservation(observations[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < observations.length - 1) {
      onSelectObservation(observations[currentIndex + 1]);
    }
  };

  return (
    <div id="timeline" className="rounded-2xl border border-space-800 bg-space-900/90 p-4 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Observation Timeline
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            ({currentIndex + 1} of {observations.length})
          </span>
        </div>

        {/* Step navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex <= 0}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-space-700 bg-space-800 text-slate-300 hover:border-cyan-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            aria-label="Previous observation"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= observations.length - 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-space-700 bg-space-800 text-slate-300 hover:border-cyan-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            aria-label="Next observation"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Timeline track with step nodes */}
      <div className="relative pt-2 pb-1">
        {/* Progress bar background */}
        <div className="absolute top-5 left-4 right-4 h-1 bg-space-800 rounded-full" />
        
        {/* Active fill bar */}
        <div
          className="absolute top-5 left-4 h-1 bg-cyan-500 rounded-full transition-all duration-300"
          style={{
            width: `${(currentIndex / Math.max(1, observations.length - 1)) * 100}%`,
          }}
        />

        {/* Step items */}
        <div className="relative flex justify-between gap-2 overflow-x-auto pb-2">
          {observations.map((obs, idx) => {
            const isSelected = obs.id === selectedObservation?.id;

            return (
              <button
                key={obs.id}
                onClick={() => onSelectObservation(obs)}
                className={`group flex flex-col items-center flex-1 min-w-[100px] text-center focus:outline-none transition-all ${
                  isSelected ? "scale-105" : "opacity-75 hover:opacity-100"
                }`}
              >
                {/* Node circle */}
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-500 text-space-950 font-bold shadow-glow-cyan"
                      : "border-space-700 bg-space-900 text-slate-400 group-hover:border-cyan-500/50"
                  }`}
                >
                  <span className="text-[10px]">{idx + 1}</span>
                </div>

                {/* Timestamp pill */}
                <span
                  className={`mt-2 text-[11px] font-medium leading-tight ${
                    isSelected ? "text-cyan-300 font-bold" : "text-slate-400"
                  }`}
                >
                  {formatTimestamp(obs.timestamp).split(" ").slice(0, 3).join(" ")}
                </span>
                
                {/* Measurement value pill */}
                <span className="text-[10px] text-slate-300 font-mono mt-0.5">
                  {obs.value.toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
