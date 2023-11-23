import { c as create_ssr_component, e as escape, n as null_to_empty, a as add_attribute, v as validate_component, b as each, g as getContext, d as subscribe } from "../../chunks/ssr.js";
import { I as IconBase } from "../../chunks/IconBase.js";
import { w as writable } from "../../chunks/index2.js";
import { E as Email } from "../../chunks/Constants.js";
const Hamburger_svelte_svelte_type_style_lang = "";
const css$5 = {
  code: "svg.svelte-15fktif.svelte-15fktif{min-height:24px;transition:transform 0.3s ease-in-out}svg.svelte-15fktif line.svelte-15fktif{stroke:currentColor;stroke-width:3;transition:transform 0.3s ease-in-out}button.svelte-15fktif.svelte-15fktif{color:white;background:transparent;border:transparent;display:flex;justify-content:center;align-items:center;z-index:20}.open.svelte-15fktif svg.svelte-15fktif{transform:scale(0.7)}.open.svelte-15fktif #top.svelte-15fktif{transform:translate(6px, 0px) rotate(45deg)}.open.svelte-15fktif #middle.svelte-15fktif{stroke-dasharray:0;stroke-dashoffset:0;animation:svelte-15fktif-fade 1s ease-in alternate forwards}@keyframes svelte-15fktif-fade{to{stroke-dashoffset:1000;stroke-dasharray:1000}}.open.svelte-15fktif #bottom.svelte-15fktif{transform:translate(-12px, 9px) rotate(-45deg)}",
  map: null
};
const Hamburger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { open = false } = $$props;
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  $$result.css.add(css$5);
  return `<button aria-label="menu-burger-button" class="${[
    "text-gray-500 hover:text-gray-700 cursor-pointer mr-4 border-none focus:outline-none svelte-15fktif",
    open ? "open" : ""
  ].join(" ").trim()}" data-svelte-h="svelte-1x3lald"><svg width="32" height="24" class="svelte-15fktif"><line id="top" x1="0" y1="2" x2="32" y2="2" class="svelte-15fktif"></line><line id="middle" x1="0" y1="12" x2="32" y2="12" class="svelte-15fktif"></line><line id="bottom" x1="0" y1="22" x2="32" y2="22" class="svelte-15fktif"></line></svg> </button>`;
});
const Logo = "/_app/immutable/assets/logo.956235e0.svg";
const routes = [
  {
    href: "/",
    label: "Home"
  },
  {
    href: "/projects",
    label: "Projects"
  },
  {
    href: "/about",
    label: "About"
  }
];
const NavBar_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: ".logo{cursor:pointer;height:30px;width:30px}.open.svelte-1v1qm2z.svelte-1v1qm2z{flex-direction:column !important;align-items:center !important;height:330px !important;transition:height 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955)}.selected.svelte-1v1qm2z.svelte-1v1qm2z{position:relative;color:white}.button.svelte-1v1qm2z.svelte-1v1qm2z:hover::after{content:'';background:#ca3c25;display:block;height:3px;width:100%;position:absolute;bottom:0}.button.selected.svelte-1v1qm2z.svelte-1v1qm2z:after{content:'';background:#ca3c25;display:block;height:3px;width:100%;position:absolute;bottom:0}.innerContainer.svelte-1v1qm2z.svelte-1v1qm2z{display:flex;justify-content:space-between;align-items:center;width:100%;max-width:900px;box-sizing:border-box}.innerContainer.svelte-1v1qm2z a{height:30px;color:white}.NavBar.svelte-1v1qm2z.svelte-1v1qm2z{display:flex;flex-direction:column;justify-content:space-between;align-items:center;width:100%;max-width:900px;box-sizing:border-box;padding:20px;height:80px;overflow:hidden;transition:height 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955)}.buttons.svelte-1v1qm2z.svelte-1v1qm2z{display:none;justify-content:space-between;align-items:center;font-weight:500}.responsiveButtons.svelte-1v1qm2z.svelte-1v1qm2z{margin-top:20px;width:100%;display:flex !important;flex-direction:column}.responsiveButtons.svelte-1v1qm2z .button.svelte-1v1qm2z{max-width:100px;width:100%;text-align:center}.buttons.svelte-1v1qm2z .button.svelte-1v1qm2z{padding:0;cursor:pointer;transition:color 0.2s ease-in-out;text-decoration:none;position:relative;margin:10px;color:hsla(0, 0%, 100%, 0.4)}.button.selected.svelte-1v1qm2z.svelte-1v1qm2z{color:white}.burger.svelte-1v1qm2z button{margin:0}@media(min-width: 900px){.NavBar.svelte-1v1qm2z.svelte-1v1qm2z{padding:20px 0;display:flex;flex-direction:column;justify-content:center;align-items:center;max-width:900px;margin:0 auto}.buttons.svelte-1v1qm2z.svelte-1v1qm2z{display:flex}.NavBar.svelte-1v1qm2z .burger.svelte-1v1qm2z{display:none !important}.responsiveButtons.svelte-1v1qm2z.svelte-1v1qm2z{display:none !important}}",
  map: null
};
const NavBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let opened = false;
  let { segment } = $$props;
  if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0)
    $$bindings.segment(segment);
  $$result.css.add(css$4);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="${escape(null_to_empty(opened ? "NavBar open" : "NavBar"), true) + " svelte-1v1qm2z"}"><div class="innerContainer svelte-1v1qm2z"><a href="/"><img${add_attribute("src", Logo, 0)} alt="logo" class="logo"></a> <div class="burger svelte-1v1qm2z">${validate_component(Hamburger, "Burger").$$render(
      $$result,
      { open: opened },
      {
        open: ($$value) => {
          opened = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="buttons svelte-1v1qm2z">${each(routes, (route) => {
      return `<a class="${escape(null_to_empty(`button ${segment === route.href ? "selected" : ""}`), true) + " svelte-1v1qm2z"}"${add_attribute("href", route.href, 0)}>${escape(route.label)}</a>`;
    })}</div></div> <div class="responsiveButtons buttons svelte-1v1qm2z">${each(routes, (route) => {
      return `<a class="${escape(null_to_empty(`button ${segment === route.href ? "selected" : ""}`), true) + " svelte-1v1qm2z"}"${add_attribute("href", route.href, 0)}>${escape(route.label)}</a>`;
    })}</div> </div>`;
  } while (!$$settled);
  return $$rendered;
});
const Button_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ".button.svelte-1hqedx4{cursor:pointer;height:40px;max-width:200px;border-radius:10px;background:#ca3c25;background-size:150% 150%;display:flex;justify-content:center;align-items:center;font-weight:500}.button.svelte-1hqedx4:hover{animation:gradient 2s ease infinite}",
  map: null
};
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<div class="button svelte-1hqedx4" role="button" tabindex="0">${slots.default ? slots.default({}) : ``} </div>`;
});
const FaCopy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({}, { viewBox: "0 0 448 512" }, $$props), {}, {
    default: () => {
      return `<path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"></path>`;
    }
  })}`;
});
const Tooltip_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: ".container.svelte-xp1qch{width:14px;height:20px;z-index:200}[data-tooltip].svelte-xp1qch{position:relative;z-index:2;display:block}[data-tooltip].svelte-xp1qch:before,[data-tooltip].svelte-xp1qch:after{visibility:hidden;opacity:0;pointer-events:none;transition:0.2s ease-out;transform:translate(-50%, 5px)}[data-tooltip].svelte-xp1qch:before{position:absolute;bottom:100%;left:50%;margin-bottom:5px;padding:7px;width:100%;min-width:70px;max-width:250px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;background-color:#000;background-color:hsla(0, 0%, 20%, 0.9);color:#fff;content:attr(data-tooltip);text-align:center;font-size:14px;line-height:1.2;transition:0.2s ease-out}[data-tooltip].svelte-xp1qch:after{position:absolute;bottom:100%;left:50%;width:0;border-top:5px solid #000;border-top:5px solid hsla(0, 0%, 20%, 0.9);border-right:5px solid transparent;border-left:5px solid transparent;content:' ';font-size:0;line-height:0}[data-tooltip].svelte-xp1qch:hover:before,[data-tooltip].svelte-xp1qch:hover:after{visibility:visible;opacity:1;transform:translate(-50%, 0)}[data-tooltip='false'].svelte-xp1qch:hover:before,[data-tooltip='false'].svelte-xp1qch:hover:after{visibility:hidden;opacity:0}",
  map: null
};
const Tooltip = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { tooltip } = $$props;
  if ($$props.tooltip === void 0 && $$bindings.tooltip && tooltip !== void 0)
    $$bindings.tooltip(tooltip);
  $$result.css.add(css$2);
  return `<div${add_attribute("data-tooltip", tooltip, 0)} class="container svelte-xp1qch">${slots.default ? slots.default({}) : ``} </div>`;
});
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
const modalOpened = writable(false);
const customBackground = writable("#0a0908");
const Modal_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".modal.svelte-16oogs0.svelte-16oogs0{position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100vh;z-index:2000;display:flex;justify-content:center;align-items:center}@keyframes svelte-16oogs0-slidein{from{opacity:0}to{opacity:1}}.backdrop.svelte-16oogs0.svelte-16oogs0{position:absolute;width:100%;height:100%;background-color:rgba(0, 0, 0, 0.5);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);animation:svelte-16oogs0-slidein 0.3s ease-in-out}@keyframes svelte-16oogs0-openModalAnimation{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}.content-wrapper.svelte-16oogs0.svelte-16oogs0{z-index:10;max-width:70vw;border-radius:0.3rem;overflow:hidden;padding:30px;border-radius:25px;background:linear-gradient(155deg, rgba(255, 255, 255, 0.15), transparent);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);box-shadow:2px 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 0 2px rgba(255, 255, 255, 0.1);animation:svelte-16oogs0-openModalAnimation 0.3s ease-in-out}@keyframes svelte-16oogs0-slideOut{from{opacity:1}to{opacity:0}}@keyframes svelte-16oogs0-closeModalAnimation{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(0)}}.closing.svelte-16oogs0 .backdrop.svelte-16oogs0{animation:svelte-16oogs0-slideOut 0.3s ease-in-out}.closing.svelte-16oogs0 .content-wrapper.svelte-16oogs0{animation:svelte-16oogs0-closeModalAnimation 0.3s ease-in-out}.content.svelte-16oogs0.svelte-16oogs0{max-height:50vh;overflow:hidden}@media(min-width: 900px){.content-wrapper.svelte-16oogs0.svelte-16oogs0{padding:50px;min-width:400px}}",
  map: null
};
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isOpen = false;
  let closing = false;
  modalOpened.subscribe((value) => {
    closing = false;
    isOpen = value;
  });
  $$result.css.add(css$1);
  return `${isOpen ? `<div class="${escape(null_to_empty(`modal ${closing && "closing"}`), true) + " svelte-16oogs0"}"><div class="backdrop svelte-16oogs0" role="button" tabindex="0"></div> <div class="content-wrapper svelte-16oogs0"><div class="content svelte-16oogs0">${slots.content ? slots.content({}) : ``}</div></div></div>` : ``}`;
});
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".svelte-wc58ph.svelte-wc58ph.svelte-wc58ph{box-sizing:border-box}#svelte{width:100vw;height:100%;max-width:900px;display:flex;flex-direction:column;justify-content:space-between}html,body{transition:background-color .2s ease 0s;position:relative;width:100%;height:100%;overflow:auto;font-family:'Geologica', monospace;background-color:#0C0317}body{background-size:200% 200%;color:white;margin:0;box-sizing:border-box;display:grid;line-height:1.75;place-items:center;height:100%;overflow-x:hidden}h1{border:0}::selection{color:white;background:#ca3c25}::-webkit-scrollbar{width:8px;height:8px;border-radius:1px}::-webkit-scrollbar-thumb{background-color:#fafffd;border-radius:3px}::-webkit-scrollbar-track{background-color:transparent;border-radius:1px}@media(min-width: 900px){body{padding:0 100px}}a{text-decoration:none}a{text-decoration:none}a.svelte-wc58ph.svelte-wc58ph.svelte-wc58ph{color:rgb(0, 100, 200);text-decoration:none}a.svelte-wc58ph.svelte-wc58ph.svelte-wc58ph:hover{text-decoration:underline}a.svelte-wc58ph.svelte-wc58ph.svelte-wc58ph:visited{color:rgb(0, 80, 160)}.modalContainer.svelte-wc58ph div.svelte-wc58ph.svelte-wc58ph{display:flex;margin-bottom:20px}.modalContainer.svelte-wc58ph p.svelte-wc58ph.svelte-wc58ph{margin:0}.tooltip{visibility:hidden}.cookieContainer.svelte-wc58ph.svelte-wc58ph.svelte-wc58ph{background:white;border-radius:0px;text-align:center;width:100%;height:30px;color:black;padding:30px;display:flex;justify-content:space-evenly;align-items:center;position:fixed;bottom:0px;left:0;right:0;margin-left:auto;margin-right:auto}.cookieContainer.svelte-wc58ph>p.svelte-wc58ph>a.svelte-wc58ph{text-decoration:underline}.cookieContainer.svelte-wc58ph>div.svelte-wc58ph.svelte-wc58ph{cursor:pointer}footer.svelte-wc58ph.svelte-wc58ph.svelte-wc58ph{font-size:16px;font-weight:400;padding:30px 0;max-width:900px;text-align:center;width:100%}@media(min-width: 900px){.tooltip{visibility:visible}}@media(min-width: 600px){.cookieContainer.svelte-wc58ph.svelte-wc58ph.svelte-wc58ph{background:white;border-radius:50px;text-align:center;width:350px;height:30px;color:black;padding:0 10px;display:flex;justify-content:space-evenly;align-items:center;position:fixed;bottom:50px;left:0;right:0;margin-left:auto;margin-right:auto}}",
  map: null
};
const cookieEnabled = false;
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let showCookieModal;
  let $$unsubscribe_customBackground;
  let $page, $$unsubscribe_page;
  $$unsubscribe_customBackground = subscribe(customBackground, (value) => value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css);
  showCookieModal = false;
  $$unsubscribe_customBackground();
  $$unsubscribe_page();
  return ` ${showCookieModal && cookieEnabled ? `<div class="cookieContainer svelte-wc58ph"><p class="svelte-wc58ph" data-svelte-h="svelte-1iwts5v">🍪 This website use <a href="privacy-policy" class="svelte-wc58ph">Cookies.</a></p> <div role="button" tabindex="0" class="svelte-wc58ph" data-svelte-h="svelte-1bl8vgs">✕</div></div>` : ``} ${validate_component(Modal, "Modal").$$render($$result, {}, {}, {
    content: () => {
      return `<div slot="content" class="modalContainer svelte-wc58ph"><h1 class="svelte-wc58ph" data-svelte-h="svelte-7qu70e">Email:</h1> <div class="svelte-wc58ph"><p class="svelte-wc58ph">${escape(Email)}</p>
			 
			<div class="tooltip svelte-wc58ph">${validate_component(Tooltip, "Tooltip").$$render($$result, { tooltip: "Copy" }, {}, {
        default: () => {
          return `<div id="clipboard" role="button" tabindex="0" class="svelte-wc58ph"><div class="svelte-wc58ph">${validate_component(FaCopy, "FaCopy").$$render($$result, {}, {}, {})}</div></div>`;
        }
      })}</div></div> ${validate_component(Button, "Button").$$render($$result, {}, {}, {
        default: () => {
          return `Send Email`;
        }
      })}</div>`;
    }
  })} ${validate_component(NavBar, "Navbar").$$render($$result, { segment: $page.url.pathname }, {}, {})} ${slots.default ? slots.default({}) : ``} <footer class="svelte-wc58ph" data-svelte-h="svelte-hdb48g"></footer>`;
});
export {
  Layout as default
};
