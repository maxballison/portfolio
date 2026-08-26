export type Project = {
  id: string;
  name: string;
  /** Display title; the repo name is shown separately as the source link. */
  title: string;
  description: string;
  stack: string[];
  status: "live" | "in progress" | "source only";
  /** Playable/viewable build. Omit when there is nothing to run in a browser. */
  liveHref?: string;
  repoHref: string;
};

export const projects: Project[] = [
  {
    id: "wastema",
    name: "WasteMA",
    title: "Waste & Equity in Massachusetts",
    description:
      "Interactive map of all 351 Massachusetts municipalities, showing where curbside trash and recycling coverage stops and how those gaps line up with income, property wealth, and race.",
    stack: ["React", "Vite", "D3"],
    status: "live",
    liveHref: "https://maxballison.github.io/WasteMA/",
    repoHref: "https://github.com/maxballison/WasteMA",
  },
  {
    id: "dao",
    name: "Dao",
    title: "Dao",
    description:
      "Turns the emotional arc of a text into a painting and a piece of music at the same time. Each book is split into sections scored for emotion; the dominant feeling picks the chord while particles paint a flow field in step with the audio clock.",
    stack: ["p5.js", "Tone.js", "Python"],
    status: "live",
    liveHref: "https://maxballison.github.io/Dao/",
    repoHref: "https://github.com/maxballison/Dao",
  },
  {
    id: "self-driving",
    name: "self_driving",
    title: "Self Driving",
    description:
      "Puzzle game where you program the car instead of steering it. Write code in an in-game editor to route a self-driving taxi through each level and get its passengers where they are going.",
    stack: ["Godot", "GDScript"],
    status: "source only",
    repoHref: "https://github.com/maxballison/self_driving",
  },
  {
    id: "cs175final",
    name: "CS175Final",
    title: "Game of Life in 3D",
    description:
      "Conway's Game of Life rebuilt in three dimensions, where cells live and die in a voxel grid instead of on a flat board. Currently being ported to WebGL so it can run in the browser.",
    stack: ["C++", "GLSL", "OpenGL"],
    status: "in progress",
    repoHref: "https://github.com/maxballison/CS175Final",
  },
  {
    id: "love-notes",
    name: "love-notes",
    title: "Love Notes",
    description:
      "Hand-drawn envelopes open and type out love notes, some written by people and some by language models, each scored for how positive and how original it is.",
    stack: ["p5.js"],
    status: "live",
    liveHref: "https://maxballison.github.io/love-notes/",
    repoHref: "https://github.com/maxballison/love-notes",
  },
];
