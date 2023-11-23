import { c as create_ssr_component, b as each, e as escape, a as add_attribute } from "../../../chunks/ssr.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".articlesContainer.svelte-1fxyu1w.svelte-1fxyu1w{width:100%;max-width:900px;display:flex;justify-content:center;box-sizing:border-box;text-align:center;padding:1em;margin:0 auto;text-align:center}a.svelte-1fxyu1w.svelte-1fxyu1w{text-decoration:none}.articlesContainer.svelte-1fxyu1w .articles.svelte-1fxyu1w{display:grid;grid-template-columns:1fr;grid-gap:40px;margin-top:30px}h2.svelte-1fxyu1w.svelte-1fxyu1w{display:flex}.articles.svelte-1fxyu1w>h1.svelte-1fxyu1w{font-weight:700;text-align:start;margin:0;font-size:36px}.article.svelte-1fxyu1w.svelte-1fxyu1w{text-align:start;box-sizing:border-box;display:flex;flex-direction:column;color:white;background:#111;padding:2rem;width:100%;border-radius:5px;transition:transform 0.2s ease-in-out;border-radius:25px}.article.svelte-1fxyu1w p.svelte-1fxyu1w{font-weight:100;color:#708090}.articles.svelte-1fxyu1w.svelte-1fxyu1w{width:100%;margin:50px auto;display:grid;grid-gap:1rem;grid-template-columns:1fr}.button.svelte-1fxyu1w.svelte-1fxyu1w{display:flex;justify-content:center;align-items:center;color:white;border:2px solid white;padding:10px}@media(min-width: 900px){.articlesContainer.svelte-1fxyu1w.svelte-1fxyu1w{padding:0}.articles.svelte-1fxyu1w>h1.svelte-1fxyu1w{font-size:48px;margin:0 0 50px 0}.articles.svelte-1fxyu1w.svelte-1fxyu1w{grid-template-columns:1fr}.articles.svelte-1fxyu1w .article.svelte-1fxyu1w{min-height:200px}.button.svelte-1fxyu1w.svelte-1fxyu1w{max-width:200px}}@media(min-width: 600px){.articles.svelte-1fxyu1w.svelte-1fxyu1w{grid-template-columns:1fr}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let devToArticles = data.devToArticles;
  const blackListedArticles = [422939];
  const articles = [...devToArticles];
  const filteredArticles = articles.filter((article) => !blackListedArticles.includes(article?.id));
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-us3zxc_START -->${$$result.title = `<title>Max Allison — Blog</title>`, ""}<!-- HEAD_svelte-us3zxc_END -->`, ""} <div class="articlesContainer svelte-1fxyu1w"><div class="articles svelte-1fxyu1w"><h1 class="svelte-1fxyu1w" data-svelte-h="svelte-a2vclf">Articles</h1> ${each(filteredArticles, (article) => {
    return `<div class="article svelte-1fxyu1w"><div class="header"><h2 class="svelte-1fxyu1w">${escape(article.title)}</h2> <div>Tags: ${escape(article.tags || article.category)}</div></div> <p class="svelte-1fxyu1w">${escape(article.description || "")}</p> <a${add_attribute("href", article.id ? `/blog/${article.id}` : article.link, 0)}${add_attribute("target", !article.id ? "_blank" : "_self", 0)} class="svelte-1fxyu1w"><div class="button svelte-1fxyu1w" data-svelte-h="svelte-kf16rq">Read Article =&gt;</div></a> </div>`;
  })} ${filteredArticles.length === 0 ? `<div data-svelte-h="svelte-ink7a0">No Articles</div>` : ``}</div> </div>`;
});
export {
  Page as default
};
