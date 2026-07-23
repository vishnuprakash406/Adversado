"use client";

import { useEffect, useRef, useState } from "react";
import MiaChat from "./MiaChat";

const verticals = [
  ["01", "Brand Foundation", "Build what you stand on.", "Positioning · Identity · Naming"],
  ["02", "Brand Direction", "Turn clarity into a point of view.", "Strategy · Creative · Campaigns"],
  ["03", "Brand Reach", "Make the right people notice.", "Social · SEO · Performance"],
  ["04", "Brand Experience", "Make the brand real.", "Digital · Events · Experiences"]
];

const process = [
  ["Discover", "Learn the business before touching the brand."],
  ["Debate", "Challenge assumptions until the sharpest truth survives."],
  ["Define", "Choose one position that makes every next decision easier."],
  ["Design", "Build identity, communication and experience as one system."],
  ["Deliver", "Ship with consistency across every channel."],
  ["Develop", "Measure, refine and keep the brand alive."]
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);

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
    const hero = heroRef.current;
    const canvas = heroCanvasRef.current;
    if (!hero || !canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const context = canvas.getContext("2d");
    const frameCount = 100;
    const images: HTMLImageElement[] = [];
    let targetFrame = 0;
    let currentFrame = 0;
    let lastDrawnFrame = -1;
    let frame = 0;

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      lastDrawnFrame = -1;
    };

    const drawFrame = (index: number) => {
      const image = images[index];
      if (!context || !image?.complete || !image.naturalWidth || index === lastDrawnFrame) return;
      const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
      lastDrawnFrame = index;
    };

    const updateTarget = () => {
      if (reducedMotion.matches) return;
      const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-hero.getBoundingClientRect().top / travel, 0), 1);
      targetFrame = progress * (frameCount - 1);
      hero.style.setProperty("--scroll-progress", progress.toFixed(4));
    };

    const render = () => {
      currentFrame += (targetFrame - currentFrame) * 0.16;
      drawFrame(Math.min(Math.round(currentFrame), frameCount - 1));
      frame = requestAnimationFrame(render);
    };

    resizeCanvas();
    for (let index = 0; index < frameCount; index += 1) {
      const image = new Image();
      image.decoding = "async";
      image.src = `/hero-frames/frame-${String(index + 1).padStart(3, "0")}.webp`;
      image.onload = () => {
        if (index === 0 || Math.round(currentFrame) === index) drawFrame(index);
      };
      images.push(image);
    }

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("resize", updateTarget);
    updateTarget();
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("resize", updateTarget);
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
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#process" onClick={() => setMenuOpen(false)}>Process</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <button className="sound" onClick={() => setSoundOn(!soundOn)} aria-pressed={soundOn}>
          Sound {soundOn ? "on" : "off"}
        </button>
        <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">
          <span /><span />
        </button>
      </header>

      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-stage">
          <canvas ref={heroCanvasRef} className="hero-sequence" aria-hidden="true" />
          <div className="hero-wash" />
          <p className="hero-kicker">Independent creative agency · India</p>
          <div className="hero-copy">
            <h1><span>Build a brand</span><span>people remember.</span></h1>
            <p>Strategy to execution. One team, end to end. We transform brands through identity, ideas, digital, performance and experiences.</p>
            <div className="hero-actions">
              <a className="button gold" href="#contact" onClick={playBell}>Start a transformation <b>↗</b></a>
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

      <section className="services" id="services">
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

      <section className="portal">
        <div className="portal-ring one" /><div className="portal-ring two" /><div className="portal-ring three" />
        <p>Not a campaign factory.</p>
        <h2>One idea.<br />Everywhere it matters.</h2>
        <span>Branding / Creative / Social / Digital / Performance / Events</span>
      </section>

      <section className="process" id="process">
        <div className="section-head">
          <p className="label">How we work</p>
          <h2>Six Ds.<br />No filler.</h2>
          <p>Every engagement begins with an audit. Then the useful work starts.</p>
        </div>
        <div className="process-track">
          {process.map(([title, copy], index) => (
            <article key={title}>
              <span>D{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
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
        <a className="contact-button" href="https://wa.me/918921558984?text=Hi%20Adversado%2C%20I%20want%20to%20talk%20about%20my%20brand." target="_blank" rel="noreferrer" onClick={playBell}>
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
      <MiaChat />
    </main>
  );
}
