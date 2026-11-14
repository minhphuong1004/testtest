/**
 * Audio and Sonification Shared Types
 * 
 * Defines the contract between N03 (Sonification) and N04 (Frontend AudioPlayer).
 */

/**
 * Standard input payload sent to the sonification synthesizer for an observation.
 */
export interface SonificationInput {
  /** Numeric observation value to sonify */
  value: number;

  /** Minimum reference value in current dataset range */
  min: number;

  /** Maximum reference value in current dataset range */
  max: number;

  /** Observation timestamp */
  timestamp: string;
}

/**
 * Playback lifecycle state machine for audio and timeline synchronization.
 */
export type PlaybackState = "idle" | "playing" | "paused" | "stopped";

/**
 * Waveform choices for Web Audio oscillator.
 */
export type OscillatorWaveform = "sine" | "triangle" | "sawtooth" | "square";

/**
 * Sonification engine configuration options.
 */
export interface SonificationConfig {
  /** Base frequency in Hertz (Hz) mapped to the minimum data value (e.g., 130.81 Hz - C3) */
  minFrequencyHz: number;

  /** Peak frequency in Hertz (Hz) mapped to the maximum data value (e.g., 523.25 Hz - C5) */
  maxFrequencyHz: number;

  /** Audio master volume gain between 0.0 and 1.0 */
  volume: number;

  /** Oscillator waveform type */
  waveform: OscillatorWaveform;

  /** Enable harmonic overtone / resonance simulation for atmospheric thickness */
  enableHarmonics: boolean;
}

/**
 * Live audio telemetry emitted during playback.
 */
export interface AudioTelemetry {
  currentFrequencyHz: number;
  normalizedValue: number; // 0.0 - 1.0
  gain: number;
  state: PlaybackState;
}
