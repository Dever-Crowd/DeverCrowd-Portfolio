"use client";

export function AdminLoader({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 py-16">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary"
        role="status"
        aria-label={label}
      />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
