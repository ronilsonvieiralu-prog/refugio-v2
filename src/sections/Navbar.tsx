import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full border-b border-[var(--refugio-line)] bg-[var(--refugio-bg)]/80 backdrop-blur-sm fixed top-0 left-0 z-50">
      <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <NavLink
          to="/"
          className="font-serif text-2xl text-[var(--refugio-ink)]"
        >
          Refúgio
        </NavLink>

        <div className="flex gap-6 font-sans text-[var(--refugio-muted)]">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-[var(--refugio-ink)]"
                : "hover:text-[var(--refugio-ink)] transition"
            }
          >
            Início
          </NavLink>

          <NavLink
            to="/textos"
            className={({ isActive }) =>
              isActive
                ? "text-[var(--refugio-ink)]"
                : "hover:text-[var(--refugio-ink)] transition"
            }
          >
            Textos
          </NavLink>

          <NavLink
            to="/meditacoes"
            className={({ isActive }) =>
              isActive
                ? "text-[var(--refugio-ink)]"
                : "hover:text-[var(--refugio-ink)] transition"
            }
          >
            Meditações
          </NavLink>

          <NavLink
            to="/sobre"
            className={({ isActive }) =>
              isActive
                ? "text-[var(--refugio-ink)]"
                : "hover:text-[var(--refugio-ink)] transition"
            }
          >
            Sobre
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
