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
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link href="/en" className="wordmark footer-mark">
              PMP.
            </Link>
            <p>{c.brand.footerDescription}</p>
          </div>
          <nav aria-label="Footer navigation">
            {c.navigation.map((n) => (
              <Link key={n.label} href={href(n.route)}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="footer-contact">
            <a href={d.emailHref}>
              {d.email}
              <Arrow />
            </a>
            <a dir="ltr" href={d.phoneHref}>
              {d.phoneDisplay}
            </a>
            <span>{d.location}</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            {c.shared.copyrightTemplate.replace(
              "{year}",
              String(new Date().getFullYear()),
            )}
          </span>
          <span className="footer-tagline">{c.brand.tagline}</span>
          <Link href="/en/privacy">
            {c.shared.privacyLabel}
            <Arrow />
          </Link>
        </div>
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
