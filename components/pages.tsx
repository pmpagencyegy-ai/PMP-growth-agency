import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { c, href, projects, type Service } from "@/lib/content";
import { inquiryReady } from "@/lib/inquiries";
import {
  Arrow,
  Button,
  Closing,
  Label,
  PageHero,
  Process,
  ProjectGrid,
} from "./sections";
import { Work } from "./work";
import { InquiryForm } from "./inquiry-form";
import { LandingExperience } from "./landing-experience";
import type { LandingProject } from "@/lib/landing-data";

export function Home() {
  return <LandingExperience />;
}

export function LegacyHome() {
  return (
    <>
      <section className="hero">
        <div className="hero-orbits" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>
            <Arrow />
          </span>
        </div>
        <div className="container hero-content">
          <div className="hero-topline">
            <Label>{c.home.hero.eyebrow}</Label>
            <span className="hero-coordinate">
              EGYPT · CONNECTED EVERYWHERE
            </span>
          </div>
          <h1>
            Make your
            <br />
            next <span className="serif">move.</span>
          </h1>
          <div className="hero-bottom">
            <p>{c.home.hero.body}</p>
            <div className="hero-actions">
              <Button to={c.home.hero.primaryCta.route} light>
                {c.home.hero.primaryCta.label}
              </Button>
              <Link
                className="hero-talk"
                href={href(c.home.hero.secondaryCta.route)}
              >
                {c.home.hero.secondaryCta.label}
                <Arrow />
              </Link>
            </div>
          </div>
          <div className="hero-footnote">
            <span>{c.brand.descriptor}</span>
            <a href="#services">
              DISCOVER PMP <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>
      <div className="brand-strip" aria-hidden="true">
        <span>STRATEGY</span>
        <i className="asterisk">✳︎</i>
        <span>CREATIVITY</span>
        <i className="asterisk">✳︎</i>
        <span>PRODUCTION</span>
        <i className="asterisk">✳︎</i>
        <span>MEDIA</span>
        <i className="asterisk">✳︎</i>
        <span>CONNECTED.</span>
      </div>
      <section className="section intro">
        <div className="container intro-grid">
          <Label num="01">The bigger picture</Label>
          <div>
            <h2>{c.home.about.heading}</h2>
            <p className="large-copy">{c.home.about.body}</p>
            <Link className="text-link" href={href(c.home.about.cta.route)}>
              {c.home.about.cta.label}
              <Arrow />
            </Link>
          </div>
          <div className="intro-seal" aria-hidden="true">
            Your growth.
            <br />
            <span>Our pulse.</span>
            <b>
              <Arrow />
            </b>
          </div>
        </div>
      </section>
      <section className="section services-home" id="services">
        <div className="container">
          <div className="section-heading">
            <Label num="02">What we do</Label>
            <div>
              <h2>{c.home.services.heading}</h2>
              <p>{c.home.services.body}</p>
            </div>
          </div>
          <div className="service-rows">
            {c.services.map((s, i) => (
              <Link
                className="service-row"
                key={s.id}
                href={href(`/services/${s.slug}`)}
              >
                <span className="row-number">0{i + 1}</span>
                <h3>{s.name}</h3>
                <span className="row-arrow">
                  <Arrow />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section home-work">
        <div className="container">
          <div className="section-heading">
            <Label num="03">Selected work</Label>
            <div>
              <h2>{c.home.work.heading}</h2>
              <p>{c.home.work.body}</p>
            </div>
          </div>
          {projects.length ? (
            <ProjectGrid projects={projects.slice(0, 3)} />
          ) : (
            <div className="work-invitation">
              <div className="work-invitation-symbol" aria-hidden="true">
                <Arrow />
              </div>
              <div>
                <h3>{c.workPage.emptyHeading}</h3>
                <p>{c.workPage.emptyBody}</p>
                <Link className="text-link" href="/en/contact#inquiry">
                  {c.workPage.cta.label}
                  <Arrow />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
      <Process />
      <Closing />
    </>
  );
}

export function ProjectPreview({ project }: { project: LandingProject }) {
  return (
    <section className="project-preview">
      <div className="project-preview-media">
        <Image src={project.image} alt="" fill sizes="92vw" priority />
      </div>
      <div className="container project-preview-copy">
        <p className="eyebrow">Selected project · {project.number}</p>
        <h1>{project.title}</h1>
        <p>{project.category}</p>
        <p className="project-preview-note">
          The complete case study is being prepared for the next project phase.
        </p>
        <Link className="button light" href="/en#work">
          Back to our work <Arrow />
        </Link>
      </div>
    </section>
  );
}
export function Services() {
  return (
    <>
      <PageHero
        label="Our expertise"
        title={c.servicesPage.heading}
        body={c.servicesPage.body}
      />
      <section className="section container services-index">
        {c.services.map((s, i) => (
          <Link key={s.id} href={href(`/services/${s.slug}`)}>
            <span className="row-number">0{i + 1}</span>
            <h2>{s.name}</h2>
            <p>{s.summary}</p>
            <Arrow />
          </Link>
        ))}
      </section>
      <Closing
        heading={c.servicesPage.closingHeading}
        body={c.servicesPage.closingBody}
        label={c.servicesPage.closingCta.label}
      />
    </>
  );
}
export function ServicePage({ service: s }: { service: Service }) {
  return (
    <>
      <section className="page-hero service-hero">
        <div className="container">
          <Link className="breadcrumb" href="/en/services">
            Services <span aria-hidden="true">/</span> {s.name}
          </Link>
          <h1>{s.heading}</h1>
          <div className="service-hero-bottom">
            <p>{s.intro}</p>
            <Button to={`/contact?service=${s.id}#inquiry`} light>
              {s.ctaLabel}
            </Button>
          </div>
        </div>
      </section>
      <section className="section container capabilities">
        {s.groups.map((group, i) => (
          <div className="capability-group" key={group.heading}>
            <div>
              <Label num={`0${i + 1}`}>{s.name}</Label>
              <h2>{group.heading}</h2>
              {"intro" in group && <p>{group.intro}</p>}
            </div>
            <div>
              {group.items.map((item, j) => (
                <article key={item.title}>
                  <span>0{j + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
      {projects.some((p) => p.serviceIds.includes(s.id)) && (
        <section className="section container">
          <h2>{c.shared.relatedWorkHeading}</h2>
          <ProjectGrid
            projects={projects
              .filter((p) => p.serviceIds.includes(s.id))
              .slice(0, 3)}
          />
        </section>
      )}
      <Closing
        heading={s.closingHeading}
        body={s.closingBody}
        label={s.ctaLabel}
        to={`/contact?service=${s.id}#inquiry`}
      />
    </>
  );
}
export function WorkPage() {
  return (
    <>
      <PageHero
        label="The portfolio"
        title={c.workPage.heading}
        body={c.workPage.body}
      />
      <Suspense fallback={<p className="container">Loading work…</p>}>
        <Work />
      </Suspense>
      <Closing />
    </>
  );
}
export function About() {
  const a = c.aboutPage;
  return (
    <>
      <PageHero label="Meet PMP" title={a.heading} body={a.intro} />
      <section className="section container about-intro">
        <Label num="01">A shared direction</Label>
        <div>
          {a.paragraphs.map((p) => (
            <p className="large-copy" key={p}>
              {p}
            </p>
          ))}
        </div>
      </section>
      <section className="section why-section">
        <div className="container">
          <div className="section-heading">
            <Label num="02">{a.why.heading}</Label>
            <h2>{a.why.intro}</h2>
          </div>
          <div className="why-grid">
            {a.why.items.map((x, i) => (
              <article key={x.title}>
                <span className="step-number">0{i + 1}</span>
                <h3>{x.title}</h3>
                <p>{x.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Process />
      <section className="section container vision-grid">
        {[a.vision, a.mission].map((x) => (
          <article key={x.heading}>
            <Label>{x.heading}</Label>
            <h2>{x.body}</h2>
          </article>
        ))}
      </section>
      <section className="section founder">
        <div className="container founder-inner">
          <Label>The person behind the pulse</Label>
          <div>
            <span className="founder-role">{a.founder.role}</span>
            <h2>{a.founder.name}</h2>
            <p>{a.founder.body}</p>
          </div>
          <span className="founder-arrow" aria-hidden="true">
            <Arrow />
          </span>
        </div>
      </section>
      <Closing heading={a.closingCta.heading} body={a.closingCta.body} />
    </>
  );
}
export function Contact() {
  const d = c.contactPage.details;
  return (
    <>
      <PageHero
        label="Start a conversation"
        title={c.contactPage.heading}
        body={c.contactPage.body}
      />
      <section className="section container contact-layout">
        <aside className="contact-details">
          <Label>Good things start with a hello.</Label>
          <div>
            <span>Email us</span>
            <a href={d.emailHref}>
              {d.email}
              <Arrow />
            </a>
          </div>
          <div>
            <span>Give us a call</span>
            <a dir="ltr" href={d.phoneHref}>
              {d.phoneDisplay}
              <Arrow />
            </a>
          </div>
          <div>
            <span>Find us in</span>
            <p>{d.location}</p>
          </div>
          <a className="text-link" href={d.whatsappHref}>
            Let&apos;s talk on WhatsApp
            <Arrow />
          </a>
        </aside>
        <Suspense fallback={<p>Loading inquiry details…</p>}>
          <InquiryForm enabled={inquiryReady()} />
        </Suspense>
      </section>
    </>
  );
}
export function Privacy() {
  return (
    <>
      <PageHero label="Legal" title={c.privacyPage.heading} />
      <section className="section container privacy-copy">
        {process.env.PRIVACY_NOTICE && process.env.PRIVACY_REVISION ? (
          <>
            <p className="eyebrow">Revision: {process.env.PRIVACY_REVISION}</p>
            <div className="notice-text">{process.env.PRIVACY_NOTICE}</div>
          </>
        ) : (
          <>
            <h2>A note before you get in touch.</h2>
            <p>
              The full privacy notice is awaiting approval. Online inquiry
              submission is disabled until the notice and delivery settings are
              ready.
            </p>
            <p>
              You can contact PMP directly at{" "}
              <a href={c.contactPage.details.emailHref}>
                {c.contactPage.details.email}
              </a>
              .
            </p>
          </>
        )}
      </section>
    </>
  );
}
