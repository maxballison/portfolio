import type { NextConfig } from "next";

// Set by the GitHub Pages workflow (project sites are served from /<repo>/).
// Empty locally and for root-domain deploys.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static HTML export: GitHub Pages serves files, it does not run a server.
  output: "export",
  basePath: basePath || undefined,
  // Directory-style URLs so Pages resolves routes without a server rewrite.
  trailingSlash: true,
  images: {
    // The Next image optimizer needs a server; export requires raw images.
    unoptimized: true,
  },
};

export default nextConfig;
