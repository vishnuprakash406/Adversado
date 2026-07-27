"use client";

import { useEffect, useState } from "react";

type GameMode = "closed" | "playing" | "reward";

export default function HiddenCatGame() {
  const [mode, setMode] = useState<GameMode>("closed");
  const [score, setScore] = useState(0);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 4500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mode === "closed") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMode("closed");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode]);

  const moveCat = () => {
    setPosition({
      x: 12 + Math.random() * 76,
      y: 18 + Math.random() * 66
    });
  };

  const startGame = () => {
    setScore(0);
    setPosition({ x: 50, y: 50 });
    setMode("playing");
  };

  const catchCat = () => {
    const nextScore = score + 1;
    setScore(nextScore);
    if (nextScore >= 5) {
      window.localStorage.setItem("adversado-mia-found", "true");
      setMode("reward");
      return;
    }
    moveCat();
  };

  const openMia = () => {
    setMode("closed");
    window.dispatchEvent(new Event("open-mia"));
  };

  return (
    <>
      <button className={visible ? "hidden-cat-trigger visible" : "hidden-cat-trigger"} type="button" onClick={startGame} aria-label="A hidden cat is peeking. Start Catch Mia.">
        <video src="/adversado-cat.mp4" autoPlay loop muted playsInline preload="metadata" aria-hidden="true" />
        <span>psst</span>
      </button>

      {mode !== "closed" && (
        <section className="cat-game-screen" aria-label={mode === "playing" ? "Catch Mia game" : "Mia's secret screen"} role="dialog" aria-modal="true">
          <button className="cat-game-close" type="button" onClick={() => setMode("closed")} aria-label="Close Catch Mia">×</button>

          {mode === "playing" && (
            <>
              <div className="cat-game-hud">
                <p>Catch Mia</p>
                <strong>{score} / 5</strong>
                <span><i style={{ transform: `scaleX(${score / 5})` }} /></span>
                <small>She moves quickly. Tap the cat.</small>
              </div>
              <button
                className="catching-cat"
                type="button"
                onClick={catchCat}
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
                aria-label={`Catch Mia. ${5 - score} catches remaining.`}
              >
                <video src="/adversado-cat.mp4" autoPlay loop muted playsInline preload="metadata" aria-hidden="true" />
              </button>
              <div className="cat-game-orbit one" aria-hidden="true" />
              <div className="cat-game-orbit two" aria-hidden="true" />
            </>
          )}

          {mode === "reward" && (
            <div className="cat-reward">
              <p className="label">Secret screen unlocked</p>
              <div className="cat-reward-video"><video src="/adversado-cat.mp4" autoPlay loop muted playsInline aria-hidden="true" /></div>
              <h2>You caught<br />the strategist.</h2>
              <p>Mia has reviewed your reflexes. Your brand instincts may be worth discussing.</p>
              <div>
                <button type="button" onClick={openMia}>Ask Mia about your brand ↗</button>
                <button type="button" onClick={startGame}>Play again</button>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
