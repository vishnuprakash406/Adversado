"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const questions = [
  { key: "name", prompt: "First, what should I call you?", placeholder: "Your name", type: "text" },
  { key: "brand", prompt: "Lovely. What brand or business are we talking about?", placeholder: "Brand or company", type: "text" },
  { key: "email", prompt: "Where can the Adversado team reach you?", placeholder: "you@company.com", type: "email" },
  { key: "need", prompt: "What kind of transformation do you need?", placeholder: "Choose one", type: "choice" },
  { key: "message", prompt: "Last one: what is changing, and what would a great outcome look like?", placeholder: "Tell Mia the useful part...", type: "textarea" }
] as const;

const choices = ["Launch a new brand", "Reposition an existing brand", "Campaign or growth", "Website or digital experience", "Something else"];
type Answers = Record<(typeof questions)[number]["key"], string>;

const emptyAnswers: Answers = { name: "", brand: "", email: "", need: "", message: "" };

export default function MiaChat() {
  const temporaryEmail = "vishnuprakash406@gmail.com";
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const question = questions[step];
  const complete = step >= questions.length;

  useEffect(() => {
    if (open && !complete) window.setTimeout(() => inputRef.current?.focus(), 180);
  }, [open, step, complete]);

  const saveAnswer = (answer: string) => {
    const clean = answer.trim();
    if (!clean || complete) return;
    setAnswers((current) => ({ ...current, [question.key]: clean }));
    setValue("");
    setStep((current) => current + 1);
  };

  const submitAnswer = (event: FormEvent) => {
    event.preventDefault();
    saveAnswer(value);
  };

  const sendEnquiry = async () => {
    setStatus("sending");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, source: "Mia website assistant", website: "" })
      });
      if (!response.ok) throw new Error("Delivery failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const restart = () => {
    setAnswers(emptyAnswers);
    setValue("");
    setStep(0);
    setStatus("idle");
  };

  const fallbackEmail = `mailto:${temporaryEmail}?subject=${encodeURIComponent(`New Mia enquiry: ${answers.brand}`)}&body=${encodeURIComponent([
    "New website enquiry from Mia",
    "",
    `Name: ${answers.name}`,
    `Brand: ${answers.brand}`,
    `Contact: ${answers.email}`,
    `Need: ${answers.need}`,
    "",
    "Message:",
    answers.message
  ].join("\n"))}`;

  return (
    <aside className={open ? "mia open" : "mia"} aria-label="Chat with Mia">
      <button className="mia-launcher" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mia-panel" aria-label={open ? "Close Mia assistant" : "Open Mia assistant"}>
        <span className="mia-cat" aria-hidden="true">🐈‍⬛</span>
        <span><b>Meet Mia</b><small>Ask about your brand</small></span>
        <i aria-hidden="true">{open ? "×" : "↗"}</i>
      </button>

      <section className="mia-panel" id="mia-panel" aria-hidden={!open}>
        <header>
          <div className="mia-avatar" aria-hidden="true">🐈‍⬛</div>
          <div><strong>Mia</strong><span><i /> Adversado&apos;s curious cat</span></div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close Mia chat">×</button>
        </header>

        <div className="mia-conversation" aria-live="polite">
          <div className="mia-bubble bot">Hi, I&apos;m Mia. I ask the useful questions before the humans join in.</div>
          {questions.slice(0, Math.min(step, questions.length)).map((item) => (
            <div className="mia-exchange" key={item.key}>
              <div className="mia-bubble bot">{item.prompt}</div>
              <div className="mia-bubble user">{answers[item.key]}</div>
            </div>
          ))}

          {!complete && <div className="mia-bubble bot current">{question.prompt}</div>}

          {complete && status !== "sent" && (
            <div className="mia-summary">
              <div className="mia-bubble bot">Perfect. I&apos;ll send this to the Adversado team:</div>
              <dl>
                <div><dt>Name</dt><dd>{answers.name}</dd></div>
                <div><dt>Brand</dt><dd>{answers.brand}</dd></div>
                <div><dt>Need</dt><dd>{answers.need}</dd></div>
                <div><dt>Contact</dt><dd>{answers.email}</dd></div>
              </dl>
              <p>By sending, you agree that Adversado may contact you about this enquiry.</p>
              <button className="mia-send" type="button" onClick={sendEnquiry} disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Send to Adversado ↗"}
              </button>
              {status === "error" && (
                <p className="mia-error">
                  Automatic delivery is not connected yet.{" "}
                  <a href={fallbackEmail}>Email this enquiry directly</a>.
                </p>
              )}
            </div>
          )}

          {status === "sent" && (
            <div className="mia-success">
              <div className="mia-bubble bot">Sent. The humans have it now. I&apos;ll go back to supervising the internet.</div>
              <button type="button" onClick={restart}>Start another conversation</button>
            </div>
          )}
        </div>

        {!complete && question.type === "choice" && (
          <div className="mia-choices">
            {choices.map((choice) => <button type="button" key={choice} onClick={() => saveAnswer(choice)}>{choice}</button>)}
          </div>
        )}

        {!complete && question.type !== "choice" && (
          <form className="mia-input" onSubmit={submitAnswer}>
            {question.type === "textarea" ? (
              <textarea ref={inputRef as React.RefObject<HTMLTextAreaElement>} value={value} onChange={(event) => setValue(event.target.value)} placeholder={question.placeholder} rows={3} maxLength={700} required />
            ) : (
              <input ref={inputRef as React.RefObject<HTMLInputElement>} value={value} onChange={(event) => setValue(event.target.value)} placeholder={question.placeholder} type={question.type} maxLength={120} required />
            )}
            <button type="submit" aria-label="Send answer" disabled={!value.trim()}>↑</button>
          </form>
        )}
      </section>
    </aside>
  );
}
