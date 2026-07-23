"use client";

import { FormEvent, useState } from "react";

const turningPoints = [
  "Launching something new",
  "Relaunching or repositioning",
  "Expanding to new markets",
  "Our brand doesn't match our business anymore"
];

export default function ContactForm() {
  const [turningPoint, setTurningPoint] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      name: String(form.get("name") || ""),
      brand: String(form.get("company") || ""),
      email: String(form.get("email") || ""),
      need: String(form.get("turning-point") || ""),
      message: String(form.get("message") || ""),
      source: "Contact page audit form",
      website: String(form.get("website") || "")
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Delivery failed");
      setStatus("sent");
      formElement.reset();
      setTurningPoint("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="audit-area">
      <div className="audit-intro">
        <p className="label">Get in touch</p>
        <h2>Start your<br />free audit.</h2>
        <p>Pick what best describes your situation, then drop your details. We will send focused recommendations, not a generic pitch.</p>
        <ol>
          <li>We review your brand and current marketing.</li>
          <li>You get practical next steps within 24 hours.</li>
        </ol>
      </div>

      <div className="audit-form-wrap">
        <div className="intent-picker" aria-label="Choose your turning point">
          <p>Quick select</p>
          <div>
            {turningPoints.map((point) => (
              <button className={turningPoint === point ? "active" : ""} type="button" key={point} onClick={() => setTurningPoint(point)}>
                {point === "Launching something new" ? "Launching" : point === "Relaunching or repositioning" ? "Repositioning" : point === "Expanding to new markets" ? "Expansion" : "Brand mismatch"}
              </button>
            ))}
          </div>
        </div>

        <form className="audit-form" onSubmit={submit}>
          <input className="form-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div className="audit-grid">
            <label><span>Your name</span><input name="name" type="text" placeholder="How should we address you?" required /></label>
            <label><span>Company</span><input name="company" type="text" placeholder="Your brand or company" required /></label>
            <label><span>Email</span><input name="email" type="email" placeholder="you@company.com" required /></label>
            <label>
              <span>Turning point</span>
              <select name="turning-point" value={turningPoint} onChange={(event) => setTurningPoint(event.target.value)} required>
                <option value="">What&apos;s changing?</option>
                {turningPoints.map((point) => <option key={point}>{point}</option>)}
                <option>Something else</option>
              </select>
            </label>
          </div>
          <label className="audit-message">
            <span>Tell us more</span>
            <textarea name="message" placeholder="Be honest. We will be." rows={6} maxLength={500} value={message} onChange={(event) => setMessage(event.target.value)} required />
            <small>{message.length}/500</small>
          </label>
          <div className="audit-actions">
            <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending..." : "Send to Adversado ↗"}</button>
            <a href="https://wa.me/918921558984?text=Hi%20Adversado%2C%20I%20want%20to%20talk%20about%20my%20brand.">Talk first</a>
          </div>
          {status === "sent" && <p className="audit-status success">Thanks. Your enquiry is with the Adversado team.</p>}
          {status === "error" && <p className="audit-status error">We couldn&apos;t send that right now. Please email <a href="mailto:vishnuprakash406@gmail.com">vishnuprakash406@gmail.com</a>.</p>}
        </form>
      </div>
    </section>
  );
}
