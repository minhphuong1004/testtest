"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  AudioTelemetry,
  OscillatorWaveform,
  PlaybackState,
  SonificationConfig,
  SonificationInput,
} from "@/types/audio";
import { sonificationService } from "@/services/sonificationService";

export interface UseSonificationReturn {
  playbackState: PlaybackState;
  telemetry: AudioTelemetry | null;
  config: SonificationConfig;
  play: (input: SonificationInput) => void;
  pause: () => void;
  resume: (input?: SonificationInput) => void;
  stop: () => void;
  setVolume: (vol: number) => void;
  setWaveform: (waveform: OscillatorWaveform) => void;
  updateConfig: (partial: Partial<SonificationConfig>) => void;
}

/**
 * Custom React hook for controlling Web Audio sonification.
 * Manages reactive state updates and prevents audio memory leaks.
 */
export function useSonification(): UseSonificationReturn {
  const [playbackState, setPlaybackState] = useState<PlaybackState>(() =>
    sonificationService.getState()
  );
  const [telemetry, setTelemetry] = useState<AudioTelemetry | null>(null);
  const [config, setConfig] = useState<SonificationConfig>(() =>
    sonificationService.getConfig()
  );

  const activeInputRef = useRef<SonificationInput | null>(null);

  useEffect(() => {
    // Subscribe to state transitions
    const unsubscribeState = sonificationService.onStateChange((newState) => {
      setPlaybackState(newState);
    });

    // Subscribe to telemetry updates
    const unsubscribeTelemetry = sonificationService.onTelemetry((newTelemetry) => {
      setTelemetry(newTelemetry);
    });

    return () => {
      unsubscribeState();
      unsubscribeTelemetry();
      sonificationService.stop();
    };
  }, []);

  const play = useCallback((input: SonificationInput) => {
    activeInputRef.current = input;
    sonificationService.play(input);
  }, []);

  const pause = useCallback(() => {
    sonificationService.pause();
  }, []);

  const resume = useCallback((input?: SonificationInput) => {
    const targetInput = input || activeInputRef.current || undefined;
    sonificationService.resume(targetInput);
  }, []);

  const stop = useCallback(() => {
    activeInputRef.current = null;
    sonificationService.stop();
  }, []);

  const setVolume = useCallback((volume: number) => {
    sonificationService.setVolume(volume);
    setConfig(sonificationService.getConfig());
  }, []);

  const setWaveform = useCallback((waveform: OscillatorWaveform) => {
    sonificationService.setWaveform(waveform);
    setConfig(sonificationService.getConfig());
  }, []);

  const updateConfig = useCallback((partial: Partial<SonificationConfig>) => {
    sonificationService.updateConfig(partial);
    setConfig(sonificationService.getConfig());
  }, []);

  return {
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
  };
}
