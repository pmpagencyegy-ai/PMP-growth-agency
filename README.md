# PMP Growth Agency

Responsive Next.js App Router / TypeScript marketing website based on the supplied PMP handoff. English copy is proposed for owner review. No client projects, results, logos, photographs or credentials have been invented.

## Run locally

Requires Node.js 22.9+ (validated with 24.19.0) and npm. Work from this checkout; cloud tasks are already isolated and do not need a Git worktree.

```sh
cd /workspace/PMP-growth-agency
npm --cache /tmp/pmp-npm-cache ci
npm run dev
```

Open `/en` on the local development server. For a production build:

```sh
npm run build
npm run start
```

The server listens on port 3000. No deployment or domain changes are included.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:browser
```

Browser tests use `/usr/bin/chromium` in this cloud environment. Set `CHROMIUM_PATH` to a trusted installed Chromium elsewhere. Tests start the production server automatically; build first. Playwright's usual browser installation can also be used by adapting the executable path. No live email is sent by tests.

## Pages and content

Home, Work, Services, all six service detail routes, About, Contact, Privacy Notice scaffold, custom 404 and a publication-gated case study template are implemented. All public pages use `/en`. `/` redirects to `/en`; `/en/home` permanently redirects to `/en`. Unknown locales, routes and unpublished projects return 404. Work filters persist in the query string and support browser history. Service CTAs preselect the contact service.

- `content/en.json`: supplied proposed English content.
- `content/assets.json`: requested assets; missing and unapproved entries never render.
- `lib/content.ts`: locale helpers, approved asset checks, project publication gating.
- `components/pages.tsx`: page composition; `components/sections.tsx`: reusable sections and case study template.
- `docs/pmp/PMP_WEBSITE_SPEC.md`: original supplied specification, retained as reference.

Use local, approved assets with actual `src`, `alt`, width, height, permission and approved status. Supply project records with the typed fields in `lib/content.ts`; only published, owner-approved records with approved covers and galleries are displayed. Kavra remains unpublished. Add real projects to `projects` in the content file. Project results are intentionally absent until a verified data model and source evidence are supplied. No placeholder client logos or stock imagery are presented as PMP work.

System fonts avoid external font requests. The decorative rings and arrow are abstract CSS, not replacement logo artwork or client media. Hero video is omitted until approved footage and poster exist; integrating it requires reduced-motion fallback and an accessible pause button. Arabic routes and the language switch remain disabled. CSS uses logical properties and provides RTL overrides, but full translation and RTL QA are still required before adding Arabic to active locales.

## Inquiry delivery

Online submission is disabled by default, and the endpoint returns 503 for valid requests while unconfigured. Email, phone and WhatsApp remain usable. Copy `.env.example` to `.env.local` and enter real credentials only in secure local/hosting settings.

The server adapter targets **Resend** for delivery and **Upstash REST Redis** for cross-instance abuse limits and retry protection. These are implementation choices, not connected accounts. No accounts have been created or emails sent. Before activation:

1. Approve English copy, contact destinations and the full plain-text privacy notice. Set `PRIVACY_NOTICE` and `PRIVACY_REVISION`.
2. Configure `EMAIL_API_KEY`, verified `INQUIRY_FROM`, and `INQUIRY_TO` in the host.
3. Configure `RATE_LIMIT_REDIS_URL` and `RATE_LIMIT_REDIS_TOKEN`; allow HTTPS access to that actual Redis host and `api.resend.com`.
4. Deploy on Vercel and set `TRUSTED_CLIENT_IP_HEADER=x-vercel-forwarded-for`. The implementation trusts only this Vercel-overwritten header. On another host, review its trusted IP contract and adapt the server code before enabling; do not trust arbitrary forwarded headers.
5. Set the confirmed HTTPS production `SITE_URL`, then `INQUIRY_ENABLED=true`. Authorize a test recipient and live send separately before validating real delivery.

The endpoint validates input, same origin, content type and the 16KB body limit. Redis atomically limits to five attempts per client per ten minutes and 1,000 globally. It stores hashed client identifiers, request fingerprints and request state only, with ten-minute rate keys and 24-hour request keys; inquiry bodies are not stored there. Resend receives the inquiry as plain text with a fixed sender and validated Reply-To and a provider idempotency key. A success response means provider acceptance, not guaranteed inbox delivery. Pending ambiguous sends stay blocked for 24 hours; investigate provider state rather than blindly retrying them. Provider failures preserve form fields. Review rate thresholds and retention with PMP before launch.

## Publication and remaining inputs

Preview indexing is off by default. After approval, set `SITE_URL` and `SITE_PUBLIC=true` and rebuild to generate production canonicals, robots and sitemap. No social preview image is claimed until approved artwork exists. Analytics is not installed.

Public launch still needs approved logo/font assets, original hero media, at least three approved portfolio projects, optional client logos/social URLs, English approval, Arabic translation for a bilingual launch, approved privacy text, delivery credentials and live integration validation, final hosting/domain and legacy URL inventory. Confirm actual local performance and post-launch field metrics; do not treat a build as launch approval. See `docs/VALIDATION.md` for measured checks and limitations.
