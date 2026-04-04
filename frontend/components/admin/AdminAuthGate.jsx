"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAdminCookie,STORAGE_TOKEN_KEY } from "@/lib/auth";

export function AdminAuthGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) return;
    const t = getAdminCookie(STORAGE_TOKEN_KEY);
    if (!t) {
      router.replace("/admin/login");
    }
  }, [isLogin, pathname, router]);

  if (isLogin) return children;

  if (typeof window !== "undefined" && !getAdminCookie(STORAGE_TOKEN_KEY)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <p className="text-sm text-muted-foreground">Checking session…</p>
      </div>
    );
  }

  return children;
}
