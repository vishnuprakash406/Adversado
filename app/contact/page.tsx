import type { Metadata } from "next";
import OpenMiaButton from "../OpenMiaButton";
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
      <section className="contact-page-hero">
        <div>
          <p className="label">Your move</p>
          <h1>Tell us where<br /><em>it hurts.</em></h1>
          <p>Launching, relaunching, repositioning or expanding? Give Mia the useful details, or reach us directly.</p>
        </div>
        <div className="contact-options">
          <a href="mailto:vishnuprakash406@gmail.com"><span>Write to us</span><strong>vishnuprakash406@gmail.com</strong><i>↗</i></a>
          <a href="https://wa.me/918921558984"><span>Chat directly</span><strong>+91 89215 58984</strong><i>↗</i></a>
          <OpenMiaButton />
        </div>
        <div className="contact-rings" aria-hidden="true"><i /><i /><i /></div>
      </section>

      <section className="contact-note">
        <p>Every engagement begins with an audit.</p>
        <p>No exceptions. Even the ones we like.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
