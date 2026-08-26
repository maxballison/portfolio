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
            `${liveCount} live`,
            "Placeholder entries",
          ]}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <fieldset key={project.id}>
                <legend>{project.name}</legend>
                <p className="text-[11px] leading-relaxed">{project.description}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-[11px]">
                    Status: <strong>{project.status}</strong>
                    {" | "}
                    {project.stack.join(", ")}
                  </span>
                  {project.href && (
                    <a href={project.href}>
                      <button type="button" tabIndex={-1}>
                        Open
                      </button>
                    </a>
                  )}
                </div>
              </fieldset>
            ))}
          </div>
        </WindowFrame>
      </div>
    </section>
  );
}
