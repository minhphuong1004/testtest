import {
  AudioTelemetry,
  OscillatorWaveform,
  PlaybackState,
  SonificationConfig,
  SonificationInput,
} from "@/types/audio";
import { mapRange } from "@/lib/utils";

/**
 * Sonification Service
 * 
 * Primary integration boundary for Workstream N03 (Sonification).
 * Implements browser Web Audio API synthesis, mapping atmospheric data to acoustic frequencies.
 */
export class SonificationService {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private subOscillator: OscillatorNode | null = null;
  private subGainNode: GainNode | null = null;

  private state: PlaybackState = "idle";
  private config: SonificationConfig = {
    minFrequencyHz: 130.81, // C3 (warm lower octave for clear atmosphere)
    maxFrequencyHz: 523.25, // C5 (bright upper octave for dense aerosols)
    volume: 0.7,
    waveform: "sine",
    enableHarmonics: true,
  };

  private currentFrequencyHz = 0;
  private telemetryListeners: Array<(telemetry: AudioTelemetry) => void> = [];
  private stateListeners: Array<(state: PlaybackState) => void> = [];

  /**
   * Lazily initializes Web Audio AudioContext upon first user interaction
   * to comply with browser autoplay policies.
   */
  private initAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Subscribes to playback state transitions.
   */
  public onStateChange(listener: (state: PlaybackState) => void): () => void {
    this.stateListeners.push(listener);
    return () => {
      this.stateListeners = this.stateListeners.filter((l) => l !== listener);
    };
  }

  /**
   * Subscribes to real-time audio telemetry (frequency, gain, normalized level).
   */
  public onTelemetry(listener: (telemetry: AudioTelemetry) => void): () => void {
    this.telemetryListeners.push(listener);
    return () => {
      this.telemetryListeners = this.telemetryListeners.filter((l) => l !== listener);
    };
  }

  private notifyState(state: PlaybackState): void {
    this.state = state;
    this.stateListeners.forEach((l) => l(state));
  }

  private notifyTelemetry(normalized: number): void {
    const telemetry: AudioTelemetry = {
      currentFrequencyHz: this.currentFrequencyHz,
      normalizedValue: normalized,
      gain: this.config.volume,
      state: this.state,
    };
    this.telemetryListeners.forEach((l) => l(telemetry));
  }

  /**
   * Maps a data observation to acoustic synthesis parameters and triggers playback.
   */
  public play(input: SonificationInput): void {
    if (typeof window === "undefined") return;

    const ctx = this.initAudioContext();
    const now = ctx.currentTime;

    // Normalize value between min and max [0, 1]
    const rangeSpan = input.max - input.min;
    const normalized = rangeSpan > 0 ? (input.value - input.min) / rangeSpan : 0.5;
    const clampedNormalized = Math.min(Math.max(normalized, 0), 1);

    // Map to frequency range
    const targetFreq = mapRange(
      clampedNormalized,
      0,
      1,
      this.config.minFrequencyHz,
      this.config.maxFrequencyHz
    );
    this.currentFrequencyHz = targetFreq;

    if (!this.oscillator) {
      // Build audio graph
      this.oscillator = ctx.createOscillator();
      this.gainNode = ctx.createGain();

      this.oscillator.type = this.config.waveform;
      this.oscillator.frequency.setValueAtTime(targetFreq, now);

      // Smooth attack ramp to prevent audible clicking
      this.gainNode.gain.setValueAtTime(0.001, now);
      this.gainNode.gain.exponentialRampToValueAtTime(Math.max(0.01, this.config.volume), now + 0.05);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(ctx.destination);
      this.oscillator.start(now);

      // Secondary overtone for atmospheric density simulation
      if (this.config.enableHarmonics) {
        this.subOscillator = ctx.createOscillator();
        this.subGainNode = ctx.createGain();

        this.subOscillator.type = "triangle";
        this.subOscillator.frequency.setValueAtTime(targetFreq * 1.5, now); // Perfect fifth overtone
        this.subGainNode.gain.setValueAtTime(0.001, now);
        this.subGainNode.gain.exponentialRampToValueAtTime(
          Math.max(0.005, this.config.volume * 0.3),
          now + 0.05
        );

        this.subOscillator.connect(this.subGainNode);
        this.subGainNode.connect(ctx.destination);
        this.subOscillator.start(now);
      }
    } else {
      // Smooth frequency transition
      this.oscillator.frequency.cancelScheduledValues(now);
      this.oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, targetFreq), now + 0.08);

