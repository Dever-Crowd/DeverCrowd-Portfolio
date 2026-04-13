"use client";
import { useEffect, useState } from "react";
import {
  RiHomeLine,
  RiQuestionMark,
  RiStackLine,
  RiStarLine,
  RiTeamFill
} from "react-icons/ri";
import type { IconType } from "react-icons";

interface Section {
  id: string;
  label: string;
  icon: IconType;
}

const sections: Section[] = [
  { id: "hero", label: "Hero", icon: RiHomeLine },
  { id: "about", label: "About", icon: RiQuestionMark },
  { id: "our-stack", label: "Our Stack", icon: RiStackLine },
  { id: "our-team", label: "Our Team", icon: RiTeamFill },
  { id: "testimonials", label: "Testimonials", icon: RiStarLine },
];

const FloatingNav = () => {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0, rootMargin: "-40% 0px -55% 0px" },
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop */}
      <div
        className="hidden md:flex fixed left-6 top-1/4 -translate-y-1/2 z-50 flex-col gap-1.5 p-2.5 rounded-2xl border border-primary/30 backdrop-blur-md"
        style={{
          background: "color-mix(in srgb, var(--card) 80%, transparent)",
        }}
      >
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
            style={{
              background:
                active === id
                  ? "color-mix(in srgb, var(--primary) 20%, transparent)"
                  : "",
            }}
            aria-label={label}
          >
            <Icon
              style={{
                width: 17,
                height: 17,
                color:
                  active === id ? "var(--primary)" : "var(--muted-foreground)",
                transition: "color 0.2s",
              }}
            />
            <span
              className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10"
              style={{ background: "var(--card)", color: "var(--foreground)" }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile */}
      <div
        className="flex md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex-row gap-1.5 p-2.5 rounded-2xl border border-primary/30 backdrop-blur-md"
        style={{
          background: "color-mix(in srgb, var(--card) 80%, transparent)",
        }}
      >
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group relative w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
            style={{
              background:
                active === id
                  ? "color-mix(in srgb, var(--primary) 20%, transparent)"
                  : "",
            }}
            aria-label={label}
          >
            <Icon
              style={{
                width: 18,
                height: 18,
                color:
                  active === id ? "var(--primary)" : "var(--muted-foreground)",
                transition: "color 0.2s",
              }}
            />
            <span
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10"
              style={{ background: "var(--card)", color: "var(--foreground)" }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};

export default FloatingNav;
