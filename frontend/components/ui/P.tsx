import React from "react";
import { cn } from "@/lib/utils";

type PVariant = "default" | "muted" | "lead" | "small" | "eyebrow";

const variants: Record<PVariant, string> = {
  default: "text-sm md:text-base leading-relaxed text-foreground",
  muted: "text-sm md:text-base leading-relaxed text-muted-foreground",
  lead: "text-base md:text-lg leading-relaxed text-muted-foreground",
  small: "text-xs md:text-sm leading-relaxed text-muted-foreground",
  eyebrow:
    "rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] sm:text-xs text-muted-foreground",
};

interface PProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: PVariant;
}

const P = React.forwardRef<HTMLElement, PProps>(function P(
  { as: Comp = "p", variant = "default", className, children, ...props },
  ref
) {
  return (
    <Comp ref={ref} className={cn(variants[variant] ?? variants.default, className)} {...props}>
      {children}
    </Comp>
  );
});

export default P;