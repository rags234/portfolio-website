import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Resume from "./pages/Resume";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import AdminProjects from "./pages/AdminProjects";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-100 text-neutral-900">
        <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
          <Navbar />

          <Routes>
            <Route path="/" element={<Resume />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminProjects />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
