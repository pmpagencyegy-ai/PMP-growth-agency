"use client";
import { Arrow } from "./sections";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { c, href } from "@/lib/content";
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <>
      <a className="skip" href="#main">
        {c.shared.skipLink}
      </a>
      <header className="header">
        <div className="container header-inner">
          <Link href="/en" className="wordmark" aria-label="PMP home">
            PMP<span className="wordmark-dot">.</span>
          </Link>
          <nav aria-label="Main navigation" className="desktop-nav">
            {c.navigation.map((n) => (
              <Link
                aria-current={path === href(n.route) ? "page" : undefined}
                key={n.label}
                href={href(n.route)}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link className="header-cta" href={href(c.primaryCta.route)}>
            {c.primaryCta.label}
            <span aria-hidden="true">
              <Arrow />
            </span>
          </Link>
          <button
            ref={trigger}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? c.shared.menuClose : c.shared.menuOpen}
            onClick={() => {
              setOpen(!open);
              if (!open)
                setTimeout(
                  () =>
                    panel.current
                      ?.querySelector<HTMLAnchorElement>("a")
                      ?.focus(),
                  0,
                );
            }}
          >
            {" "}
            {open ? "Close −" : "Menu +"}{" "}
          </button>
        </div>
      </header>
      {open && (
        <nav
          ref={panel}
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
            if (e.key === "Tab") {
              const links = panel.current?.querySelectorAll("a");
              if (!links) return;
              const first = links[0],
                last = links[links.length - 1];
              if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
              } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
              }
            }
          }}
        >
          <button className="mobile-close" onClick={close}>
            {c.shared.menuClose} ×
          </button>
          {c.navigation.map((n, i) => (
            <Link key={n.label} href={href(n.route)} onClick={close}>
              <span>0{i + 1}</span>
              {n.label}
              <span>
                <Arrow />
              </span>
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
