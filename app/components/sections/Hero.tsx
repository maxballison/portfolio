"use client";

import { PlayerDeck } from "@/app/components/player/PlayerDeck";
import { usePlayer } from "@/app/components/player/PlayerProvider";
import { WindowFrame } from "@/app/components/WindowFrame";
import { BrainLoops } from "@/app/components/BrainLoops";
import { focusWindow } from "@/app/components/windowRegistry";

export function Hero() {
  const { setPlaylistOpen } = usePlayer();

  const menuItems = [
    {
      href: "#player-anchor",
      label: <><u>M</u>usic</>,
      onClick: () => {
        setPlaylistOpen(true);
        focusWindow("player");
      },
    },
    {
      href: "#projects",
      label: <><u>P</u>rojects</>,
      onClick: () => focusWindow("projects"),
    },
    {
      href: "#about",
      label: <>A<u>b</u>out</>,
      onClick: () => focusWindow("about"),
    },
  ];

  return (
    <header id="top" className="mx-auto w-full max-w-5xl px-3 pt-8 sm:px-6 md:pt-14">
      <div className="flex flex-col gap-6">
        <div className="md:mr-24">
          <WindowFrame
            title="Welcome - Max Allison"
            windowId="welcome"
            menuBar={
              <nav aria-label="Primary" className="menu-bar">
                {menuItems.map((item) => (
                  <a key={item.href} href={item.href} onClick={item.onClick}>
                    {item.label}
                  </a>
                ))}
              </nav>
            }
            statusFields={["Ready"]}
          >
            <h1 className="text-3xl font-bold leading-tight">Max Allison</h1>
            <p className="mt-3 max-w-[48ch] text-sm">
              Software engineer and artist.
            </p>
          </WindowFrame>
        </div>

        <div className="md:ml-10 md:mr-40">
          {/* fps is per folder: more frames = faster playback reads naturally */}
          <BrainLoops fps={{ brain1: 4, brain2: 24, brain3: 12 }} />
        </div>

        <div id="player-anchor" className="md:self-end md:mr-4">
          <PlayerDeck />
        </div>
      </div>
    </header>
  );
}
