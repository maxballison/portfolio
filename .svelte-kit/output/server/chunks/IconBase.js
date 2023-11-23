import { c as create_ssr_component, a as add_attribute, e as escape } from "./ssr.js";
const IconBase_svelte_svelte_type_style_lang = "";
const css = {
  code: "svg.svelte-c8tyih{stroke:currentColor;fill:currentColor;stroke-width:0;width:100%;height:auto;max-height:100%}",
  map: null
};
const IconBase = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = null } = $$props;
  let { viewBox } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  $$result.css.add(css);
  return `<svg xmlns="http://www.w3.org/2000/svg"${add_attribute("viewBox", viewBox, 0)} class="svelte-c8tyih">${title ? `<title>${escape(title)}</title>` : ``}${slots.default ? slots.default({}) : ``}</svg>`;
});
export {
  IconBase as I
};
