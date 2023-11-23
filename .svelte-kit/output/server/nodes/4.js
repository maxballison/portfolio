import * as universal from '../entries/pages/blog/_page.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/blog/+page.ts";
export const imports = ["_app/immutable/nodes/4.ff8d25ad.js","_app/immutable/chunks/Constants.36967d1c.js","_app/immutable/chunks/control.f5b05b5f.js","_app/immutable/chunks/scheduler.16623d43.js","_app/immutable/chunks/index.41a3c3dd.js","_app/immutable/chunks/each.e59479a4.js"];
export const stylesheets = ["_app/immutable/assets/4.4a8ee423.css"];
export const fonts = [];
