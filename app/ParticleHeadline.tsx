"use client";

import { useEffect, useRef } from "react";

type ParticleHeadlineProps = {
  lines: [string, string];
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  size: number;
  alpha: number;
};

export default function ParticleHeadline({ lines }: ParticleHeadlineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let resizeTimer = 0;
    let running = !document.hidden;

    const seedParticles = () => {
      particles.length = 0;
      const offscreen = document.createElement("canvas");
      offscreen.width = Math.max(1, Math.floor(width));
      offscreen.height = Math.max(1, Math.floor(height));
      const offscreenContext = offscreen.getContext("2d");
      if (!offscreenContext) return;

      const maxTextWidth = width * 0.88;
      let fontSize = Math.floor(Math.min(width / 5, height / 4.5));
      offscreenContext.font = `800 ${fontSize}px "Syne", sans-serif`;
      while (Math.max(...lines.map((line) => offscreenContext.measureText(line).width)) > maxTextWidth && fontSize > 16) {
        fontSize -= 2;
        offscreenContext.font = `800 ${fontSize}px "Syne", sans-serif`;
      }

      offscreenContext.fillStyle = "#fff";
      offscreenContext.textAlign = "center";
      offscreenContext.textBaseline = "middle";
      const lineHeight = fontSize * 0.92;
      const centerY = height * 0.43;
      offscreenContext.fillText(lines[0], width / 2, centerY - lineHeight / 2);
      offscreenContext.fillText(lines[1], width / 2, centerY + lineHeight / 2);

      const pixels = offscreenContext.getImageData(0, 0, offscreen.width, offscreen.height).data;
      const area = width * height;
      const stride = area > 1_600_000 ? 5 : area > 900_000 ? 4 : 3;
      for (let y = 0; y < offscreen.height; y += stride) {
        for (let x = 0; x < offscreen.width; x += stride) {
          if (pixels[(y * offscreen.width + x) * 4 + 3] <= 128) continue;
          particles.push({
            x: x + (Math.random() - 0.5) * 180,
            y: y + (Math.random() - 0.5) * 180,
            vx: 0,
            vy: 0,
            homeX: x + (Math.random() - 0.5) * 0.8,
            homeY: y + (Math.random() - 0.5) * 0.8,
            size: 1 + Math.random() * 0.8,
            alpha: 0.5 + Math.random() * 0.45
          });
        }
      }
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      seedParticles();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const repelRadius = Math.min(120, width * 0.24);
      const repelRadiusSquared = repelRadius * repelRadius;
      for (const particle of particles) {
        if (pointer.active && !reducedMotion.matches) {
          const deltaX = particle.x - pointer.x;
          const deltaY = particle.y - pointer.y;
          const distanceSquared = deltaX * deltaX + deltaY * deltaY;
          if (distanceSquared < repelRadiusSquared && distanceSquared > 0.0001) {
            const distance = Math.sqrt(distanceSquared);
            const force = (1 - distance / repelRadius) * 1.6;
            particle.vx += (deltaX / distance) * force;
            particle.vy += (deltaY / distance) * force;
          }
        }
        particle.vx += (particle.homeX - particle.x) * 0.05;
        particle.vy += (particle.homeY - particle.y) * 0.05;
        particle.vx *= 0.9;
        particle.vy *= 0.9;
        particle.x += particle.vx;
        particle.y += particle.vy;
        context.globalAlpha = particle.alpha;
        context.fillStyle = "#f6b400";
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      if (running && !reducedMotion.matches) animationFrame = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
        pointer.active = false;
        return;
      }
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    };
    const onPointerOut = () => {
      pointer.active = false;
    };
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (reducedMotion.matches) draw();
      }, 150);
    };
    const onVisibilityChange = () => {
      running = !document.hidden;
      cancelAnimationFrame(animationFrame);
      if (running) animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [lines]);

  return <canvas ref={canvasRef} className="particle-headline" aria-hidden="true" />;
}
