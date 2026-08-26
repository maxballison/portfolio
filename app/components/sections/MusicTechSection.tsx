"use client";

import { WindowFrame } from "@/app/components/WindowFrame";
import { MediaGrid, type MediaItem } from "@/app/components/MediaGrid";

const media: MediaItem[] = [
  {
    kind: "video",
    src: "/musictech/ControllingMusicWithACustomBuiltBrainSensor.mp4",
    alt: "Controlling music with a custom-built brain sensor",
  },
  {
    kind: "video",
    src: "/musictech/IBuiltASynthsizerCalledChippy.mp4",
    alt: "A synthesizer I built, called Chippy",
  },
  {
    kind: "video",
    src: "/musictech/PlayingWithTheBuchla.mp4",
    alt: "Playing with the Buchla synthesizer",
  },
  {
    kind: "video",
    src: "/musictech/CodingMusicInMySubaru.mp4",
    alt: "Coding music in my Subaru",
  },
];

export function MusicTechSection() {
  return (
    <section id="musictech" className="mx-auto w-full max-w-5xl px-3 py-8 sm:px-6 md:py-12">
      <div className="md:mr-28">
        <WindowFrame
          title="Music Tech"
          windowId="musictech"
          defaultCollapsed
          statusFields={[`${media.length} object(s)`]}
        >
          <p className="mb-4 max-w-[60ch] text-[11px] leading-relaxed">
            I enjoy the combination of music and technology.
          </p>
          <MediaGrid items={media} />
        </WindowFrame>
      </div>
    </section>
  );
}
