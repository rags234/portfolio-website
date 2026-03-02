import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

function Section({ title, children }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-10">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState({ type: "loading", text: "Loading..." });

  useEffect(() => {
    async function load() {
      try {
        setStatus({ type: "loading", text: "Loading..." });

        const res = await fetch(`${API_BASE}/api/v1/projects`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setProjects(data);
        setStatus({ type: "success", text: "" });
      } catch (e) {
        setStatus({
          type: "error",
          text: "Failed to load projects. Is backend running on :8080 and CORS enabled?",
        });
      }
    }

    load();
  }, []);

  return (
    <Section title="Projects">
      {status.type === "loading" && (
        <p className="text-neutral-700 text-sm">{status.text}</p>
      )}

      {status.type === "error" && (
        <p className="text-sm text-red-700">{status.text}</p>
      )}

      {status.type === "success" && (
        <div className="space-y-5">
          {projects.map((p) => (
            <div key={p.id} className="border border-neutral-200 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                <p className="font-semibold text-neutral-900">{p.name}</p>
                <p className="text-sm text-neutral-600">{p.tech}</p>
              </div>

              <p className="mt-3 text-neutral-800 leading-relaxed">
                {p.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {p.githubUrl && (
                  <a
                    className="underline underline-offset-4"
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                )}
                {p.liveUrl && (
                  <a
                    className="underline underline-offset-4"
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Live
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
