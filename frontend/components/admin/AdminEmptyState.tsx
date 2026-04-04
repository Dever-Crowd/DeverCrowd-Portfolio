"use client";
import { Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminEmptyStateProps {
  title: string;
  description?: string;
  className?: string;
  icon?: LucideIcon;
}

export function AdminEmptyState({ title, description, className, icon: Icon = Inbox }: AdminEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center", className)}>
      <Icon className="mb-4 h-12 w-12 text-muted-foreground/60" strokeWidth={1.25} />
      <h2 className="text-lg font-medium text-foreground">{title}</h2>
      {description && <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}