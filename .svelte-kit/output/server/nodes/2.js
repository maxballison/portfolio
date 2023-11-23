import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.997ca81d.js","_app/immutable/chunks/scheduler.16623d43.js","_app/immutable/chunks/index.41a3c3dd.js","_app/immutable/chunks/IconBase.e938d75f.js","_app/immutable/chunks/store.21ae0d8e.js","_app/immutable/chunks/index.581fdf32.js"];
export const stylesheets = ["_app/immutable/assets/2.b03a25bb.css","_app/immutable/assets/IconBase.6bf551a2.css"];
export const fonts = [];
