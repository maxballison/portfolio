

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/riot/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.c565232e.js","_app/immutable/chunks/scheduler.16623d43.js","_app/immutable/chunks/index.41a3c3dd.js"];
export const stylesheets = ["_app/immutable/assets/9.322873a6.css"];
export const fonts = [];
