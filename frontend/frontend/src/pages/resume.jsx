// src/pages/Resume.jsx
import resume from "../data/resume.json";

function Section({ title, children }) {
  return (
    <section className="mt-7">
      <h2 className="text-xs font-bold tracking-[0.25em] text-neutral-700 uppercase">
        {title}
      </h2>
      <div className="mt-2 border-t border-neutral-200 pt-4">{children}</div>
    </section>
  );
}

function RowTop({ left, right }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
      <div className="min-w-0">{left}</div>
      <div className="shrink-0 text-sm text-neutral-600">{right}</div>
    </div>
  );
}

export default function Resume() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-10">
      {/* Header */}
      <header>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {resume.name}
        </h1>

        <div className="mt-2 text-sm text-neutral-700">
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
            <span>{resume.locationLine}</span>
            <span className="hidden sm:inline text-neutral-400">|</span>
            <span>{resume.contactLine}</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {resume.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="underline underline-offset-4 hover:text-neutral-900"
                target="_blank"
                rel="noreferrer"
              >
                {l.href.replace("https://", "")}
              </a>
            ))}
          </div>

          <div className="mt-2 space-y-1">
            {resume.meta.map((m, idx) => (
              <p key={idx} className="text-neutral-700">
                {m}
              </p>
            ))}
          </div>
        </div>
      </header>

      {/* Work Experience */}
      <Section title="WORK EXPERIENCE">
        <div className="space-y-6">
          {resume.workExperience.map((w, idx) => (
            <div key={idx}>
              <RowTop
                left={<p className="font-semibold text-neutral-900">{w.company}</p>}
                right={w.dates}
              />
              <p className="text-neutral-800">
                <span className="font-medium">{w.role}</span>{" "}
                <span className="text-neutral-600">— {w.location}</span>
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-neutral-800">
                {w.bullets.map((b, i) => (
                  <li key={i} className="leading-relaxed">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Education */}
      <Section title="EDUCATION">
        <div className="space-y-5">
          {resume.education.map((e, idx) => (
            <div key={idx}>
              <RowTop
                left={<p className="font-semibold text-neutral-900">{e.school}</p>}
                right={e.dates}
              />
              <p className="text-neutral-800">
                <span className="font-medium">{e.program}</span>{" "}
                <span className="text-neutral-600">— {e.location}</span>
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Certifications */}
      <Section title="CERTIFICATIONS">
        <ul className="list-disc pl-5 space-y-1 text-neutral-800">
          {resume.certifications.map((c, idx) => (
            <li key={idx} className="leading-relaxed">
              {c}
            </li>
          ))}
        </ul>
      </Section>

      {/* Skills */}
      <Section title="SKILLS">
        <div className="space-y-4">
          {Object.entries(resume.skills).map(([group, items]) => (
            <div key={group}>
              <p className="font-semibold text-neutral-900">{group}:</p>
              <p className="text-neutral-800 mt-1 leading-relaxed">
                {items.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section title="PROJECTS">
        <div className="space-y-5">
          {resume.projects.map((p, idx) => (
            <div key={idx}>
              <p className="font-semibold text-neutral-900">{p.name}</p>
              <p className="text-sm text-neutral-600 mt-1">{p.tech.join(" • ")}</p>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-neutral-800">
                {p.bullets.map((b, i) => (
                  <li key={i} className="leading-relaxed">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <footer className="mt-10 pt-6 border-t border-neutral-200 text-xs text-neutral-500">
        Resume-style portfolio • React + Tailwind
      </footer>
    </div>
  );
}