      if (this.subOscillator) {
        this.subOscillator.frequency.cancelScheduledValues(now);
        this.subOscillator.frequency.exponentialRampToValueAtTime(
          Math.max(30, targetFreq * 1.5),
          now + 0.08
        );
      }
    }

    this.notifyState("playing");
    this.notifyTelemetry(clampedNormalized);
  }

  /**
   * Pauses the audio synthesizer gracefully.
   */
  public pause(): void {
    if (!this.audioCtx || this.state !== "playing") return;
    const now = this.audioCtx.currentTime;

    if (this.gainNode) {
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setTargetAtTime(0.0001, now, 0.04);
    }
    if (this.subGainNode) {
      this.subGainNode.gain.cancelScheduledValues(now);
      this.subGainNode.gain.setTargetAtTime(0.0001, now, 0.04);
    }

    this.notifyState("paused");
  }

  /**
   * Resumes paused playback.
   */
  public resume(input?: SonificationInput): void {
    if (input) {
      this.play(input);
    } else if (this.audioCtx && this.state === "paused" && this.gainNode) {
      const now = this.audioCtx.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setTargetAtTime(this.config.volume, now, 0.05);
      if (this.subGainNode) {
        this.subGainNode.gain.setTargetAtTime(this.config.volume * 0.3, now, 0.05);
      }
      this.notifyState("playing");
    }
  }

  /**
   * Stops playback and ramps down output gain.
   */
  public stop(): void {
    if (!this.audioCtx) {
      this.notifyState("stopped");
      return;
    }

    const now = this.audioCtx.currentTime;
    if (this.gainNode) {
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setTargetAtTime(0.0001, now, 0.05);
    }
    if (this.subGainNode) {
      this.subGainNode.gain.cancelScheduledValues(now);
      this.subGainNode.gain.setTargetAtTime(0.0001, now, 0.05);
    }

    setTimeout(() => {
      this.cleanupOscillators();
      this.notifyState("stopped");
    }, 80);
  }

  /**
   * Updates master volume.
   */
  public setVolume(volume: number): void {
    const clamped = Math.min(Math.max(volume, 0), 1);
    this.config.volume = clamped;
    if (this.gainNode && this.audioCtx && this.state === "playing") {
      this.gainNode.gain.setTargetAtTime(clamped, this.audioCtx.currentTime, 0.05);
    }
    if (this.subGainNode && this.audioCtx && this.state === "playing") {
      this.subGainNode.gain.setTargetAtTime(clamped * 0.3, this.audioCtx.currentTime, 0.05);
    }
  }

  /**
   * Updates the synthesizer oscillator waveform.
   */
  public setWaveform(waveform: OscillatorWaveform): void {
    this.config.waveform = waveform;
    if (this.oscillator) {
      this.oscillator.type = waveform;
    }
  }

  /**
   * Updates sonification configuration parameters.
   */
  public updateConfig(partial: Partial<SonificationConfig>): void {
    this.config = { ...this.config, ...partial };
  }

  /**
   * Cleans up audio nodes and resets graph resources to avoid memory leaks.
   */
  private cleanupOscillators(): void {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch {
        // Ignored if already stopped
      }
      this.oscillator = null;
    }
    if (this.subOscillator) {
      try {
        this.subOscillator.stop();
        this.subOscillator.disconnect();
      } catch {
        // Ignored
      }
      this.subOscillator = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    if (this.subGainNode) {
      this.subGainNode.disconnect();
      this.subGainNode = null;
    }
  }

  /**
   * Full teardown for component unmounting.
   */
  public destroy(): void {
    this.stop();
    if (this.audioCtx && this.audioCtx.state !== "closed") {
      try {
        this.audioCtx.close();
      } catch {
        // Ignored
      }
      this.audioCtx = null;
    }
    this.telemetryListeners = [];
    this.stateListeners = [];
  }

  public getState(): PlaybackState {
    return this.state;
  }

  public getConfig(): SonificationConfig {
    return { ...this.config };
  }
}

export const sonificationService = new SonificationService();
