import type { Metadata } from "next";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "Services | Adversado",
  description: "Four connected verticals for complete brand transformation."
};

const services = [
  ["01", "Brand Foundation", "Build what you stand on.", ["Research & audit", "Positioning", "Naming", "Brand identity", "Guidelines & systems"]],
  ["02", "Brand Direction", "Turn clarity into a point of view.", ["Brand strategy", "Creative direction", "Campaign platforms", "Content systems", "Communication design"]],
  ["03", "Brand Reach", "Meet the people who matter.", ["Social media", "Digital marketing", "SEO", "Performance marketing", "Campaign optimisation"]],
  ["04", "Brand Experience", "Make the promise tangible.", ["Website design", "Development", "Events", "Spatial experiences", "Interactive activations"]]
];

export default function ServicesPage() {
  return (
    <main className="subpage">
      <SiteHeader />
      <section className="page-hero services-page-hero">
        <p className="label">Brand transformation</p>
        <h1>From first truth<br /><em>to every touchpoint.</em></h1>
        <p className="page-lede">Four verticals, connected by one strategy. Enter anywhere; leave with a brand that makes sense everywhere.</p>
        <div className="page-index">Services / 02</div>
      </section>

      <section className="service-chapters">
        {services.map(([number, title, line, items]) => (
          <article key={number as string}>
            <span>{number as string}</span>
            <div className="service-chapter-title"><p>Vertical {number as string}</p><h2>{title as string}</h2><strong>{line as string}</strong></div>
            <ul>{(items as string[]).map((item) => <li key={item}>{item}<i>↗</i></li>)}</ul>
          </article>
        ))}
      </section>

      <section className="page-next gold-next">
        <p className="label">Not sure where to start?</p>
        <h2>Every engagement begins with an audit.</h2>
        <a href="/contact">Book the first conversation ↗</a>
      </section>
      <SiteFooter />
    </main>
  );
}
