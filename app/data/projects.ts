// PLACEHOLDER PROJECTS - swap in real work when ready.
export type Project = {
  id: string;
  name: string;
  description: string;
  stack: string[];
  status: "live" | "archived";
  href?: string;
};

export const projects: Project[] = [
  {
    id: "signal-cache",
    name: "signal-cache",
    description:
      "In-memory caching layer with pluggable eviction strategies and a tiny observability hook surface.",
    stack: ["TypeScript", "Node"],
    status: "live",
    href: "https://github.com/", // placeholder link
  },
  {
    id: "plotdeck",
    name: "plotdeck",
    description:
      "CLI that turns CSV time-series into terminal sparkline dashboards. Built to watch long jobs without a browser.",
    stack: ["Rust"],
    status: "live",
    href: "https://github.com/", // placeholder link
  },
  {
    id: "loop-station",
    name: "loop-station",
    description:
      "Browser loop pedal: record, overdub, and quantize layers with the Web Audio API. Where the music habit and the code habit overlap.",
    stack: ["React", "Web Audio"],
    status: "live",
    href: "https://github.com/", // placeholder link
  },
  {
    id: "shelfmark",
    name: "shelfmark",
    description:
      "Self-hosted reading tracker with an import pipeline for library checkout history.",
    stack: ["Python", "SQLite"],
    status: "archived",
  },
];
