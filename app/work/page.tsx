import type { Metadata } from "next";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "Work | Adversado",
  description: "Selected transformations, campaigns and brand experiences from Adversado."
};

const projects = [
  ["01", "A category launch", "Brand foundation · Identity · Campaign", "From an unfamiliar name to a distinctive market entrance.", "project-gold"],
  ["02", "A retail brand, rebuilt", "Strategy · Experience · Digital", "One connected system across store, screen and conversation.", "project-blue"],
  ["03", "A campaign with legs", "Creative platform · Social · Performance", "A single idea designed to travel further than the media plan.", "project-paper"],
  ["04", "An experience people entered", "Event · Spatial · Interactive", "Turning brand positioning into a place people could feel.", "project-night"]
];

export default function WorkPage() {
  return (
    <main className="subpage">
      <SiteHeader />
      <section className="page-hero work-page-hero">
        <p className="label">Selected work</p>
        <h1>Ideas that moved<br /><em>beyond the deck.</em></h1>
        <p className="page-lede">A selection of transformation stories. The names stay quiet where the work is confidential; the thinking still speaks.</p>
        <div className="page-index">Work / 03</div>
      </section>

      <section className="project-list">
        {projects.map(([number, title, tags, copy, tone]) => (
          <article className={tone} key={number}>
            <div className="project-meta"><span>{number}</span><p>{tags}</p></div>
            <div className="project-visual"><div className="project-orbit" /><strong>{title}</strong></div>
            <div className="project-copy"><h2>{title}</h2><p>{copy}</p><a href="/contact">Discuss a project ↗</a></div>
          </article>
        ))}
      </section>

      <section className="page-next">
        <p className="label">Your work, next</p>
        <h2>Bring us the turning point.</h2>
        <a href="/contact">Start a conversation ↗</a>
      </section>
      <SiteFooter />
    </main>
  );
}
