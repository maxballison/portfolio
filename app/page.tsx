import { PlayerProvider } from "@/app/components/player/PlayerProvider";
import { Taskbar } from "@/app/components/Taskbar";
import { Hero } from "@/app/components/sections/Hero";
import { BandSection } from "@/app/components/sections/BandSection";
import { MusicTechSection } from "@/app/components/sections/MusicTechSection";
import { ProjectsSection } from "@/app/components/sections/ProjectsSection";
import { AboutSection } from "@/app/components/sections/AboutSection";

export default function Home() {
  return (
    <PlayerProvider>
      {/* pb clears the fixed taskbar */}
      <main className="flex-1 pb-14">
        <Hero />
        <ProjectsSection />
        <AboutSection />
        <BandSection />
        <MusicTechSection />
      </main>
      <Taskbar />
    </PlayerProvider>
  );
}
