"use client";

import React from "react";
import { OscillatorWaveform, SonificationConfig, AudioTelemetry } from "@/types/audio";
import { Sliders, Volume2, Waves } from "lucide-react";

interface SoundControlsProps {
  config: SonificationConfig;
  telemetry: AudioTelemetry | null;
  onVolumeChange: (volume: number) => void;
  onWaveformChange: (waveform: OscillatorWaveform) => void;
  onHarmonicsToggle: (enabled: boolean) => void;
}

export const SoundControls: React.FC<SoundControlsProps> = ({
  config,
  telemetry,
  onVolumeChange,
  onWaveformChange,
  onHarmonicsToggle,
}) => {
  const waveforms: OscillatorWaveform[] = ["sine", "triangle", "sawtooth", "square"];

  return (
    <div className="rounded-xl border border-space-800 bg-space-950/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sliders className="h-4 w-4 text-cyan-400" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
          Sonification Parameters
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Volume Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1 text-slate-400">
              <Volume2 className="h-3.5 w-3.5 text-cyan-400" /> Volume
            </span>
            <span className="font-mono text-slate-200">
              {Math.round(config.volume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-space-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Waveform Selector */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1 text-xs text-slate-400">
            <Waves className="h-3.5 w-3.5 text-cyan-400" /> Waveform
          </label>
          <div className="flex rounded-lg border border-space-800 bg-space-900 p-0.5">
            {waveforms.map((wave) => (
              <button
                key={wave}
                onClick={() => onWaveformChange(wave)}
                className={`flex-1 py-1 text-[10px] font-medium rounded transition capitalize ${
                  config.waveform === wave
                    ? "bg-cyan-500 text-space-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {wave}
              </button>
            ))}
          </div>
        </div>

        {/* Harmonics / Atmospheric Density Simulation */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400">Atmospheric Harmonics</label>
          <button
            onClick={() => onHarmonicsToggle(!config.enableHarmonics)}
            className={`w-full py-1.5 px-3 rounded-lg border text-xs font-medium transition flex items-center justify-between ${
              config.enableHarmonics
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                : "border-space-800 bg-space-900 text-slate-400"
            }`}
          >
            <span>Overtone Layer</span>
            <span className="text-[10px] uppercase font-mono">
              {config.enableHarmonics ? "Active" : "Off"}
            </span>
          </button>
        </div>
      </div>

      {/* Acoustic Frequency Telemetry */}
      {telemetry && (
        <div className="mt-3 flex flex-wrap items-center justify-between border-t border-space-800/80 pt-2 text-[11px] font-mono text-slate-400">
          <span>
            Synthesizer Pitch:{" "}
            <strong className="text-cyan-300">
              {telemetry.currentFrequencyHz ? `${telemetry.currentFrequencyHz.toFixed(1)} Hz` : "Idle"}
            </strong>
          </span>
          <span>
            Relative Density:{" "}
            <strong className="text-slate-200">
              {Math.round(telemetry.normalizedValue * 100)}%
            </strong>
          </span>
          <span>
            Tone Range: {config.minFrequencyHz} Hz – {config.maxFrequencyHz} Hz
          </span>
        </div>
      )}
    </div>
  );
};
