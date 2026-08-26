"use client";

import Image from "next/image";
import { usePlayer } from "@/app/components/player/PlayerProvider";

export type MediaItem =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; alt: string };

function filename(src: string): string {
  return src.split("/").pop() ?? src;
}

/**
 * Grid of images and videos, each with its filename printed underneath.
 * Playing a video pauses the background music and any other playing video.
 */
export function MediaGrid({ items }: { items: MediaItem[] }) {
  const { pause } = usePlayer();

  const onVideoPlay = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    pause();
    document.querySelectorAll("video").forEach((v) => {
      if (v !== e.currentTarget) v.pause();
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <figure key={item.src} className="m-0 min-w-0">
          <div className="sunken-panel bg-black p-1">
            {item.kind === "video" ? (
              <video
                src={item.src}
                controls
                preload="metadata"
                playsInline
                onPlay={onVideoPlay}
                className="block h-auto w-full"
                aria-label={item.alt}
              />
            ) : (
              <Image
                src={item.src}
                alt={item.alt}
                width={800}
                height={600}
                className="block h-auto w-full"
              />
            )}
          </div>
          <figcaption className="pt-1 text-center text-[11px]">
            {filename(item.src)}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
