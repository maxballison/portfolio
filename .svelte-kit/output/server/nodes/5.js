import * as universal from '../entries/pages/blog/_slug_/_page.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_slug_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/blog/[slug]/+page.ts";
export const imports = ["_app/immutable/nodes/5.e6fa1814.js","_app/immutable/chunks/Constants.36967d1c.js","_app/immutable/chunks/scheduler.16623d43.js","_app/immutable/chunks/index.41a3c3dd.js","_app/immutable/chunks/IconBase.e938d75f.js"];
export const stylesheets = ["_app/immutable/assets/5.8dc4f1d3.css","_app/immutable/assets/IconBase.6bf551a2.css"];
export const fonts = [];
