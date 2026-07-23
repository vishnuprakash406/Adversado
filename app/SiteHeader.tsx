"use client";

import { useState } from "react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header subpage-header">
      <a className="wordmark" href="/" aria-label="Adversado home">
        <span className="logo-eyes">
          <img src="/adversado-logo-clean-3x.png" alt="Adversado" />
          <span className="eye-layer" aria-hidden="true"><i /><i /></span>
        </span>
      </a>
      <nav className={open ? "nav open" : "nav"} aria-label="Primary navigation">
        <a href="/about">About</a>
        <a href="/services">Services</a>
        <a href="/work">Work</a>
        <a href="/contact">Contact</a>
      </nav>
      <a className="subpage-cta" href="/contact">Start a project ↗</a>
      <button className="menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
        <span /><span />
      </button>
    </header>
  );
}
