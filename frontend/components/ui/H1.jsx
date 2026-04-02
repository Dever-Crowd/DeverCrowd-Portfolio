import React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default:
    "text-2xl md:text-3xl font-extrabold capitalize text-transparent bg-gradient-to-r from-[#0c45a0] via-[#0c9aff] to-[#0c45a0] bg-clip-text animate-gradient bg-[length:200%_200%] tracking-tight drop-shadow-[0_1px_2px_rgba(12,69,160,0.4)]",
  muted:
    "text-2xl md:text-3xl font-extrabold capitalize text-muted-foreground tracking-tight",
  small:
    "text-xl md:text-2xl font-extrabold capitalize text-transparent bg-gradient-to-r from-[#0c45a0] via-[#0c9aff] to-[#0c45a0] bg-clip-text animate-gradient bg-[length:200%_200%] tracking-tight",
};

const H1 = React.forwardRef(function H1(
  { as: Comp = "h2", variant = "default", className, children, ...props },
  ref
) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-6">
      <Comp ref={ref} className={cn(variants[variant] || variants.default, className)} {...props}>
        {children}
      </Comp>
      <div className="mt-4 w-3/4 sm:w-2/3 md:w-1/2 lg:w-[40%] h-[3px] bg-gradient-to-r from-transparent via-[#0c9aff] to-transparent rounded-full shadow-md shadow-[#0c9aff]/30" />
    </div>
  );
});

export default H1;