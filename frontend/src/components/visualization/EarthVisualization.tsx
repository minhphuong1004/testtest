"use client";

import React from "react";
import Image from "next/image";
import { Observation } from "@/types/observation";
import { formatTimestamp } from "@/lib/utils";
import { AlertTriangle, Compass, Satellite } from "lucide-react";

interface EarthVisualizationProps {
  observation: Observation | null;
  datasetTitle?: string;
}

export const EarthVisualization: React.FC<EarthVisualizationProps> = ({
  observation,
  datasetTitle = "Atmospheric Observation",
}) => {
  if (!observation) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-2xl border border-space-800 bg-space-900/60 p-8 text-center text-slate-400">
        <p>No observation selected. Select a timestamp from the timeline below.</p>
      </div>
    );
  }

  // Calculate atmospheric turbidity visual glow based on observation value
  // AOD values: 0.1 (clean cyan) -> 0.5 (turbid amber) -> 1.0+ (dense plume orange/red)
  const aodValue = observation.value;
  let glowColor = "rgba(6, 182, 212, 0.35)"; // cyan
  let turbidityLabel = "Clean Air Column";

  if (aodValue > 0.8) {
    glowColor = "rgba(239, 68, 68, 0.4)"; // red
    turbidityLabel = "High Optical Extinction (Dense Plume)";
  } else if (aodValue > 0.4) {
    glowColor = "rgba(245, 158, 11, 0.35)"; // amber
    turbidityLabel = "Moderate Turbidity (Haze / Smoke)";
  } else if (aodValue > 0.2) {
    glowColor = "rgba(56, 189, 248, 0.3)"; // sky blue
    turbidityLabel = "Mild Regional Scattering";
  }

  return (
    <div
      id="visualization"
      className="relative overflow-hidden rounded-2xl border border-space-800 bg-space-900 shadow-2xl transition-all"
    >
      {/* Header bar of visualization */}
      <div className="flex flex-wrap items-center justify-between border-b border-space-800 bg-space-950/70 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Satellite className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            {datasetTitle}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {observation.isMock && (
            <span className="flex items-center gap-1 rounded bg-amber-500/15 px-2 py-0.5 font-medium text-amber-300 border border-amber-500/30">
              <AlertTriangle className="h-3 w-3" />
              MOCK VISUAL
            </span>
          )}
          <span className="text-slate-400">
            {formatTimestamp(observation.timestamp)}
          </span>
        </div>
      </div>

      {/* Main Visual Display Frame */}
      <div className="relative aspect-[16/9] w-full max-h-[500px] overflow-hidden bg-space-950">
        {/* Background Image / Satellite Layer */}
        <div className="relative h-full w-full">
          {observation.imageUrl ? (
            <Image
              src={observation.imageUrl}
              alt={observation.description}
              fill
              className="object-cover opacity-85 transition-opacity duration-500"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-space-950 text-slate-500">
              Imagery pending from NASA GIBS
            </div>
          )}

          {/* Atmospheric Glow Halo Simulation */}
          <div
            className="pointer-events-none absolute inset-0 transition-all duration-700"
            style={{
              background: `radial-gradient(circle at 50% 50%, transparent 40%, ${glowColor} 100%)`,
              mixBlendMode: "screen",
            }}
          />

          {/* Grid lines overlay for scientific telemetry feel */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* Live Observation HUD Overlay (Bottom) */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-space-950 via-space-950/80 to-transparent p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[11px] font-semibold text-cyan-300 border border-cyan-500/30">
                  {observation.variable}
                </span>
                <span className="text-xs text-slate-300">{turbidityLabel}</span>
              </div>
              <p className="max-w-xl text-xs sm:text-sm text-slate-300 line-clamp-2">
                {observation.description}
              </p>
            </div>

            {/* Current Value Display */}
            <div className="flex flex-col sm:items-end rounded-xl border border-space-700 bg-space-900/80 p-3 backdrop-blur-sm">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">
                Measurement Value
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {observation.value.toFixed(2)}
                </span>
                <span className="text-xs text-cyan-400 font-mono">
                  {observation.unit}
                </span>
              </div>
              {observation.coordinates && (
                <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                  <Compass className="h-3 w-3 text-cyan-400" />
                  <span>
                    {observation.coordinates.regionName ||
                      `${observation.coordinates.lat}°, ${observation.coordinates.lon}°`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
