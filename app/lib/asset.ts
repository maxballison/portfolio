/**
 * Prefixes a root-relative asset path with the deploy base path.
 *
 * next/image and next/link handle basePath automatically, but raw URLs in
 * <audio src>, <video src>, and fetch() do not, so route those through here.
 *
 * NEXT_PUBLIC_BASE_PATH is set at build time (see .github/workflows/deploy.yml).
 * It is empty for local development and for root-domain deploys such as the
 * maxballison.com custom domain; it is "/portfolio" when served from the
 * github.io project-site subpath.
 */
export const BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

/** Trims a trailing slash and treats "/" as no prefix at all. */
function normalizeBasePath(raw: string | undefined): string {
  if (!raw) return "";
  const trimmed = raw.replace(/\/+$/, "");
  return trimmed === "" ? "" : trimmed;
}

export function asset(path: string): string {
  if (!BASE_PATH) return path;
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
