import { useState } from "react";

function Section({ title, children }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-10">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", text: "" });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    setStatus({ type: "loading", text: "Sending..." });

    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

      const res = await fetch(`${API_BASE}/api/v1/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status} ${txt}`);
      }

      setStatus({ type: "success", text: "Message sent ✅" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: "Failed to send message." });
    }
  }

  return (
    <Section title="Contact">
      <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="text-sm font-semibold text-neutral-800">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-neutral-800">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300"
            placeholder="you@email.com"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-neutral-800">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={onChange}
            rows={5}
            className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300"
            placeholder="Write your message..."
            required
          />
        </div>

        <button
          type="submit"
          className="rounded-xl border border-neutral-300 bg-neutral-900 text-white px-4 py-2 text-sm font-semibold hover:bg-neutral-800 disabled:opacity-60"
          disabled={status.type === "loading"}
        >
          {status.type === "loading" ? "Sending..." : "Send"}
        </button>

        {status.type !== "idle" && (
          <p
            className={`text-sm ${
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
      </form>
    </Section>
  );
}