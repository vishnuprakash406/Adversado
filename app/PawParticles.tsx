"use client";

import { useEffect } from "react";

export default function PawParticles() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    if (reducedMotion.matches || !finePointer.matches) return;

    const createPaw = () => {
      const paw = document.createElement("span");
      paw.className = "floating-paw-particle";
      paw.textContent = "🐾";
      paw.style.left = `${8 + Math.random() * 84}vw`;
      paw.style.setProperty("--paw-drift", `${Math.random() * 120 - 60}px`);
      paw.style.setProperty("--paw-turn", `${Math.random() * 90 - 45}deg`);
      document.body.appendChild(paw);
      window.setTimeout(() => paw.remove(), 3600);
    };

    const interval = window.setInterval(createPaw, 6200);
    return () => window.clearInterval(interval);
  }, []);

  return null;
}
