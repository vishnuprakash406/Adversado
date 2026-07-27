import type { Metadata } from "next";
import ContactForm from "../ContactForm";
import ContactHeroActions from "../ContactHeroActions";
import ParticleHeadline from "../ParticleHeadline";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "Contact | Adversado",
  description: "Tell Adversado what is changing. Start with a brand audit."
};

export default function ContactPage() {
  return (
    <main className="subpage">
      <SiteHeader />
      <section className="contact-page-hero" aria-label="Tell us where it hurts.">
        <ParticleHeadline lines={["TELL US WHERE", "IT HURTS."]} />
        <div>
          <p className="label">Your move</p>
          <p>Launching, relaunching, repositioning or expanding? Give Mia the useful details, or reach us directly.</p>
        </div>
        <ContactHeroActions />
        <div className="contact-rings" aria-hidden="true"><i /><i /><i /></div>
      </section>

      <ContactForm />

      <section className="contact-note">
        <p>Every engagement begins with an audit.</p>
        <p>No exceptions. Even the ones we like.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
