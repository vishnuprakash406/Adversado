import type { Metadata } from "next";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "About | Adversado",
  description: "Meet the thinking, people and personality behind Adversado."
};

const principles = [
  ["01", "Clarity before creativity", "The sharpest work starts with the right problem, honestly defined."],
  ["02", "One brand, everywhere", "Strategy, identity and experience should speak with one recognisable voice."],
  ["03", "Useful discomfort", "We challenge the comfortable answer when the brand deserves a better one."],
  ["04", "Memory over noise", "Attention fades. Distinctive ideas, repeated with discipline, stay."]
];

export default function AboutPage() {
  return (
    <main className="subpage">
      <SiteHeader />
      <section className="page-hero about-hero">
        <p className="label">Meet Adversado</p>
        <h1>Human brains.<br /><em>Restless curiosity.</em></h1>
        <p className="page-lede">We are an end-to-end creative agency for brands at turning points. We think before we decorate, ask the awkward question, and stay until the idea is real everywhere.</p>
        <div className="page-index">About / 01</div>
      </section>

      <section className="story-split">
        <p className="label">Who we are</p>
        <h2>Not ten vendors.<br />One invested team.</h2>
        <div>
          <p>Adversado connects brand strategy, identity, campaigns, social, digital, performance and experiences under one roof.</p>
          <p>That is not simply a service list. It is a belief that a brand should feel like the same living thing wherever people meet it.</p>
        </div>
      </section>

      <section className="principles">
        <div className="section-head">
          <p className="label">How we think</p>
          <h2>Principles with<br />a pulse.</h2>
          <p>No corporate wallpaper. These are the standards we bring into the room and the work.</p>
        </div>
        <div className="principle-grid">
          {principles.map(([number, title, copy]) => (
            <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="human-strip">
        <p>Strategists who care about craft.</p>
        <p>Designers who care about business.</p>
        <p>People who care enough to disagree.</p>
      </section>

      <section className="page-next">
        <p className="label">Next</p>
        <h2>See how we transform brands.</h2>
        <a href="/services">Explore services ↗</a>
      </section>
      <SiteFooter />
    </main>
  );
}
