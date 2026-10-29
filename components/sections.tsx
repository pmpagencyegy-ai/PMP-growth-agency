import Link from "next/link";
import Image from "next/image";
import { c, href, type Project, approvedAsset } from "@/lib/content";
export const Arrow = () => (
  <span className="arrow-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  </span>
);
export function Button({
  to,
  children,
  light = false,
}: {
  to: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Link className={`button ${light ? "light" : ""}`} href={href(to)}>
      {children}
      <Arrow />
    </Link>
  );
}
export function Label({
  children,
  num,
}: {
  children: React.ReactNode;
  num?: string;
}) {
  return (
    <div className="eyebrow">
      <span className="small-dot" />
      {children}
      {num && <span className="label-num">/{num}</span>}
    </div>
  );
}
export function Closing({
  heading = c.home.closingCta.heading,
  body = c.home.closingCta.body,
  label = c.primaryCta.label,
  to = c.primaryCta.route,
}: {
  heading?: string;
  body?: string;
  label?: string;
  to?: string;
}) {
  return (
    <section className="closing">
      <div className="container closing-inner">
        <div>
          <Label>What comes next</Label>
          <h2>{heading}</h2>
          <p>{body}</p>
        </div>
        <Button to={to} light>
          {label}
        </Button>
      </div>
    </section>
  );
}
export function Process() {
  return (
    <section className="section process">
      <div className="container">
        <div className="section-heading">
          <Label num="04">The approach</Label>
          <h2>{c.home.process.heading}</h2>
        </div>
        <div className="process-grid">
          {c.home.process.steps.map((step, i) => (
            <article key={step.title}>
              <span className="step-number">0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Footer() {
  const d = c.contactPage.details;
  const social = [
    ["Instagram", "/media/social/social-01.png"],
    ["Facebook", "/media/social/social-02.png"],
    ["LinkedIn", "/media/social/social-03.png"],
    ["Twitter", "/media/social/social-04.png"],
    ["TikTok", "/media/social/social-05.png"],
    ["Snapchat", "/media/social/social-06.png"],
    ["YouTube", "/media/social/social-07.png"],
    ["Threads", "/media/social/social-08.png"],
  ];
  return (
    <footer className="pmp-footer" id="contact">
      <div className="pmp-footer-social">
        <p>FOLLOW THE PULSE <span aria-hidden="true" /></p>
        <div>
          {social.map(([label, image], index) => (
            <span className="pmp-social-item" key={label}>
              <Image src={image} width={44} height={44} alt="" />
              {label}{index < social.length - 1 && <i aria-hidden="true">•</i>}
            </span>
          ))}
        </div>
      </div>
      <div className="pmp-footer-grid">
        <div className="pmp-footer-brand">
          <Link href="/en#home" aria-label="PMP home">
            <Image src="/brand/pmp-logo.svg" alt="PMP — Platinum Marketing Pulse" width={430} height={145} />
          </Link>
          <p>Distinctive identity. Sharp strategy.<br />Creativity built to make an impact.</p>
        </div>
        <nav className="pmp-footer-nav" aria-label="Explore">
          <h2>EXPLORE <span /></h2>
          <div>
            <Link href="/en#home">Home</Link>
            <Link href="/en#about">About Us</Link>
            <Link href="/en#services">Services</Link>
            <Link href="/en#work">Our Work</Link>
            <Link href="/en#industries">Industries</Link>
            <Link href="/en#contact">Contact</Link>
          </div>
        </nav>
        <nav className="pmp-footer-services" aria-label="Our services">
          <h2>OUR SERVICES <span /></h2>
          <Link href="/en/services/production">Production</Link>
          <Link href="/en/services/branding">Design</Link>
          <Link href="/en/services/media-coverage">Media Coverage</Link>
          <Link href="/en/services/social-media">Social Media</Link>
          <Link href="/en/services/media-buying">Media Buying</Link>
        </nav>
        <div className="pmp-footer-contact">
          <h2>Good conversations. Great possibilities.</h2>
          <p>EMAIL US</p>
          <a href={d.emailHref}>{d.email}<span aria-hidden="true">→</span></a>
          <p>CALL US</p>
          <a dir="ltr" href={d.phoneHref}>{d.phoneDisplay}<span aria-hidden="true">→</span></a>
          <small>Also available on WhatsApp.</small>
        </div>
      </div>
      <div className="pmp-footer-bottom">
        <span>© {new Date().getFullYear()} PMP. All rights reserved.</span>
        <div><Link href="/en/privacy">Privacy Policy</Link><i>•</i><span>Terms of Use</span></div>
        <a href="#home" className="pmp-back-top" aria-label="Back to top"><b>↑</b> Back to top</a>
      </div>
    </footer>
  );
}
export function PageHero({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body?: string;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <Label>{label}</Label>
        <h1>{title}</h1>
        {body && <p>{body}</p>}
      </div>
    </section>
  );
}
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="project-grid">
      {projects.map((p) => {
        const a = approvedAsset(p.coverAssetId)!;
        return (
          <Link className="project" key={p.id} href={href(`/work/${p.slug}`)}>
            <div className="project-image">
              <Image
                src={a.src!}
                alt={a.alt!}
                width={a.width}
                height={a.height}
              />
            </div>
            <div>
              <h3>{p.title}</h3>
              <Arrow />
            </div>
            <p>{p.summary}</p>
          </Link>
        );
      })}
    </div>
  );
}
export function CaseStudy({ project: p }: { project: Project }) {
  const cover = approvedAsset(p.coverAssetId)!;
  return (
    <>
      <PageHero
        label={p.clientName || "Selected work"}
        title={p.title}
        body={p.summary}
      />
      <section className="section container case-study">
        <Image
          src={cover.src!}
          alt={cover.alt!}
          width={cover.width}
          height={cover.height}
        />
        <div className="case-meta">
          {p.serviceIds.map((id) => (
            <Link key={id} href={href(`/services/${id}`)}>
              {c.services.find((s) => s.id === id)?.name}
            </Link>
          ))}
          {p.year && <span>{p.year}</span>}
        </div>
        <h2>The challenge</h2>
        <p>{p.challenge}</p>
        <h2>Our approach</h2>
        <p>{p.approach}</p>
        <h2>What we created</h2>
        <ul>
          {p.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        {p.galleryAssetIds.map((id) => {
          const a = approvedAsset(id)!;
          return (
            <Image
              key={id}
              src={a.src!}
              alt={a.alt!}
              width={a.width}
              height={a.height}
            />
          );
        })}
        <Button to="/work">{c.shared.backToWorkLabel}</Button>
      </section>
      <Closing />
    </>
  );
}
