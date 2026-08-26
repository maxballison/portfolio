"use client";

import { useEffect, useState } from "react";
import {
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
  MusicNotesIcon,
} from "@phosphor-icons/react";
import { tracks } from "@/app/data/tracks";
import { usePlayer } from "./player/PlayerProvider";
import { focusWindow } from "./windowRegistry";
import { formatTime } from "./player/PlayerDeck";

function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, []);

  // Render nothing until mounted to avoid a server/client mismatch
  return (
    <span className="tabular-nums text-[11px]" suppressHydrationWarning>
      {time ?? ""}
    </span>
  );
}

/** Fixed Win98-style taskbar: jump-to-top block, mini transport, track well, clock. */
export function Taskbar() {
  const { trackIndex, isPlaying, currentTime, toggle, next } = usePlayer();
  const track = tracks[trackIndex];

  return (
    <div className="taskbar">
      <a href="#top" className="shrink-0" onClick={() => focusWindow("welcome")}>
        <button type="button" tabIndex={-1} className="font-bold">
          MA
        </button>
      </a>

      <div className="taskbar-divider" aria-hidden="true" />

      <button
        type="button"
        className="transport shrink-0"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={toggle}
      >
        {isPlaying ? (
          <PauseIcon size={13} weight="fill" />
        ) : (
          <PlayIcon size={13} weight="fill" />
        )}
      </button>
      <button
        type="button"
        className="transport shrink-0"
        aria-label="Next track"
        onClick={next}
      >
        <SkipForwardIcon size={13} weight="fill" />
      </button>

      <a
        href="#player-anchor"
        onClick={() => focusWindow("player")}
        className="taskbar-well taskbar-well-lcd min-w-0 flex-1 no-underline sm:max-w-xs"
        aria-label="Show player"
      >
        <MusicNotesIcon size={13} className="shrink-0 text-lcd-text-dim" aria-hidden="true" />
        <span className="truncate font-pixel text-base uppercase text-lcd-text">
          {track.title}
        </span>
        <span className="ml-auto shrink-0 font-pixel text-base tabular-nums text-lcd-text">
          {formatTime(currentTime)}
        </span>
      </a>

      <div className="ml-auto hidden sm:block">
        <div className="taskbar-well">
          <Clock />
        </div>
      </div>
    </div>
  );
}
