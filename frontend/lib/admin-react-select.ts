"use client";
import type { StylesConfig } from "react-select";

export function getAdminSelectStyles(): StylesConfig {
  return {
    control: (base, state) => ({
      ...base,
      minHeight: 40,
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "var(--ring)" : "var(--border)",
      backgroundColor: "var(--background)",
      boxShadow: state.isFocused
        ? "0 0 0 2px color-mix(in srgb, var(--ring) 35%, transparent)"
        : "none",
      "&:hover": { borderColor: "var(--input)" },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.5rem",
      border: "1px solid var(--border)",
      backgroundColor: "var(--popover)",
      zIndex: 50,
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "var(--primary)"
        : state.isFocused
        ? "var(--accent)"
        : "transparent",
      color: state.isSelected
        ? "var(--primary-foreground)"
        : "var(--foreground)",
    }),
    singleValue: (base) => ({ ...base, color: "var(--foreground)" }),
    input: (base) => ({ ...base, color: "var(--foreground)" }),
    placeholder: (base) => ({ ...base, color: "var(--muted-foreground)" }),
    menuList: (base) => ({ ...base, padding: 4 }),
  };
}