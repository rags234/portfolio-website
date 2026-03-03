import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
const PROJECTS_API = `${API_BASE}/api/v1/projects`;
const LOGIN_API = `${API_BASE}/api/v1/auth/login`;

const emptyProject = {
  name: "",
  tech: "",
  description: "",
  githubUrl: "",
  liveUrl: "",
};

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-neutral-800">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function getToken() {
  return localStorage.getItem("admin_token") || "";
}

function setToken(token) {
  localStorage.setItem("admin_token", token);
}

function clearToken() {
  localStorage.removeItem("admin_token");
}

export default function AdminProjects() {
  // Auth
  const [token, setTokenState] = useState(getToken());
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "" });

  // Data
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);

  // UI status
  const [status, setStatus] = useState({ type: "idle", text: "" });
  const [refreshKey, setRefreshKey] = useState(0);

  const isEditing = useMemo(() => editingId !== null, [editingId]);
  const isLoggedIn = useMemo(() => !!token, [token]);

  // Load projects (public GET, no token needed)
  useEffect(() => {
    async function load() {
      try {
        setStatus({ type: "loading", text: "Loading projects..." });
        const res = await fetch(PROJECTS_API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProjects(data);
        setStatus({ type: "idle", text: "" });
      } catch (e) {
        setStatus({ type: "error", text: "Failed to load projects." });
      }
    }
    load();
  }, [refreshKey]);

  function onLoginChange(e) {
    const { name, value } = e.target;
    setLoginForm((f) => ({ ...f, [name]: value }));
  }

  async function login(e) {
    e.preventDefault();
    setStatus({ type: "loading", text: "Logging in..." });

    try {
      const res = await fetch(LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || `Login failed (HTTP ${res.status})`);
      }

      if (data?.status !== "ok" || !data?.token) {
        throw new Error(data?.message || "Login failed.");
      }

      setToken(data.token);
      setTokenState(data.token);
      setStatus({ type: "success", text: "Logged in ✅" });
    } catch (err) {
      setStatus({ type: "error", text: err.message || "Login failed." });
    }
  }

  function logout() {
    clearToken();
    setTokenState("");
    setStatus({ type: "success", text: "Logged out ✅" });
  }

  function onProjectChange(e) {
    const { name, value } = e.target;
    setProjectForm((f) => ({ ...f, [name]: value }));
  }

  function startCreate() {
    setEditingId(null);
    setProjectForm(emptyProject);
    setStatus({ type: "idle", text: "" });
  }

  function startEdit(p) {
    setEditingId(p.id);
    setProjectForm({
      name: p.name ?? "",
      tech: p.tech ?? "",
      description: p.description ?? "",
      githubUrl: p.githubUrl ?? "",
      liveUrl: p.liveUrl ?? "",
    });
    setStatus({ type: "idle", text: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProject(e) {
    e.preventDefault();

    if (!token) {
      setStatus({ type: "error", text: "Login required to create/update projects." });
      return;
    }

    setStatus({ type: "loading", text: isEditing ? "Updating..." : "Creating..." });

    try {
      const url = isEditing ? `${PROJECTS_API}/${editingId}` : PROJECTS_API;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectForm),
      });

      const txt = await res.text();

      if (!res.ok) {
        // common: token expired / invalid => 403
        if (res.status === 401 || res.status === 403) {
          throw new Error("Not authorized. Login again (token expired?)");
        }
        throw new Error(txt || `HTTP ${res.status}`);
      }

      setStatus({
        type: "success",
        text: isEditing ? "Project updated ✅" : "Project created ✅",
      });

      startCreate();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setStatus({ type: "error", text: `Save failed: ${err.message}` });
    }
  }

  async function removeProject(id) {
    if (!token) {
      setStatus({ type: "error", text: "Login required to delete projects." });
      return;
    }

    const ok = window.confirm("Delete this project?");
    if (!ok) return;

    setStatus({ type: "loading", text: "Deleting..." });

    try {
      const res = await fetch(`${PROJECTS_API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const txt = await res.text().catch(() => "");

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Not authorized. Login again (token expired?)");
        }
        throw new Error(txt || `HTTP ${res.status}`);
      }

      setStatus({ type: "success", text: "Deleted ✅" });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setStatus({ type: "error", text: `Delete failed: ${err.message}` });
    }
  }

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Admin: Projects</h1>
          <div className="flex gap-2 items-center">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-neutral-700">Logged in</span>
                <button
                  onClick={logout}
                  className="text-sm rounded-lg border border-neutral-300 px-3 py-1 hover:bg-neutral-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="text-sm text-neutral-600">Login to manage projects</span>
            )}
          </div>
        </div>

        {!isLoggedIn && (
          <form onSubmit={login} className="mt-5 grid gap-3 max-w-md">
            <Field label="Username">
              <input
                name="username"
                value={loginForm.username}
                onChange={onLoginChange}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300"
                placeholder="admin"
                required
              />
            </Field>

            <Field label="Password">
              <input
                name="password"
                type="password"
                value={loginForm.password}
                onChange={onLoginChange}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300"
                placeholder="admin123"
                required
              />
            </Field>

            <button
              type="submit"
              disabled={status.type === "loading"}
              className="rounded-xl border border-neutral-300 bg-neutral-900 text-white px-4 py-2 text-sm font-semibold hover:bg-neutral-800 disabled:opacity-60"
            >
              {status.type === "loading" ? "Logging in..." : "Login"}
            </button>
          </form>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-10">
        <h2 className="text-lg font-bold">{isEditing ? "Edit Project" : "Create Project"}</h2>

        <form onSubmit={saveProject} className="mt-4 grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Project Name *">
              <input
                name="name"
                value={projectForm.name}
                onChange={onProjectChange}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300"
                placeholder="e.g., MERN Online Bookstore"
                required
              />
            </Field>

            <Field label="Tech *">
              <input
                name="tech"
                value={projectForm.tech}
                onChange={onProjectChange}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300"
                placeholder='e.g., "React • Spring Boot • MySQL"'
                required
              />
            </Field>
          </div>

          <Field label="Description *">
            <textarea
              name="description"
              value={projectForm.description}
              onChange={onProjectChange}
              rows={4}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300"
              placeholder="What does it do? What did you build?"
              required
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="GitHub URL">
              <input
                name="githubUrl"
                value={projectForm.githubUrl}
                onChange={onProjectChange}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300"
                placeholder="https://github.com/..."
              />
            </Field>

            <Field label="Live URL">
              <input
                name="liveUrl"
                value={projectForm.liveUrl}
                onChange={onProjectChange}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300"
                placeholder="https://..."
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={status.type === "loading"}
              className="rounded-xl border border-neutral-300 bg-neutral-900 text-white px-4 py-2 text-sm font-semibold hover:bg-neutral-800 disabled:opacity-60"
            >
              {status.type === "loading"
                ? "Saving..."
                : isEditing
                ? "Update Project"
                : "Create Project"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={startCreate}
                className="rounded-xl border border-neutral-300 bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-neutral-50"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {status.type !== "idle" && (
          <p
            className={`mt-3 text-sm ${
              status.type === "success"
                ? "text-green-700"
                : status.type === "error"
                ? "text-red-700"
                : "text-neutral-700"
            }`}
          >
            {status.text}
          </p>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-10">
        <h2 className="text-lg font-bold">Existing Projects</h2>

        <div className="mt-4 space-y-4">
          {projects.length === 0 ? (
            <p className="text-sm text-neutral-600">No projects found.</p>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="border border-neutral-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <div>
                    <p className="font-semibold text-neutral-900">{p.name}</p>
                    <p className="text-sm text-neutral-600">{p.tech}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-sm rounded-lg border border-neutral-300 px-3 py-1 hover:bg-neutral-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeProject(p.id)}
                      className="text-sm rounded-lg border border-neutral-300 px-3 py-1 hover:bg-neutral-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-sm text-neutral-800">{p.description}</p>

                <div className="mt-2 flex flex-wrap gap-3 text-sm">
                  {p.githubUrl && (
                    <a className="underline underline-offset-4" href={p.githubUrl} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  )}
                  {p.liveUrl && (
                    <a className="underline underline-offset-4" href={p.liveUrl} target="_blank" rel="noreferrer">
                      Live
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}