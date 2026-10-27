"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { c, filteredProjects, serviceFrom } from "@/lib/content";
import { Arrow, Button, ProjectGrid } from "./sections";
export function Work() {
  const query = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const selected = serviceFrom(query.get("service"))?.id;
  const items = filteredProjects(selected);
  function filter(id?: string) {
    router.push(id ? `${path}?service=${id}` : path, { scroll: false });
  }
  return (
    <section className="section container work-section">
      <div
        className="filters"
        role="group"
        aria-label="Filter projects by service"
      >
        <button aria-pressed={!selected} onClick={() => filter()}>
          {c.workPage.allFilterLabel}
        </button>
        {c.services.map((s) => (
          <button
            key={s.id}
            aria-pressed={selected === s.id}
            onClick={() => filter(s.id)}
          >
            {s.name}
          </button>
        ))}
      </div>
      <p className="result-count" role="status">
        {items.length} projects
        {selected ? ` · ${serviceFrom(selected)?.name}` : ""}
      </p>
      {items.length ? (
        <ProjectGrid projects={items} />
      ) : (
        <div className="empty-work">
          <span className="empty-art" aria-hidden="true">
            <Arrow />
          </span>
          <div>
            <LabelText />
            <h2>
              {selected ? "More possibilities ahead." : c.workPage.emptyHeading}
            </h2>
            <p>{selected ? c.workPage.noMatches : c.workPage.emptyBody}</p>
            {selected && (
              <button className="text-link" onClick={() => filter()}>
                Reset to All Work{" "}
                <span aria-hidden="true">
                  <Arrow />
                </span>
              </button>
            )}
            <Button to={c.workPage.cta.route}>{c.workPage.cta.label}</Button>
          </div>
        </div>
      )}
    </section>
  );
}
function LabelText() {
  return <span className="eyebrow">An open invitation</span>;
}
