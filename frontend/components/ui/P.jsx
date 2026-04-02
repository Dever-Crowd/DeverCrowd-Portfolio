import React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "text-sm md:text-base leading-relaxed text-foreground",
  muted: "text-sm md:text-base leading-relaxed text-muted-foreground",
  lead: "text-base md:text-lg leading-relaxed text-muted-foreground",
  small: "text-xs md:text-sm leading-relaxed text-muted-foreground",
  eyebrow:
    "rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] sm:text-xs text-muted-foreground",
};

const P = React.forwardRef(function P(
  { as: Comp = "p", variant = "default", className, children, ...props },
  ref
) {
  return (
    <Comp ref={ref} className={cn(variants[variant] || variants.default, className)} {...props}>
      {children}
    </Comp>
  );
});

export default P;

