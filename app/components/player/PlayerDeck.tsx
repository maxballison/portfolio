"use client";

import {
  SkipBackIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  SkipForwardIcon,
  SpeakerHighIcon,
} from "@phosphor-icons/react";
import { tracks } from "@/app/data/tracks";
import { usePlayer } from "./PlayerProvider";
import { Spectrum } from "./Spectrum";
import { WindowFrame } from "@/app/components/WindowFrame";

export function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerDeck() {
  const {
    trackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    toggle,
    next,
    prev,
    seek,
    setVolume,
    playlistOpen,
    setPlaylistOpen,
  } = usePlayer();

  const track = tracks[trackIndex];
  const marqueeText = `${track.title}  ***  MAX ALLISON  ***  `;

  const stop = () => {
    pause();
    seek(0);
  };

  return (
    <WindowFrame
      title="MY MUSIC"
      windowId="player"
      className="w-full max-w-md select-none"
      statusFields={[
        `Track ${trackIndex + 1} of ${tracks.length}`,
        isPlaying ? "Playing" : currentTime > 0 ? "Paused" : "Stopped",
      ]}
    >
      {/* LCD */}
      <div className="bezel-lcd relative overflow-hidden">
        <div
          className="lcd-scanlines pointer-events-none absolute inset-0 z-10"
          aria-hidden="true"
        />
        <div className="px-3 py-2">
          <div className="flex items-end justify-between gap-4">
            <div
              className="font-pixel text-5xl leading-none text-lcd-text tabular-nums"
              aria-label={`Elapsed time ${formatTime(currentTime)}`}
            >
              {formatTime(currentTime)}
            </div>
            <Spectrum className="h-12 w-32 shrink-0" />
          </div>
          <div
            className="mt-2 overflow-hidden border-t border-lcd-grid pt-1.5"
            aria-live="off"
          >
            <div className="lcd-marquee flex w-max whitespace-pre font-pixel text-xl uppercase text-lcd-text">
              <span>{marqueeText}</span>
              <span aria-hidden="true">{marqueeText}</span>
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            {isPlaying ? `Now playing: ${track.title}` : `Paused: ${track.title}`}
          </p>
        </div>
      </div>

      {/* Seek */}
      <div className="mt-3 flex items-center gap-2">
        <input
          type="range"
          className="w-full"
          min={0}
          max={duration || 1}
          step={0.1}
          value={Math.min(currentTime, duration || 1)}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Seek"
        />
        <span className="shrink-0 tabular-nums text-[11px]">
          {duration ? formatTime(duration) : track.durationLabel}
        </span>
      </div>

      {/* Transport + volume */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex items-center gap-0.5">
          <button type="button" className="transport" aria-label="Previous track" onClick={prev}>
            <SkipBackIcon size={14} weight="fill" />
          </button>
          <button
            type="button"
            className="transport"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={toggle}
          >
            {isPlaying ? (
              <PauseIcon size={14} weight="fill" />
            ) : (
              <PlayIcon size={14} weight="fill" />
            )}
          </button>
          <button type="button" className="transport" aria-label="Stop" onClick={stop}>
            <StopIcon size={14} weight="fill" />
          </button>
          <button type="button" className="transport" aria-label="Next track" onClick={next}>
            <SkipForwardIcon size={14} weight="fill" />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <SpeakerHighIcon size={14} aria-hidden="true" />
          <input
            type="range"
            className="w-20"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
          <button
            type="button"
            className={playlistOpen ? "pl-active" : ""}
            style={{ minWidth: 32 }}
            aria-label={playlistOpen ? "Hide playlist" : "Show playlist"}
            aria-expanded={playlistOpen}
            onClick={() => setPlaylistOpen(!playlistOpen)}
          >
            PL
          </button>
        </div>
      </div>

      {/* Playlist panel (Winamp "PL" toggle): attached below the deck as an
          overlay so opening it never reflows or scrolls the page */}
      {playlistOpen && (
        <div className="window absolute inset-x-0 top-full z-10 mt-1 p-1 shadow-[4px_4px_0_rgba(0,0,0,0.35)]">
          <div className="bezel-lcd relative overflow-hidden">
            <div
              className="lcd-scanlines pointer-events-none absolute inset-0 z-10"
              aria-hidden="true"
            />
            <ul className="max-h-56 overflow-y-auto">
              {tracks.map((track, i) => {
                const isCurrent = i === trackIndex;
                const isCurrentPlaying = isCurrent && isPlaying;
                return (
                  <li key={track.id} className={i > 0 ? "border-t border-lcd-grid" : ""}>
                    <button
                      type="button"
                      onClick={() => (isCurrentPlaying ? pause() : play(i))}
                      aria-label={
                        isCurrentPlaying ? `Pause ${track.title}` : `Play ${track.title}`
                      }
                      className={`lcd-row flex w-full items-center gap-3 font-pixel text-lg transition-colors ${
                        isCurrent ? "lcd-row-current" : ""
                      }`}
                    >
                      <span className="w-6 shrink-0 tabular-nums text-lcd-text-dim">
                        {isCurrentPlaying ? (
                          <PauseIcon size={12} weight="fill" className="text-amber" />
                        ) : isCurrent ? (
                          <PlayIcon size={12} weight="fill" className="text-amber" />
                        ) : (
                          `${i + 1}.`
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate uppercase">{track.title}</span>
                      <span className="shrink-0 tabular-nums text-lcd-text-dim">
                        {isCurrent && duration ? formatTime(duration) : track.durationLabel}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </WindowFrame>
  );
}
