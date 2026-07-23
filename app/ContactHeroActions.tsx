"use client";

import { MouseEvent, ReactNode } from "react";

function addRipple(event: MouseEvent<HTMLElement>) {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement("span");
  ripple.className = "contact-ripple";
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  target.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 650);
}

function ActionContent({ label, value, arrow }: { label: string; value: string; arrow: ReactNode }) {
  return <><span>{label}</span><strong>{value}</strong><i aria-hidden="true">{arrow}</i></>;
}

export default function ContactHeroActions() {
  return (
    <div className="contact-options">
      <a className="contact-micro-action" href="mailto:vishnuprakash406@gmail.com" onPointerDown={addRipple}>
        <ActionContent label="Write to us" value="vishnuprakash406@gmail.com" arrow="↗" />
      </a>
      <a className="contact-micro-action" href="https://wa.me/918921558984" onPointerDown={addRipple}>
        <ActionContent label="Chat directly" value="+91 89215 58984" arrow="↗" />
      </a>
      <button className="contact-micro-action" type="button" onPointerDown={addRipple} onClick={() => window.dispatchEvent(new Event("open-mia"))}>
        <ActionContent label="Ask Mia" value="Open the cat assistant" arrow="↓" />
      </button>
    </div>
  );
}
