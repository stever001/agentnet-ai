import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Main visible desktop links
  const navLinks = [
    { name: "About", path: "/about" },
    { name: "Standards", path: "/standards" },
    { name: "Docs", path: "/docs" },
    { name: "Admin", path: "/admin" },
  ];

  // Extra pages for the hamburger (now includes Home)
  const extraLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Agents", path: "/agents" },
    { name: "Capsules", path: "/capsules" },
    { name: "Viewer", path: "/viewer" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
        {/* LEFT: Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 text-slate-900 hover:opacity-80 transition"
        >
          <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-tight">AgentNet</span>
            <span className="text-xs text-slate-500 -mt-1">
              Machine-Centric Web
            </span>
          </div>
        </Link>

        {/* RIGHT: Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Hamburger Icon — always visible */}
        <button
          className="text-slate-700 hover:text-slate-900 ml-4"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={26} />
        </button>
      </nav>

      {/* BACKDROP */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* SLIDE-IN PANEL (frosted-glass style) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } bg-white/70 backdrop-blur-md shadow-xl border-l border-white/30`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50">
          <span className="text-lg font-semibold text-slate-900">Menu</span>
          <button
            className="text-slate-700 hover:text-slate-900"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col px-6 py-4 space-y-2">
          {[...extraLinks, ...navLinks].map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block text-sm py-2 ${
                  isActive
                    ? "text-slate-900 font-semibold"
                    : "text-slate-700 hover:text-slate-900"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
