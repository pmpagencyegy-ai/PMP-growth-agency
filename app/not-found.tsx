import { Arrow } from "@/components/sections";
import Link from "next/link";
import { c } from "@/lib/content";
export default function NotFound() {
  return (
    <main className="not-found">
      <Link href="/en" className="wordmark">
        PMP.
      </Link>
      <span className="eyebrow">404 / A different direction</span>
      <h1>{c.shared.notFoundHeading}</h1>
      <p>{c.shared.notFoundBody}</p>
      <Link className="button light" href="/en">
        {c.shared.notFoundCta.label}
        <span aria-hidden="true">
          <Arrow />
        </span>
      </Link>
    </main>
  );
}
