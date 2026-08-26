"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { tracks } from "@/app/data/tracks";

type PlayerState = {
  trackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  /** True once the user has interacted with playback at least once. */
  hasStarted: boolean;
};

type PlayerApi = PlayerState & {
  play: (index?: number) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  /** Analyser for spectrum visualizers; null until playback first starts. */
  getAnalyser: () => AnalyserNode | null;
  /** Playlist panel visibility inside the MY MUSIC deck (Winamp "PL" toggle). */
  playlistOpen: boolean;
  setPlaylistOpen: (open: boolean) => void;
};

const PlayerContext = createContext<PlayerApi | null>(null);

export function usePlayer(): PlayerApi {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const [state, setState] = useState<PlayerState>({
    trackIndex: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    hasStarted: false,
  });

  // Keep a ref of trackIndex for event handlers
  const trackIndexRef = useRef(0);
  useEffect(() => {
    trackIndexRef.current = state.trackIndex;
  }, [state.trackIndex]);

  /** Lazily create the audio element + listeners (client only). */
  const getAudio = useCallback((): HTMLAudioElement => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = tracks[0].src;
    audio.volume = 0.8;

    audio.addEventListener("timeupdate", () => {
      setState((s) => ({ ...s, currentTime: audio.currentTime }));
    });
    audio.addEventListener("loadedmetadata", () => {
      setState((s) => ({ ...s, duration: audio.duration || 0 }));
    });
    audio.addEventListener("ended", () => {
      // Auto-advance through the playlist, wrapping at the end.
      const nextIndex = (trackIndexRef.current + 1) % tracks.length;
      audio.src = tracks[nextIndex].src;
      setState((s) => ({ ...s, trackIndex: nextIndex, currentTime: 0 }));
      void audio.play().catch(() => {
        setState((s) => ({ ...s, isPlaying: false }));
      });
    });
    audio.addEventListener("play", () => {
      setState((s) => ({ ...s, isPlaying: true }));
    });
    audio.addEventListener("pause", () => {
      setState((s) => ({ ...s, isPlaying: false }));
    });

    audioRef.current = audio;
    return audio;
  }, []);

  /** Wire Web Audio graph on first play (autoplay policy requires a gesture). */
  const ensureGraph = useCallback((audio: HTMLAudioElement) => {
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === "suspended") {
        void audioCtxRef.current.resume();
      }
      return;
    }
    try {
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.78;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    } catch {
      // If the graph fails (unlikely), the <audio> element still plays on its own.
    }
  }, []);

  const play = useCallback(
    (index?: number) => {
      const audio = getAudio();
      ensureGraph(audio);
      if (index !== undefined && index !== trackIndexRef.current) {
        audio.src = tracks[index].src;
        setState((s) => ({ ...s, trackIndex: index, currentTime: 0, duration: 0 }));
      }
      setState((s) => ({ ...s, hasStarted: true }));
      void audio.play().catch(() => {
        setState((s) => ({ ...s, isPlaying: false }));
      });
    },
    [getAudio, ensureGraph]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      pause();
    } else {
      play();
    }
  }, [play, pause]);

  const next = useCallback(() => {
    const wasPlaying = audioRef.current ? !audioRef.current.paused : false;
    const i = (trackIndexRef.current + 1) % tracks.length;
    if (wasPlaying || state.hasStarted) {
      play(i);
    } else {
      setState((s) => ({ ...s, trackIndex: i, currentTime: 0, duration: 0 }));
      if (audioRef.current) audioRef.current.src = tracks[i].src;
    }
  }, [play, state.hasStarted]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    // Standard behavior: restart current track if > 3s in, else previous track.
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const i = (trackIndexRef.current - 1 + tracks.length) % tracks.length;
    if (state.hasStarted) {
      play(i);
    } else {
      setState((s) => ({ ...s, trackIndex: i, currentTime: 0, duration: 0 }));
      if (audioRef.current) audioRef.current.src = tracks[i].src;
    }
  }, [play, state.hasStarted]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setState((s) => ({ ...s, currentTime: time }));
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    if (audioRef.current) audioRef.current.volume = clamped;
    setState((s) => ({ ...s, volume: clamped }));
  }, []);

  const getAnalyser = useCallback(() => analyserRef.current, []);

  const [playlistOpen, setPlaylistOpen] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      void audioCtxRef.current?.close();
      audioRef.current = null;
      audioCtxRef.current = null;
      analyserRef.current = null;
    };
  }, []);

  const api = useMemo<PlayerApi>(
    () => ({
      ...state,
      play,
      pause,
      toggle,
      next,
      prev,
      seek,
      setVolume,
      getAnalyser,
      playlistOpen,
      setPlaylistOpen,
    }),
    [state, play, pause, toggle, next, prev, seek, setVolume, getAnalyser, playlistOpen]
  );

  return <PlayerContext.Provider value={api}>{children}</PlayerContext.Provider>;
}
