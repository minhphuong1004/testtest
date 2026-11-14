"use client";

import React, { useEffect } from "react";
import { Observation } from "@/types/observation";
import { useSonification } from "@/hooks/useSonification";
import { SoundControls } from "./SoundControls";
import {
  Play,
  Pause,
  Square,
  Volume2,
  Radio,
  SkipBack,
  SkipForward,
  Info,
} from "lucide-react";

interface AudioPlayerProps {
  currentObservation: Observation | null;
  datasetRange: { min: number; max: number };
  onPreviousObservation?: () => void;
  onNextObservation?: () => void;
  hasNextObservation?: boolean;
  hasPreviousObservation?: boolean;
}

/**
 * AudioPlayer Component
 * 
 * PRIMARY INTEGRATION BOUNDARY FOR WORKSTREAM N03 (Sonification Lead).
 * 
 * Architecture Note for N03:
 * - This component interacts exclusively with the `useSonification` hook and `sonificationService`.
 * - Do NOT create an isolated Web Audio context here; use the service layer.
 * - Future audio features (binaural spatialization, granular synthesis, MIDI export)
 *   should be added to `src/services/sonificationService.ts` and triggered here.
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentObservation,
  datasetRange,
  onPreviousObservation,
  onNextObservation,
  hasNextObservation = false,
  hasPreviousObservation = false,
}) => {
  const {
    playbackState,
    telemetry,
    config,
    play,
    pause,
    resume,
    stop,
    setVolume,
    setWaveform,
    updateConfig,
  } = useSonification();

  // When active observation changes while playing, update the sonification pitch seamlessly
  useEffect(() => {
    if (playbackState === "playing" && currentObservation) {
      play({
        value: currentObservation.value,
        min: datasetRange.min,
        max: datasetRange.max,
        timestamp: currentObservation.timestamp,
      });
    }
  }, [currentObservation, datasetRange, playbackState, play]);

  // Handle Play/Pause toggle
  const handleTogglePlay = () => {
    if (!currentObservation) return;

    if (playbackState === "playing") {
      pause();
    } else if (playbackState === "paused") {
      resume();
    } else {
      play({
        value: currentObservation.value,
        min: datasetRange.min,
        max: datasetRange.max,
        timestamp: currentObservation.timestamp,
      });
    }
  };

  const handleStop = () => {
    stop();
  };

  return (
    <div
      id="sonification"
      className="rounded-2xl border border-space-800 bg-space-900/90 p-4 sm:p-6 shadow-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-space-800 text-cyan-400">
            <Volume2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Atmospheric Sonification Engine
              </h3>
              <span className="rounded bg-space-800 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-space-700">
                N03 Audio Module
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Translating column aerosol optical extinction into audible frequencies.
            </p>
          </div>
        </div>

        {/* Playback Status Pill */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium border ${
              playbackState === "playing"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : playbackState === "paused"
                ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                : "border-space-700 bg-space-800 text-slate-400"
            }`}
          >
            <Radio
              className={`h-3 w-3 ${
                playbackState === "playing" ? "animate-pulse text-emerald-400" : ""
              }`}
            />
            STATUS: {playbackState.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Transport Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-4 border-y border-space-800">
        {/* Previous Observation */}
        <button
          onClick={onPreviousObservation}
          disabled={!hasPreviousObservation}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-space-700 bg-space-800 text-slate-300 hover:border-cyan-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Previous step"
        >
          <SkipBack className="h-4 w-4" />
        </button>

        {/* Primary Play / Pause Button */}
        <button
          onClick={handleTogglePlay}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-space-950 font-bold shadow-glow-cyan hover:bg-cyan-400 transition transform hover:scale-105 active:scale-95"
          aria-label={playbackState === "playing" ? "Pause sonification" : "Play sonification"}
        >
          {playbackState === "playing" ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </button>

        {/* Stop Button */}
        <button
          onClick={handleStop}
          disabled={playbackState === "idle" || playbackState === "stopped"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-space-700 bg-space-800 text-slate-300 hover:border-red-500/60 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Stop audio"
        >
          <Square className="h-4 w-4" />
        </button>

        {/* Next Observation */}
        <button
          onClick={onNextObservation}
          disabled={!hasNextObservation}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-space-700 bg-space-800 text-slate-300 hover:border-cyan-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Next step"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      {/* Sound Synthesis Controls (Waveform, Volume, Harmonics) */}
      <div className="mt-4">
        <SoundControls
          config={config}
          telemetry={telemetry}
          onVolumeChange={setVolume}
          onWaveformChange={setWaveform}
          onHarmonicsToggle={(enabled) => updateConfig({ enableHarmonics: enabled })}
        />
      </div>

      {/* Workstream N03 Architecture Hook Notice */}
      <div className="mt-4 flex items-start gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 text-xs text-slate-300">
        <Info className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-cyan-300">Sonification Integration Note:</strong> The audio
          synthesizer operates via browser Web Audio API in{" "}
          <code className="text-cyan-300 font-mono">src/services/sonificationService.ts</code>.
          Audio pitch maps linearly/exponentially to column optical depth ({datasetRange.min.toFixed(2)} →{" "}
          {config.minFrequencyHz} Hz, {datasetRange.max.toFixed(2)} → {config.maxFrequencyHz} Hz).
        </p>
      </div>
    </div>
  );
};
