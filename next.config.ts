import type { NextConfig } from "next";

// Set by the GitHub Pages workflow. Empty for local dev and for the
// maxballison.com custom domain (served from the root); "/portfolio" when
// served from the github.io project-site subpath.
// Next rejects a bare "/" basePath, so normalize it away.
const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath = raw.replace(/\/+$/, "");

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
