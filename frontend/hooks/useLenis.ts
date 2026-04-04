"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export function useLenis(): void {
  useEffect(() => {
    const lenis = new Lenis();
    let rafId = 0;

    function raf(time: number): void {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}