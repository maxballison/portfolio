

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/projects/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.d2a6bd95.js","_app/immutable/chunks/scheduler.16623d43.js","_app/immutable/chunks/index.41a3c3dd.js","_app/immutable/chunks/each.e59479a4.js"];
export const stylesheets = ["_app/immutable/assets/7.802a6ffc.css"];
export const fonts = [];
