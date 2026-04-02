"use client";
import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { HiMail } from "react-icons/hi";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Nav = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/works", label: "Works" },
    { href: "/blogs", label: "Blogs" },
  ];

  const linkClass = (href) =>
    `px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
      pathname === href
        ? "text-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] font-medium"
        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
    }`;

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 left-0 w-full backdrop-blur-md z-50"
      style={{
        background: "color-mix(in srgb, var(--background) 85%, transparent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="DeverkCrowd home">
          <Logo width={96} height={32} />
          <span
            className="font-semibold text-base"
            style={{ color: "var(--foreground)" }}
          >
            <span style={{ color: "var(--primary)" }}>Dever</span>Crowd
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={linkClass(href)}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {/* Contact — desktop */}
          <Link
            href="/contact"
            className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: "var(--muted)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--primary)";
              e.currentTarget.style.borderColor = "color-mix(in srgb, var(--primary) 40%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--foreground)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <HiMail style={{ color: "var(--primary)" }} className="text-base" />
            Contact
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg transition-all duration-200"
            style={{
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--foreground)",
            }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {menuOpen
              ? <HiX className="text-xl" />
              : <HiMenuAlt3 className="text-xl" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
          className="md:hidden px-4 pb-4 pt-2"
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--card)",
          }}
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block mb-1 text-base ${linkClass(href)}`}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all"
              style={{
                border: "1px solid var(--border)",
                background: "var(--muted)",
                color: "var(--foreground)",
              }}
            >
              <HiMail style={{ color: "var(--primary)" }} />
              Contact us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;