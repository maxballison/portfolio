"use client";

import { WindowFrame } from "@/app/components/WindowFrame";
import { MediaGrid, type MediaItem } from "@/app/components/MediaGrid";

const media: MediaItem[] = [
  { kind: "video", src: "/band/boomboomsauce.mp4", alt: "Boom Boom Sauce performing live" },
  { kind: "image", src: "/band/20240407-606A2122.jpg", alt: "Boom Boom Sauce on stage" },
  { kind: "image", src: "/band/IMG_2404.jpg", alt: "Boom Boom Sauce band photo" },
  { kind: "image", src: "/band/IMG_2408.jpg", alt: "Boom Boom Sauce band photo" },
];

export function BandSection() {
  return (
    <section id="band" className="mx-auto w-full max-w-5xl px-3 py-8 sm:px-6 md:py-12">
      <div className="md:ml-12 md:mr-16">
        <WindowFrame
          title="I'm in a band - Boom Boom Sauce"
          windowId="band"
          defaultCollapsed
          statusFields={[`${media.length} object(s)`]}
        >
          <p className="mb-4 max-w-[60ch] text-[11px] leading-relaxed">
            I was in a band called Boom Boom Sauce. We opened for Daya and
            Tinashe.
          </p>
          <MediaGrid items={media} />
        </WindowFrame>
      </div>
    </section>
  );
}
