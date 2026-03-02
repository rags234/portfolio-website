import { NavLink } from "react-router-dom";

const linkBase =
  "text-sm underline-offset-4 hover:underline text-neutral-700 hover:text-neutral-900";
const linkActive = "underline text-neutral-900 font-semibold";

export default function Navbar() {
  return (
    <nav className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-neutral-700">
        <span className="font-semibold text-neutral-900">Rajat</span>{" "}
        <span className="text-neutral-500">•</span>{" "}
        <span>Portfolio</span>
      </div>

      <div className="flex gap-4">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? `${linkBase} ${linkActive}` : linkBase)}
        >
          Resume
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) => (isActive ? `${linkBase} ${linkActive}` : linkBase)}
        >
          Projects
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? `${linkBase} ${linkActive}` : linkBase)}
        >
          Contact
        </NavLink>
      </div>
    </nav>
  );
}
