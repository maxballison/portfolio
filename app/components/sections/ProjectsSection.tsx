import { projects } from "@/app/data/projects";
import { WindowFrame } from "@/app/components/WindowFrame";

export function ProjectsSection() {
  const liveCount = projects.filter((p) => p.status === "live").length;

  return (
    <section id="projects" className="mx-auto w-full max-w-5xl px-3 py-8 sm:px-6 md:py-12">
      <div className="md:ml-16">
        <WindowFrame
          title="Projects"
          windowId="projects"
          statusFields={[
            `${projects.length} object(s)`,
            `${liveCount} playable in browser`,
          ]}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <fieldset key={project.id}>
                <legend>{project.title}</legend>
                <p className="text-[11px] leading-relaxed">{project.description}</p>
                <p className="mt-2 text-[11px]">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={`led ${project.status === "live" ? "led-on" : ""}`}
                      aria-hidden="true"
                    />
                    {project.status}
                  </span>
                  {" | "}
                  {project.stack.join(", ")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.liveHref && (
                    <a href={project.liveHref} target="_blank" rel="noreferrer">
                      <button type="button" tabIndex={-1} className="default">
                        Open
                      </button>
                    </a>
                  )}
                  <a href={project.repoHref} target="_blank" rel="noreferrer">
                    <button type="button" tabIndex={-1}>
                      Source
                    </button>
                  </a>
                </div>
              </fieldset>
            ))}
          </div>
        </WindowFrame>
      </div>
    </section>
  );
}
