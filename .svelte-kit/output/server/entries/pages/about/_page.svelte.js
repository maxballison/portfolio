import { c as create_ssr_component, b as each, e as escape } from "../../../chunks/ssr.js";
const skills = {
  programming: ["Python", "C++", "p5.js", "Arduino", "SQL"],
  // devops: [],
  // databases: [''],
  // tools: [],
  languages: ["English", "Chinese"],
  other: ["Interactive Music Systems", "Data Visualization", "Art + Technology", "Cybersecurity"]
};
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".container.svelte-1x4k9zh.svelte-1x4k9zh{max-width:900px;padding:0;display:flex;justify-content:center}main.svelte-1x4k9zh.svelte-1x4k9zh{max-width:100%;min-height:500px;text-align:left;margin:0 auto;box-sizing:border-box}h1.svelte-1x4k9zh.svelte-1x4k9zh{font-weight:700;margin:0 0 50px 0;font-size:36px;text-align:start}h2.svelte-1x4k9zh.svelte-1x4k9zh{margin-top:50px}.list.svelte-1x4k9zh.svelte-1x4k9zh{display:flex;flex-direction:column;gap:30px}@media(min-width: 900px){.list.svelte-1x4k9zh.svelte-1x4k9zh{flex-direction:row}main.svelte-1x4k9zh>h1.svelte-1x4k9zh{font-size:48px}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-1a5hu6z_START -->${$$result.title = `<title>Max Allison — About</title>`, ""}<!-- HEAD_svelte-1a5hu6z_END -->`, ""} <div class="container svelte-1x4k9zh"><main class="svelte-1x4k9zh"><h1 class="svelte-1x4k9zh" data-svelte-h="svelte-soqi9t">About</h1> <p data-svelte-h="svelte-n7vs1g">I&#39;m a current junior at Harvard studying Computer Science. I have experience with interactive music systems,
			data visualizations, and cybersecurity.</p> <h2 class="svelte-1x4k9zh" data-svelte-h="svelte-1w8bmy8">Skills</h2> ${each(Object.entries(skills), ([section, technologies]) => {
    return `<ul><li><h4>${escape(section)}:</h4> <div class="list svelte-1x4k9zh">${each(technologies, (technology) => {
      return `<div>${escape(technology)} </div>`;
    })} </div></li> </ul>`;
  })}</main> </div>`;
});
export {
  Page as default
};
