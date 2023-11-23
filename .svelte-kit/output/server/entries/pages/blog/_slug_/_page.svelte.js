import { c as create_ssr_component, v as validate_component, e as escape, a as add_attribute } from "../../../../chunks/ssr.js";
import { I as IconBase } from "../../../../chunks/IconBase.js";
const FaExternalLinkAlt = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({}, { viewBox: "0 0 576 512" }, $$props), {}, {
    default: () => {
      return `<path d="M576 24v127.984c0 21.461-25.96 31.98-40.971 16.971l-35.707-35.709-243.523 243.523c-9.373 9.373-24.568 9.373-33.941 0l-22.627-22.627c-9.373-9.373-9.373-24.569 0-33.941L442.756 76.676l-35.703-35.705C391.982 25.9 402.656 0 424.024 0H552c13.255 0 24 10.745 24 24zM407.029 270.794l-16 16A23.999 23.999 0 0 0 384 303.765V448H64V128h264a24.003 24.003 0 0 0 16.97-7.029l16-16C376.089 89.851 365.381 64 344 64H48C21.49 64 0 85.49 0 112v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V287.764c0-21.382-25.852-32.09-40.971-16.97z"></path>`;
    }
  })}`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".articleContainer.svelte-1k1pouv.svelte-1k1pouv.svelte-1k1pouv{width:100%;max-width:350px;display:flex;justify-content:center;box-sizing:border-box;text-align:center;padding:0;margin:50px 10px 0;text-align:center}h1.svelte-1k1pouv.svelte-1k1pouv.svelte-1k1pouv{font-weight:700;text-align:start;margin:0}.title.svelte-1k1pouv.svelte-1k1pouv.svelte-1k1pouv{display:flex}.article.svelte-1k1pouv img{max-width:80%}.article.svelte-1k1pouv.svelte-1k1pouv.svelte-1k1pouv{text-align:start;box-sizing:border-box;font-weight:700;display:flex;flex-direction:column;padding:30px;width:100%;border-radius:5px}.icon.svelte-1k1pouv.svelte-1k1pouv.svelte-1k1pouv{width:20px;height:20px;margin-left:10px}.article.svelte-1k1pouv>h1.svelte-1k1pouv>a.svelte-1k1pouv{color:white}.article.svelte-1k1pouv.svelte-1k1pouv.svelte-1k1pouv:hover{cursor:pointer}@media(min-width: 900px){.articleContainer.svelte-1k1pouv.svelte-1k1pouv.svelte-1k1pouv{padding:0;max-width:900px}.article.svelte-1k1pouv>h1.svelte-1k1pouv.svelte-1k1pouv{font-size:48px;margin:50px 0 0 0}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let article = data.article;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-38ahpm_START -->${$$result.title = `<title>Gianmarco Cavallo — ${escape(article?.title || "Missing article")}</title>`, ""}<!-- HEAD_svelte-38ahpm_END -->`, ""} <div class="articleContainer svelte-1k1pouv"><div class="article svelte-1k1pouv">${article ? `<h1 class="title svelte-1k1pouv"><a${add_attribute("href", article.url, 0)} target="_blank" rel="noreferrer" class="svelte-1k1pouv">${escape(article.title)}</a> <a class="icon svelte-1k1pouv"${add_attribute("href", article.url, 0)} target="_blank">${validate_component(FaExternalLinkAlt, "FaExternalLinkAlt").$$render($$result, {}, {}, {})}</a></h1> <!-- HTML_TAG_START -->${article.body_html}<!-- HTML_TAG_END -->` : ``}</div> </div>`;
});
export {
  Page as default
};
