"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  aboutPanels,
  clientCards,
  industries,
  landingProjects,
  landingServices,
  typographyFrames,
} from "@/lib/landing-data";
import { Arrow } from "./sections";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const smoothstep = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function usePinnedProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const distance = Math.max(rect.height - window.innerHeight, 1);
      setProgress(clamp(-rect.top / distance));
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
  return progress;
}

function useInView(ref: RefObject<HTMLElement | null>, amount = 0.3) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: amount },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [amount, ref]);
  return visible;
}

function SectionTitle({
  eyebrow,
  white,
  accent,
  body,
  centered = false,
}: {
  eyebrow: string;
  white: string;
  accent: string;
  body?: ReactNode;
  centered?: boolean;
}) {
  return (
    <div className={`lp-section-title${centered ? " is-centered" : ""}`}>
      <div className="lp-eyebrow">
        <span>{eyebrow}</span>
        <i />
      </div>
      <h2>
        {white} <em>{accent}</em>
      </h2>
      {body && <div className="lp-section-intro">{body}</div>}
    </div>
  );
}

function Dialog({
  open,
  onClose,
  origin,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  origin?: DOMRect | null;
  label: string;
  children: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeRef.current?.focus());
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = priorOverflow;
      window.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, [onClose, open]);
  if (!open) return null;
  const viewportWidth = window.innerWidth || 1;
  const viewportHeight = window.innerHeight || 1;
  const originX = origin ? `${origin.left + origin.width / 2}px` : "50%";
  const originY = origin ? `${origin.top + origin.height / 2}px` : "70%";
  return (
    <div
      className="lp-dialog-backdrop"
      role="presentation"
      style={
        {
          "--dialog-origin-x": originX,
          "--dialog-origin-y": originY,
          "--viewport-width": `${viewportWidth}px`,
          "--viewport-height": `${viewportHeight}px`,
        } as CSSProperties
      }
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="lp-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <button
          ref={closeRef}
          type="button"
          className="lp-dialog-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <span />
          <span />
        </button>
        {children}
      </section>
    </div>
  );
}

function Hero() {
  const reduced = useReducedMotion();
  return (
    <section id="home" className="lp-hero" aria-label="PMP showreel">
      <h1 className="lp-visually-hidden">PMP — Platinum Marketing Pulse</h1>
      <video
        className="lp-hero-video"
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/home/pmp-showreel-poster.webp"
      >
        <source src="/media/home/pmp-showreel.mp4" type="video/mp4" />
      </video>
    </section>
  );
}

function AboutExperience() {
  const [active, setActive] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const panel = aboutPanels[active];
  const openDetails = (event: MouseEvent<HTMLButtonElement>) => {
    setOrigin(event.currentTarget.getBoundingClientRect());
    setDialogOpen(true);
  };
  return (
    <section id="about" className="lp-about lp-panel-section">
      <div className="lp-width">
        <div className="lp-about-eyebrow">
          <span>ABOUT THE AGENCY</span>
          <i />
        </div>
        <div className="lp-about-tabs" role="tablist" aria-label="About PMP">
          {aboutPanels.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-controls="about-panel"
              onClick={() => setActive(index)}
            >
              {item.tab}
            </button>
          ))}
        </div>
        <div id="about-panel" className="lp-about-stage" role="tabpanel">
          <div key={`${panel.id}-copy`} className="lp-about-copy">
            <h2>
              <span>{panel.titleWhite}</span>
              <em>{panel.titleAccent}</em>
            </h2>
            <p>{panel.summary}</p>
            <button type="button" className="lp-read-more" onClick={openDetails}>
              <span>Read More</span>
              <Arrow />
            </button>
          </div>
          <div key={`${panel.id}-image`} className="lp-about-image">
            <Image src={panel.image} alt="" fill sizes="55vw" priority={active === 0} />
          </div>
        </div>
      </div>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        origin={origin}
        label={`${panel.title} details`}
      >
        <div className="lp-about-dialog-copy">
          <span>ABOUT THE AGENCY</span>
          <h2><b>{panel.titleWhite}</b> <em>{panel.titleAccent}</em></h2>
          {panel.details.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="lp-about-dialog-media">
          <Image src={panel.image} alt="" fill sizes="45vw" />
        </div>
      </Dialog>
    </section>
  );
}

function ServicesExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = usePinnedProgress(sectionRef);
  const reduced = useReducedMotion();
  return (
    <section
      ref={sectionRef}
      id="services"
      className="lp-services lp-panel-section"
      style={{ "--services-progress": reduced ? 1 : progress } as CSSProperties}
    >
      <div className="lp-width">
        <div className="lp-services-heading">
          <SectionTitle
            eyebrow="WHAT WE OFFER"
            white="Our"
            accent="Services"
            body={
              <p>
                Different tools. One clear direction: your brand’s next move.
                <br />
                From branding and production to media and social media, we
                bring everything together to turn your vision into reality.
              </p>
            }
          />
          <div className="lp-services-promise">
            <i /> CREATIVE IDEAS <Arrow /> REAL IMPACT
          </div>
        </div>
        <div className="lp-service-deck">
          {landingServices.map((service, index) => (
            <Link
              href={service.href}
              key={service.id}
              className="lp-service-card"
              style={{ "--card-index": index } as CSSProperties}
            >
              <div className="lp-service-photo">
                <Image src={service.image} alt="" fill sizes="22vw" />
              </div>
              <div className="lp-service-card-body">
                <Image src={service.icon} alt="" width={54} height={54} />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <span className="lp-service-glint" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TypographyBridge() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = usePinnedProgress(sectionRef);
  const reduced = useReducedMotion();
  return (
    <section ref={sectionRef} className="lp-type-scroll" aria-label="PMP promise">
      <div className="lp-type-sticky">
        <div className="lp-type-glow" />
        {typographyFrames.map((frame, index) => {
          const phase = reduced
            ? index === typographyFrames.length - 1 ? 0.5 : 0
            : clamp(progress * typographyFrames.length - index);
          const enter = smoothstep(phase / 0.28);
          const leave = smoothstep((1 - phase) / 0.28);
          const presence = reduced
            ? index === typographyFrames.length - 1 ? 1 : 0
            : Math.min(enter, leave);
          const depth = (1 - presence) * -900;
          const scale = 0.38 + presence * 0.62;
          return (
            <div
              key={frame.lines.join("-")}
              className={`lp-type-frame lp-type-frame-${index + 1}`}
              style={
                {
                  opacity: presence,
                  transform: `translate3d(0, 0, ${depth}px) scale(${scale})`,
                  filter: `blur(${(1 - presence) * 16}px) brightness(${0.55 + presence * 0.45})`,
                } as CSSProperties
              }
            >
              {frame.lines.map((line, lineIndex) => (
                <p
                  key={line}
                  className={lineIndex === frame.accent ? "is-accent" : ""}
                >
                  {line}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WorkExperience() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (hovered || manualPause || reduced) return;
    const interval = window.setInterval(
      () => setActive((value) => (value + 1) % landingProjects.length),
      5000,
    );
    return () => window.clearInterval(interval);
  }, [hovered, manualPause, reduced]);
  const project = landingProjects[active];
  const selectProject = (index: number) => {
    setActive(index);
    setManualPause(true);
  };
  return (
    <section
      id="work"
      className="lp-work lp-panel-section"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setHovered(false);
      }}
    >
      <div className="lp-width">
        <SectionTitle
          eyebrow="SELECTED PROJECTS"
          white="Our"
          accent="Work"
          body={
            <p>
              A glimpse into the brands we’ve built, the stories we’ve told,
              and the results we’ve created.
            </p>
          }
        />
        <div className="lp-work-layout">
          <div className="lp-featured-work" aria-live="polite">
            <div key={project.id} className="lp-featured-image">
              <Image
                src={project.image}
                alt={`${project.title} project cover`}
                fill
                sizes="68vw"
              />
            </div>
            <div className="lp-featured-caption">
              <div>
                <h3>{project.title}</h3>
                <p>{project.category}</p>
              </div>
              <Link className="lp-view-project" href={`/en/work/${project.id}`}>
                <span>
                  <Arrow />
                </span>
                View Project
              </Link>
            </div>
          </div>
          <div className="lp-project-index">
            <div className="lp-index-heading">
              <span>PROJECT INDEX</span>
              <span>
                {String(active + 1).padStart(2, "0")} / {String(landingProjects.length).padStart(2, "0")}
              </span>
            </div>
            <div className="lp-project-list">
              {landingProjects.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={index === active ? "is-active" : ""}
                  aria-pressed={index === active}
                  onClick={() => selectProject(index)}
                >
                  <span>{item.number}</span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.shortCategory}</small>
                  </span>
                  <Image
                    src={item.thumbnail}
                    alt=""
                    width={150}
                    height={94}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              className="lp-explore-work"
              onClick={(event) => {
                setOrigin(event.currentTarget.getBoundingClientRect());
                setDialogOpen(true);
              }}
            >
              Explore All Work <Arrow />
            </button>
          </div>
        </div>
      </div>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        origin={origin}
        label="Explore all work"
      >
        <div className="lp-work-dialog-copy">
          <span>SELECTED PROJECTS</span>
          <h2>Explore all work.</h2>
          <p>Choose a project to see the full story behind the work.</p>
        </div>
        <div className="lp-work-dialog-grid">
          {landingProjects.map((item) => (
            <Link href={`/en/work/${item.id}`} key={item.id}>
              <Image src={item.thumbnail} alt="" width={300} height={190} />
              <span>{item.number}</span>
              <strong>{item.title}</strong>
              <small>{item.shortCategory}</small>
              <Arrow />
            </Link>
          ))}
        </div>
      </Dialog>
    </section>
  );
}

function IndustriesExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = usePinnedProgress(sectionRef);
  const reduced = useReducedMotion();
  return (
    <section
      ref={sectionRef}
      id="industries"
      className="lp-industries-scroll"
      aria-labelledby="industries-title"
    >
      <div className="lp-industries-sticky">
        <div className="lp-width">
          <div
            className="lp-industries-title"
            style={{ opacity: reduced ? 1 : clamp(progress * 7) }}
          >
            <SectionTitle
              eyebrow="WHO WE WORK WITH"
              white="Our"
              accent="Industries"
              body={
                <p>
                  Every industry has its own language.
                  <br />
                  We help your brand speak it with clarity and impact.
                </p>
              }
            />
          </div>
          <div className="lp-industry-grid">
            {industries.map(([title, description], index) => {
              const start = 0.12 + index * 0.052;
              const reveal = reduced ? 1 : clamp((progress - start) / 0.13);
              const row = Math.floor(index / 4);
              const direction = row % 2 ? -1 : 1;
              return (
                <article
                  key={title}
                  className="lp-industry-item"
                  style={
                    {
                      opacity: reveal,
                      transform: `translate3d(${(1 - reveal) * direction * 75}px, ${(1 - reveal) * 26}px, 0)`,
                      "--industry-reveal": reveal,
                    } as CSSProperties
                  }
                >
                  <Image
                    src={`/media/industries/industry-${String(index + 1).padStart(2, "0")}.png`}
                    alt=""
                    width={150}
                    height={150}
                  />
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <i />
                </article>
              );
            })}
            <div
              className="lp-industry-cta"
              style={{ opacity: reduced ? 1 : clamp((progress - 0.78) / 0.12) }}
            >
              <h3>
                Let’s talk about
                <br />
                <span>your industry.</span>
              </h3>
              <a href="#contact" className="lp-outline-link">
                Start a Conversation <Arrow />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClientOrbit() {
  const orbitRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const assets = useMemo(() => clientCards, []);
  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit || reduced) return;
    const cards = Array.from(
      orbit.querySelectorAll<HTMLElement>(".lp-client-position"),
    );
    let frame = 0;
    let started = performance.now();
    let lastPaint = 0;
    let running = false;
    let width = orbit.clientWidth;
    let height = orbit.clientHeight;
    const animate = (now: number) => {
      if (!running) return;
      frame = requestAnimationFrame(animate);
      if (now - lastPaint < 34) return;
      lastPaint = now;
      const radiusX = width * 0.48;
      const radiusY = height * 0.48;
      const centerX = width * 0.5;
      const centerY = height * 0.84;
      const phase = ((now - started) / 44000) * Math.PI * 2;
      cards.forEach((card, index) => {
        const angle = phase + (index / cards.length) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radiusX;
        const y = centerY - Math.sin(angle) * radiusY;
        const depth = (Math.sin(angle) + 1) / 2;
        const scale = 0.72 + depth * 0.28;
        card.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
        card.style.opacity = String(0.18 + depth * 0.82);
        card.style.zIndex = String(Math.round(depth * 20));
      });
    };
    const visibility = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running) {
        started = performance.now();
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(frame);
      }
    });
    const size = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
    });
    visibility.observe(orbit);
    size.observe(orbit);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      visibility.disconnect();
      size.disconnect();
    };
  }, [reduced]);
  return (
    <div
      ref={orbitRef}
      className={`lp-client-orbit${reduced ? " is-static" : ""}`}
      role="list"
      aria-label="PMP client logos"
    >
      {assets.map((asset, index) => (
        <div className="lp-client-position" role="listitem" key={`${asset}-${index}`}>
          <div className="lp-client-card">
            <Image
              src={asset}
              alt=""
              width={210}
              height={210}
              sizes="(max-width: 700px) 120px, 190px"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ClientsExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const visible = useInView(sectionRef, 0.16);
  return (
    <section
      ref={sectionRef}
      className={`lp-clients lp-panel-section${visible ? " is-visible" : ""}`}
      aria-labelledby="clients-heading"
    >
      <div className="lp-width lp-clients-copy">
        <div className="lp-client-heading-rule" />
        <h2 id="clients-heading">OUR CLIENTS</h2>
        <div className="lp-client-heading-rule" />
        <p>
          We’re proud to have worked alongside ambitious brands to bring their
          ideas to life.
          <br />
          Here are some of the teams who’ve trusted PMP with their next move.
        </p>
      </div>
      <ClientOrbit />
      <div className="lp-client-statement">
        <p>Trusted By Brands</p>
        <p>Moving Forward.</p>
        <a href="#contact" className="lp-client-cta">
          Start a project <Arrow />
        </a>
      </div>
    </section>
  );
}

export function LandingExperience() {
  return (
    <div className="landing-experience">
      <Hero />
      <AboutExperience />
      <ServicesExperience />
      <TypographyBridge />
      <WorkExperience />
      <IndustriesExperience />
      <ClientsExperience />
    </div>
  );
}
