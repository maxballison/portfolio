import { c as create_ssr_component, b as each, e as escape, a as add_attribute } from "../../../chunks/ssr.js";
const projects = [
  {
    title: "Dao",
    technologies: ["python", "p5js", "NRCLex", "Tonejs"],
    description: "Dao is a data and music visualization of popular books and old philosophical Chinese texts. It uses a python sentiment analysis algorithm analyze the emotions present in a text and live draw pictures/create music based on the emotions in each section of the text",
    url: "https://maxballison.github.io/Dao/"
  },
  {
    title: "Notes on Love",
    technologies: ["Svelte", "python", "p5js", "gpt4"],
    description: "Notes on Love is an application meant to categorize Harvard/MIT students' perspectives on Love. It uses a database of hundreds of love letters that a small team collected. I run each letter through an algorithm that uses gpt4 give the letter values for originality and positivity, and place the letter on a graph",
    url: "https://maxballison.github.io/love-notes/"
  },
  {
    title: "3D Cellular Automata",
    technologies: ["C++", "OpenGL"],
    description: "A three-dimensional cellular automata simulation using OpenGL",
    url: "https://github.com/maxballison/CS175Final"
  }
  // {
  // 	title: 'Chippy',
  // 	technologies: ['Arduino', 'Cirucuits', 'Ableton'],
  // 	description:
  // 		"Chippy is a synthesizer and wave generator meant to replicate the sounds of retro gaming consoles.",
  // 	url: ''
  // }
];
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".projectContainer.svelte-dtt2x3.svelte-dtt2x3{width:100%;max-width:900px;display:flex;justify-content:center;box-sizing:border-box;text-align:center;padding:1em;margin:0 auto;text-align:center}.note.svelte-dtt2x3.svelte-dtt2x3{opacity:0.5;margin:0;max-width:900px;text-align:left}a.svelte-dtt2x3.svelte-dtt2x3{text-decoration:none}.projectContainer.svelte-dtt2x3 .projects.svelte-dtt2x3{display:grid;grid-template-columns:1fr;grid-gap:40px;margin-top:30px}h1.svelte-dtt2x3.svelte-dtt2x3{font-weight:700;text-align:start}h2.svelte-dtt2x3.svelte-dtt2x3{display:flex;margin:0}.project.svelte-dtt2x3.svelte-dtt2x3{text-align:start;box-sizing:border-box;display:flex;flex-direction:column;color:white;background:#111;padding:2rem;width:100%;border-radius:5px;transition:transform 0.2s ease-in-out;border-radius:25px}.project.svelte-dtt2x3 p.svelte-dtt2x3{font-weight:100;color:#708090}.projects.svelte-dtt2x3.svelte-dtt2x3{width:100%;margin:50px auto;display:grid;grid-gap:1rem;grid-template-columns:1fr;margin-bottom:10px}.techsContainer.svelte-dtt2x3.svelte-dtt2x3{display:flex;flex-wrap:wrap;gap:10px}.techs.svelte-dtt2x3.svelte-dtt2x3{display:flex;justify-content:space-between;align-items:center}.techs.svelte-dtt2x3>div.svelte-dtt2x3{margin:0 0 0 10px}.button.svelte-dtt2x3.svelte-dtt2x3{display:flex;justify-content:center;align-items:center;color:white;border:2px solid white;padding:10px}@media(min-width: 900px){.projectContainer.svelte-dtt2x3.svelte-dtt2x3{padding:0}.projects.svelte-dtt2x3>h1.svelte-dtt2x3{font-size:48px;margin:50px 0 0 0}.projects.svelte-dtt2x3.svelte-dtt2x3{grid-template-columns:1fr}.projects.svelte-dtt2x3 .project.svelte-dtt2x3{min-height:200px}.button.svelte-dtt2x3.svelte-dtt2x3{max-width:200px}}@media(min-width: 600px){.projects.svelte-dtt2x3.svelte-dtt2x3{grid-template-columns:1fr}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-1rfzkcm_START -->${$$result.title = `<title>Max Allison — Projects</title>`, ""}<!-- HEAD_svelte-1rfzkcm_END -->`, ""} <div class="projectContainer svelte-dtt2x3"><div class="projects svelte-dtt2x3"><h1 class="svelte-dtt2x3" data-svelte-h="svelte-136d6se">Projects</h1> <p class="note svelte-dtt2x3" data-svelte-h="svelte-rodo8p"></p> ${each(projects, (project) => {
    return `<div class="project svelte-dtt2x3"><div class="header"><h2 class="svelte-dtt2x3">${escape(project.title)}</h2> <div class="techsContainer svelte-dtt2x3">Technologies:
						<div class="techs svelte-dtt2x3">${each(project.technologies, (tech) => {
      return `<div class="svelte-dtt2x3">${escape(tech)}</div>`;
    })}</div> </div></div> <p class="svelte-dtt2x3">${escape(project.description)}</p> <a${add_attribute("href", project.url, 0)} target="_blank" rel="noreferrer" class="svelte-dtt2x3"><div class="button svelte-dtt2x3" data-svelte-h="svelte-1izmg24">Project url =&gt;</div></a> </div>`;
  })}</div> </div>`;
});
export {
  Page as default
};
