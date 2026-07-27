"use client";

import { useEffect, useRef, useState } from "react";

const verticals = [
  ["01", "Brand Foundation", "Build what you stand on.", "Positioning · Identity · Naming"],
  ["02", "Brand Direction", "Turn clarity into a point of view.", "Strategy · Creative · Campaigns"],
  ["03", "Brand Reach", "Make the right people notice.", "Social · SEO · Performance"],
  ["04", "Brand Experience", "Make the brand real.", "Digital · Events · Experiences"]
];

const process = [
  ["Discover", "Learn the business before touching the brand.", "/process-steps/discover.jpg"],
  ["Debate", "Challenge assumptions until the sharpest truth survives.", "/process-steps/debate.jpg"],
  ["Define", "Choose one position that makes every next decision easier.", "/process-steps/define.jpg"],
  ["Design", "Build identity, communication and experience as one system.", "/process-steps/design.jpg"],
  ["Deliver", "Ship with consistency across every channel.", "/process-steps/deliver.jpg"],
  ["Develop", "Measure, refine and keep the brand alive.", "/process-steps/develop.jpg"]
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [activeProcess, setActiveProcess] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const portalRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      heroRef.current?.style.setProperty("--mx", `${x * 24}px`);
      heroRef.current?.style.setProperty("--my", `${y * 18}px`);
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
      const eyeX = (event.clientX / window.innerWidth - 0.5) * 4;
      const eyeY = (event.clientY / window.innerHeight - 0.5) * 4;
      document.querySelectorAll<HTMLElement>(".logo-eyes").forEach((logo) => {
        logo.style.setProperty("--eye-x", `${eyeX}px`);
        logo.style.setProperty("--eye-y", `${eyeY}px`);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const section = processRef.current;
    if (!section) return;
    const steps = Array.from(section.querySelectorAll<HTMLElement>(".process-step"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top - window.innerHeight / 2) - Math.abs(b.boundingClientRect.top - window.innerHeight / 2));
        if (visible[0]) setActiveProcess(Number((visible[0].target as HTMLElement).dataset.step));
      },
      { rootMargin: "-38% 0px -38% 0px", threshold: 0.01 }
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const video = heroVideoRef.current;
    if (!hero || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetTime = 0;
    let scheduledFrame = 0;
    let videoPrimed = false;
    let seekPending = false;

    const applyTarget = () => {
      scheduledFrame = 0;
      if (!videoPrimed || video.readyState < 2) return;
      if (video.seeking) {
        seekPending = true;
        return;
      }
      seekPending = false;
      const frameTime = Math.round(targetTime * 24) / 24;
      if (Math.abs(video.currentTime - frameTime) >= 1 / 24) video.currentTime = frameTime;
    };

    const scheduleTarget = () => {
      if (!scheduledFrame) scheduledFrame = requestAnimationFrame(applyTarget);
    };

    const updateTarget = () => {
      if (reducedMotion.matches) return;
      const rect = hero.getBoundingClientRect();
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const heroTop = scrollY + rect.top;
      const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max((scrollY - heroTop) / travel, 0), 1);
      const usableDuration = Math.min(5, Math.max((video.duration || 5) - 0.03, 0));
      targetTime = progress * usableDuration;
      hero.style.setProperty("--scroll-progress", progress.toFixed(4));
      scheduleTarget();
    };

    const primeVideo = async () => {
      if (videoPrimed) return;
      video.muted = true;
      video.playsInline = true;
      try {
        await video.play();
      } catch {
        // Fallback: try setting currentTime directly without play
        try { video.currentTime = 0.001; } catch {}
      }
      video.pause();
      videoPrimed = true;
      updateTarget();
      scheduleTarget();
    };

    const onSeeked = () => {
      if (seekPending || Math.abs(video.currentTime - targetTime) >= 1 / 24) scheduleTarget();
    };

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    window.addEventListener("orientationchange", updateTarget);
    video.addEventListener("loadedmetadata", updateTarget);
    video.addEventListener("loadeddata", primeVideo, { once: true });
    video.addEventListener("canplay", primeVideo, { once: true });
    video.addEventListener("seeked", onSeeked);
    updateTarget();
    video.load();

    return () => {
      cancelAnimationFrame(scheduledFrame);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      window.removeEventListener("orientationchange", updateTarget);
      video.removeEventListener("loadedmetadata", updateTarget);
      video.removeEventListener("loadeddata", primeVideo);
      video.removeEventListener("canplay", primeVideo);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = particleCanvasRef.current;
    if (!hero || !canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

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

      const lines = width <= 760 ? ["BUILD A", "BRAND PEOPLE", "REMEMBER."] : ["BUILD A BRAND", "PEOPLE REMEMBER."];
      const maxTextWidth = width * (width <= 760 ? 0.9 : 0.88);
      let fontSize = Math.floor(width <= 760 ? Math.min(width / 2.7, height / 7) : Math.min(width / 5, height / 4.5));
      offscreenContext.font = `800 ${fontSize}px "Baloo 2", "Arial Rounded MT Bold", sans-serif`;
      while (Math.max(...lines.map((line) => offscreenContext.measureText(line).width)) > maxTextWidth && fontSize > 20) {
        fontSize -= 2;
        offscreenContext.font = `800 ${fontSize}px "Baloo 2", "Arial Rounded MT Bold", sans-serif`;
      }

      offscreenContext.fillStyle = "#fff";
      offscreenContext.textAlign = "center";
      offscreenContext.textBaseline = "middle";
      const lineHeight = fontSize * 0.8;
      const centerY = height * 0.43;
      const firstLineY = centerY - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, index) => {
        offscreenContext.fillText(line, width / 2, firstLineY + index * lineHeight);
      });

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

    const updatePointer = (clientX: number, clientY: number) => {
      const bounds = canvas.getBoundingClientRect();
      if (clientX < bounds.left || clientX > bounds.right || clientY < bounds.top || clientY > bounds.bottom) {
        pointer.active = false;
        return;
      }
      pointer.x = clientX - bounds.left;
      pointer.y = clientY - bounds.top;
      pointer.active = true;
    };

    const onPointerMove = (event: PointerEvent) => updatePointer(event.clientX, event.clientY);
    const onPointerLeave = () => {
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
    window.addEventListener("pointerout", onPointerLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const playBell = () => {
    if (!soundOn) return;
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(720, audio.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(360, audio.currentTime + 0.35);
    gain.gain.setValueAtTime(0.12, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.42);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.42);
  };

  const movePortal = (event: React.PointerEvent<HTMLElement>) => {
    const portal = portalRef.current;
    if (!portal) return;
    const bounds = portal.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const normalizedX = x / bounds.width - 0.5;
    const normalizedY = y / bounds.height - 0.5;
    portal.style.setProperty("--portal-x", `${x}px`);
    portal.style.setProperty("--portal-y", `${y}px`);
    portal.style.setProperty("--portal-rotate-x", `${normalizedY * -10}deg`);
    portal.style.setProperty("--portal-rotate-y", `${normalizedX * 12}deg`);
    portal.style.setProperty("--portal-shift-x", `${normalizedX * 10}px`);
    portal.style.setProperty("--portal-shift-y", `${normalizedY * 8}px`);
  };

  const resetPortal = () => {
    const portal = portalRef.current;
    if (!portal) return;
    portal.style.setProperty("--portal-x", "50%");
    portal.style.setProperty("--portal-y", "50%");
    portal.style.setProperty("--portal-rotate-x", "0deg");
    portal.style.setProperty("--portal-rotate-y", "0deg");
    portal.style.setProperty("--portal-shift-x", "0px");
    portal.style.setProperty("--portal-shift-y", "0px");
  };

  const moveLiquid = (event: React.PointerEvent<HTMLElement>) => {
    const services = servicesRef.current;
    if (!services) return;
    const bounds = services.getBoundingClientRect();
    services.style.setProperty("--liquid-x", `${event.clientX - bounds.left}px`);
    services.style.setProperty("--liquid-y", `${event.clientY - bounds.top}px`);
  };

  const resetLiquid = () => {
    const services = servicesRef.current;
    if (!services) return;
    services.style.setProperty("--liquid-x", "72%");
    services.style.setProperty("--liquid-y", "28%");
  };

  const moveLiquidButton = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--button-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--button-y", `${event.clientY - bounds.top}px`);
  };

  const resetLiquidButton = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--button-x", "50%");
    event.currentTarget.style.setProperty("--button-y", "50%");
  };

  return (
    <main>
      <div className="cursor-glow" aria-hidden="true" />
      <header className="header">
        <a className="wordmark" href="#top" aria-label="Adversado home">
          <span className="logo-eyes">
            <img src="/adversado-logo-clean-3x.png" alt="Adversado" />
            <span className="eye-layer" aria-hidden="true"><i /><i /></span>
          </span>
        </a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Primary navigation">
          <a href="/about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="/services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="/work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <button className="sound" onClick={() => setSoundOn(!soundOn)} aria-pressed={soundOn}>
          Sound {soundOn ? "on" : "off"}
        </button>
        <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </header>

      <section className="hero" id="top" ref={heroRef} aria-label="Build a brand people remember.">
        <div className="hero-stage">
          <video
            ref={heroVideoRef}
            className="hero-video"
            src="/subject-a-premium-anthropomor-ios.mp4"
            poster="/subject-a-premium-poster.jpg"
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <div className="hero-wash" />
          <canvas ref={particleCanvasRef} className="hero-particles" aria-hidden="true" />
          <p className="hero-kicker">Independent creative agency · India</p>
          <div className="hero-copy">
            <p>Strategy to execution. One team, end to end. We transform brands through identity, ideas, digital, performance and experiences.</p>
            <div className="hero-actions">
              <a className="button gold liquid-button" href="#contact" onClick={playBell} onPointerMove={moveLiquidButton} onPointerLeave={resetLiquidButton}><span>Start a transformation</span><b>↗</b></a>
              <a className="text-link" href="#services">See how we think <span>↓</span></a>
            </div>
          </div>
          <div className="orbit" aria-hidden="true"><span>STRATEGY · DESIGN · CULTURE · EXPERIENCE · </span></div>
          <a className="paw-scroll" href="#about" aria-label="Scroll to discover"><span>●</span><i>⌄</i></a>
          <div className="scroll-meter" aria-hidden="true"><span /></div>
        </div>
      </section>

      <section className="manifesto" id="about">
        <p className="label">What we believe</p>
        <h2>Attention is rented.<br /><em>Memory is owned.</em></h2>
        <div className="manifesto-grid">
          <p>Adversado is the brand behind the brands - a creative partner that connects strategy, identity, campaigns, digital and experiences.</p>
          <p>We care about the memory, not the applause. The work has to be unmistakably you, everywhere it shows up, for years.</p>
        </div>
      </section>

      <section className="services" id="services" ref={servicesRef} onPointerMove={moveLiquid} onPointerLeave={resetLiquid}>
        <svg className="metaball-defs" aria-hidden="true">
          <defs>
            <filter id="metaball-goo" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 28 -12"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" mode="normal" />
            </filter>
          </defs>
        </svg>
        <div className="metaballs" aria-hidden="true">
          <i className="metaball cursor-ball" />
          <i className="metaball ball-one" />
          <i className="metaball ball-two" />
          <i className="metaball ball-three" />
          <i className="metaball ball-four" />
        </div>
        <div className="section-head">
          <p className="label">Brand transformation</p>
          <h2>Four moves.<br />One connected brand.</h2>
          <p>Hover, tap, explore. Each vertical moves the same brand forward.</p>
        </div>
        <div className="vertical-list">
          {verticals.map(([number, title, line, detail]) => (
            <article key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{line}</p></div>
              <small>{detail}</small>
              <b>↗</b>
            </article>
          ))}
        </div>
      </section>

      <section className="portal" ref={portalRef} onPointerMove={movePortal} onPointerLeave={resetPortal}>
        <div className="portal-grid" aria-hidden="true" />
        <div className="portal-field" aria-hidden="true">
          <div className="portal-ring one" /><div className="portal-ring two" /><div className="portal-ring three" />
        </div>
        <div className="portal-lens" aria-hidden="true" />
        <p>Not a campaign factory.</p>
        <h2><span data-text="One idea.">One idea.</span><span data-text="Everywhere it matters.">Everywhere it matters.</span></h2>
        <span>Branding / Creative / Social / Digital / Performance / Events</span>
      </section>

      <section className="process process-story" id="process" ref={processRef}>
        <div className="process-intro">
          <p className="label">How we work</p>
          <h2>Six Ds.<br />No filler.</h2>
          <p>Every engagement begins with an audit. Then the useful work starts.</p>
          <div className="process-progress" aria-label={`Step ${activeProcess + 1} of ${process.length}`}>
            <strong>D0{activeProcess + 1}</strong>
            <span><i style={{ transform: `scaleX(${(activeProcess + 1) / process.length})` }} /></span>
            <small>{activeProcess + 1} / {process.length}</small>
          </div>
        </div>
        <div className="process-track">
          {process.map(([title, copy, image], index) => (
            <article className="process-step" data-step={index} data-active={activeProcess === index} key={title} style={{ backgroundImage: `url(${image})` }}>
              <span>Chapter 0{index + 1}</span>
              <b aria-hidden="true">D{index + 1}</b>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div>
          <p className="label">Your move</p>
          <h2>Something changing?</h2>
          <p>Launching. Repositioning. Expanding. If your brand is at a turning point, we should talk.</p>
        </div>
        <a className="contact-button liquid-button" href="https://wa.me/918921558984?text=Hi%20Adversado%2C%20I%20want%20to%20talk%20about%20my%20brand." target="_blank" rel="noreferrer" onClick={playBell} onPointerMove={moveLiquidButton} onPointerLeave={resetLiquidButton}>
          <span>Ring the bell</span><b>Let&apos;s make it memorable ↗</b>
        </a>
      </section>

      <footer>
        <span className="logo-eyes footer-logo">
          <img src="/adversado-logo-clean-3x.png" alt="Adversado" />
          <span className="eye-layer" aria-hidden="true"><i /><i /></span>
        </span>
        <p>The brand behind the brands.</p>
        <div><a href="mailto:test@adversado.com">Email</a><a href="https://wa.me/918921558984">WhatsApp</a><a href="#top">Back to top ↑</a></div>
      </footer>
    </main>
  );
}
