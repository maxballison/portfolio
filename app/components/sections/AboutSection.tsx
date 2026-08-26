import { WindowFrame } from "@/app/components/WindowFrame";

const links = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/max-allison-496677238/" },
  { label: "GitHub", href: "https://github.com/maxballison" },
  { label: "Email", href: "mailto:maxballison2003@gmail.com" },
];

export function AboutSection() {
  return (
    <section id="about" className="mx-auto w-full max-w-5xl px-3 py-8 pb-16 sm:px-6 md:py-12">
      <div className="max-w-lg md:ml-28">
        <WindowFrame title="About Max Allison" windowId="about">
          <div className="space-y-3 text-[11px] leading-relaxed">
            <p>
              At my day job, I use software to design and build systems. The
              rest of the time, I build things with my hands, ears, and eyes.
            </p>
            <p>
              I was born and raised in southwestern Ohio, got my Computer
              Science degree at Harvard, and moved to San Francisco for my
              career. I like to sing, act, and make interesting things.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {links.map((link) => (
              <a key={link.label} href={link.href}>
                <button type="button" tabIndex={-1}>
                  {link.label}
                </button>
              </a>
            ))}
          </div>
        </WindowFrame>
      </div>
    </section>
  );
}
