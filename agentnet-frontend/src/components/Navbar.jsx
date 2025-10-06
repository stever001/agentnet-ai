import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "About", path: "/about" },
    { name: "Standards", path: "/standards" },
    { name: "Docs", path: "/docs" },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
        {/* LEFT: Logo and Tagline */}
        <Link
          to="/"
          className="flex items-center gap-3 text-slate-900 hover:opacity-80 transition"
        >
          {/* Placeholder logo */}
          <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-lg tracking-tight">AgentNet</span>
            <span className="text-sm text-slate-500 italic">
              Where Agents Play
            </span>
          </div>
        </Link>

        {/* RIGHT: Navigation links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-slate-700 hover:text-blue-700 transition ${
                  isActive ? "font-semibold text-blue-800" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-slate-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {/* Inline SVGs for Menu / Close */}
          {!menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-6 py-3 text-slate-700 hover:bg-slate-50 ${
                  isActive ? "font-semibold text-blue-700" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
