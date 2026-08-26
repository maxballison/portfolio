/**
 * Prefixes a root-relative asset path with the deploy base path.
 *
 * On GitHub Pages the site is served from /portfolio/, not the domain root.
 * next/image and next/link handle basePath automatically, but raw URLs in
 * <audio src>, <video src>, and fetch() do not, so route those through here.
 *
 * NEXT_PUBLIC_BASE_PATH is set at build time (see .github/workflows/deploy.yml)
 * and is empty for local development and root-domain deploys.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!BASE_PATH) return path;
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
