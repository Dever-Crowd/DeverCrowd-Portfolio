"use client";

import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminEmptyState({ title, description, className, icon: Icon = Inbox }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center",
        className
      )}
    >
      <Icon className="mb-4 h-12 w-12 text-muted-foreground/60" strokeWidth={1.25} />
      <h2 className="text-lg font-medium text-foreground">{title}</h2>
      {description ? <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
