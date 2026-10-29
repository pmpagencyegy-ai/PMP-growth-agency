"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  ["Home", "home"],
  ["About", "about"],
  ["Services", "services"],
  ["Our Work", "work"],
  ["Industries", "industries"],
  ["Contact", "contact"],
] as const;

export function Header() {
  const pathname = usePathname();
  const onHome = pathname === "/en" || pathname === "/en/";
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("home");
  const lastScroll = useRef(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY;
      const delta = next - lastScroll.current;
      if (next < 80) setHidden(false);
      else if (Math.abs(delta) > 5) setHidden(delta > 0);
      lastScroll.current = next;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return;
    const sections = links
      .map(([, id]) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55%", threshold: [0, 0.15, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", open);
    if (open) {
      window.setTimeout(
        () => panel.current?.querySelector<HTMLElement>("button,a")?.focus(),
        0,
      );
    }
    return () => document.body.classList.remove("menu-is-open");
  }, [open]);

  function target(id: string) {
    return onHome ? `#${id}` : `/en#${id}`;
  }

  function close(restoreFocus = false) {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  }

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={`pmp-header ${hidden && !open ? "is-hidden" : ""}`}>
        <div className="pmp-nav-shell">
          <Link className="pmp-nav-logo" href={target("home")} aria-label="PMP home">
            <Image src="/brand/pmp-logo.svg" alt="PMP — Platinum Marketing Pulse" width={340} height={120} priority />
          </Link>
          <nav className="pmp-desktop-nav" aria-label="Main navigation">
            {links.slice(0, -1).map(([label, id]) => (
              <Link key={id} href={target(id)} className={active === id ? "is-active" : ""}>
                {label}
              </Link>
            ))}
          </nav>
          <Link className="pmp-nav-cta" href={target("contact")}>
            Let&apos;s Talk <span aria-hidden="true">→</span>
          </Link>
          <button
            ref={trigger}
            className="pmp-menu-toggle"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="pmp-mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>
      {open && (
        <nav
          ref={panel}
          id="pmp-mobile-menu"
          className="pmp-mobile-menu"
          aria-label="Mobile navigation"
          onKeyDown={(event) => {
            if (event.key === "Escape") close(true);
            if (event.key !== "Tab") return;
            const focusable = panel.current?.querySelectorAll<HTMLElement>("a,button");
            if (!focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }}
        >
          <button type="button" onClick={() => close(true)} aria-label="Close menu">Close ×</button>
          {links.map(([label, id], index) => (
            <Link key={id} href={target(id)} onClick={() => close()}>
              <span>0{index + 1}</span>{label}<span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
