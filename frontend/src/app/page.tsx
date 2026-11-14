"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EarthVisualization } from "@/components/visualization/EarthVisualization";
import { Timeline } from "@/components/visualization/Timeline";
import { DataChart } from "@/components/visualization/DataChart";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { ScienceExplanation } from "@/components/science/ScienceExplanation";
import { dataService } from "@/services/dataService";
import { Dataset } from "@/types/dataset";
import { Observation } from "@/types/observation";
import {
  Activity,
  AlertCircle,
  Calendar,
  Compass,
  Info,
  Radio,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [datasetRange, setDatasetRange] = useState<{ min: number; max: number }>({
    min: 0.05,
    max: 1.25,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const loadedDataset = await dataService.getDataset();
        const loadedObs = await dataService.getObservations();
        const range = await dataService.getDatasetRange();

        setDataset(loadedDataset);
        setObservations(loadedObs);
        setDatasetRange(range);

        if (loadedObs.length > 0) {
          setSelectedObservation(loadedObs[0]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const currentIndex = observations.findIndex(
    (obs) => obs.id === selectedObservation?.id
  );

  const handlePreviousObservation = () => {
    if (currentIndex > 0) {
      setSelectedObservation(observations[currentIndex - 1]);
    }
  };

  const handleNextObservation = () => {
    if (currentIndex < observations.length - 1) {
      setSelectedObservation(observations[currentIndex + 1]);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-950 text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="text-sm font-medium">Initializing BREATHE Atmospheric Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-space-950 text-slate-100">
      {/* 1. Header and Navigation */}
      <Header isMockData={dataset?.isMock ?? true} />

      <main className="flex-1 pb-16">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden border-b border-space-800 bg-gradient-to-b from-space-900 via-space-950 to-space-950 py-12 sm:py-16">
          {/* Subtle atmospheric ambient glow */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                NASA Space Apps Challenge 2026 – The Earth Information Jukebox
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
                Hear what the atmosphere is telling us.
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
                BREATHE translates NASA Earth observations of atmospheric aerosols and climate
                variables into an immersive, interactive auditory experience. Explore spatial
                satellite data across time and discover scientific relationships through dynamic sound.
              </p>

              {/* Development Mock Notice Banner */}
              {dataset?.isMock && (
                <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-300">
                      Development Environment Notice:{" "}
                    </span>
                    The active data stream is synthetic mock data for frontend scaffolding and audio
                    pipeline integration. Real NASA GIBS/MODIS datasets will be ingested by
                    Workstream N01.
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Core Interactive Layout Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          {/* Top Section: Visualization + Scientific Data Info Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 3. Earth Visualization Panel (8 cols on lg) */}
            <div className="lg:col-span-8">
              <EarthVisualization
                observation={selectedObservation}
                datasetTitle={dataset?.title}
              />
            </div>

            {/* 5. Scientific Data Information Panel (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl border border-space-800 bg-space-900/90 p-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-space-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Telemetry Data Panel
                    </h3>
                  </div>
                  <span className="text-[10px] rounded bg-space-800 px-2 py-0.5 font-mono text-cyan-400 border border-space-700">
                    Active Observation
                  </span>
                </div>

                {selectedObservation ? (
                  <div className="space-y-4">
                    {/* Measurement Primary Callout */}
                    <div className="rounded-xl border border-space-750 bg-space-950/80 p-4">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {selectedObservation.variable}
                      </span>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-white">
                          {selectedObservation.value.toFixed(2)}
                        </span>
                        <span className="text-xs font-mono text-cyan-400">
                          {selectedObservation.unit}
                        </span>
                      </div>
                      <div className="mt-2 text-[11px] text-slate-400">
                        Range: {datasetRange.min.toFixed(2)} – {datasetRange.max.toFixed(2)} {selectedObservation.unit}
                      </div>
                    </div>

                    {/* Metadata Items */}
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-space-800/80">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Calendar className="h-3.5 w-3.5 text-cyan-400" /> Timestamp
                        </span>
                        <span className="font-mono text-slate-200">
                          {selectedObservation.timestamp}
                        </span>
                      </div>

                      {selectedObservation.coordinates && (
                        <div className="flex items-center justify-between py-1 border-b border-space-800/80">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Compass className="h-3.5 w-3.5 text-cyan-400" /> Coordinates
                          </span>
                          <span className="font-mono text-slate-200">
                            {selectedObservation.coordinates.lat}°, {selectedObservation.coordinates.lon}°
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between py-1 border-b border-space-800/80">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Radio className="h-3.5 w-3.5 text-cyan-400" /> Source Data
                        </span>
                        <span className="text-right text-slate-300 font-medium">
                          {dataset?.source.split(" ")[0]}
                        </span>
                      </div>
                    </div>

                    {/* Scientific Summary Description */}
                    <div className="rounded-lg bg-space-950/50 p-3 text-xs leading-relaxed text-slate-300">
                      <p className="font-medium text-slate-200 mb-1">Observation Context:</p>
                      <p>{selectedObservation.description}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No active observation selected.</p>
                )}
              </div>

              {/* Quick Science Hint Card */}
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-semibold text-cyan-300 mb-1">
                  <Info className="h-4 w-4 text-cyan-400" />
                  <span>AOD Scientific Note</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  AOD 550nm reflects optical extinction across the atmospheric column. It does NOT
                  represent ground-level AQI. High AOD may stem from natural dust or elevated wildfire
                  smoke.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Observation Timeline */}
          <Timeline
            observations={observations}
            selectedObservation={selectedObservation}
            onSelectObservation={(obs) => setSelectedObservation(obs)}
          />

          {/* Middle Section: Audio Player + Data Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 6. Audio Player Integration Module (6 cols on lg) */}
            <div className="lg:col-span-6">
              <AudioPlayer
                currentObservation={selectedObservation}
                datasetRange={datasetRange}
                onPreviousObservation={handlePreviousObservation}
                onNextObservation={handleNextObservation}
                hasPreviousObservation={currentIndex > 0}
                hasNextObservation={currentIndex < observations.length - 1}
              />
            </div>

            {/* Time-series Data Chart (6 cols on lg) */}
            <div className="lg:col-span-6">
              <DataChart
                observations={observations}
                selectedObservation={selectedObservation}
                onSelectObservation={(obs) => setSelectedObservation(obs)}
                variableName={dataset?.variable}
                unit={dataset?.unit}
              />
            </div>
          </div>

          {/* 7. Scientific Explanation Panel */}
          <ScienceExplanation />
        </div>
      </main>

      {/* 8 & 9. Data Attribution and Footer */}
      <Footer />
    </div>
  );
}
