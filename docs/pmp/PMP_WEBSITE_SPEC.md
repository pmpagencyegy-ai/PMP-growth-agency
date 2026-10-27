# PMP Website Technical Specification

Version 1.0 | 27 October 2026 | Prepared for PMP and the Codex implementation agent

Build a premium, portfolio-led marketing agency website that helps visitors understand PMP, explore relevant work and services, and submit a project inquiry. This specification defines the pages, content, visual system, interactions, technical architecture, and acceptance checks. It is an implementation handoff; it does not include a built or deployed website.

## 1 How to use this handoff

Start with README.txt and CODEX_START_PROMPT.txt. Use this file for requirements, pmp-content.en.json for the proposed English website copy, and asset-manifest.json for required media. The Word technical sheet combines the specification and English copy for human review.

Place these files under docs/pmp in the implementation repository. Preserve the existing repository's instructions and working application. Use the recommended stack only for a new repository or a compatible existing project. When platform requirements differ, document the adaptation and preserve the behavior defined here.

All copy in the JSON is proposed for PMP review. Known contact information comes from the supplied brief. New connective copy, process wording, and completed truncated passages are editorial proposals. Facts, project results, credentials, client names, assets, legal wording, and translations require their own approval. Do not treat approval of the layout as approval of those facts.

## 2 Product goals and scope

Primary audience: business owners, founders, and marketing teams evaluating an agency for a focused project or ongoing marketing support. This audience definition is a planning assumption.

Primary conversion: a successfully submitted project inquiry. Secondary conversions: WhatsApp, email, and phone clicks. Supporting behaviors: viewing work, reading a service page, and moving from a case study to contact.

The first implementation includes Home, Work, Services, six service detail pages, About, Contact, Privacy Notice, a case study template, and a custom 404. English copy is supplied. Arabic support is part of the full website requirement; build the locale architecture immediately and publish Arabic only after a complete translation is reviewed. English-first is the build order, not a removal of the bilingual requirement.

Excluded from this scope: e-commerce, client accounts, payment processing, careers, a blog, a CRM dashboard, live social feeds, and a custom CMS. Do not add these without a separate requirement. Begin with version-controlled content; a CMS can be added later if PMP needs frequent nontechnical editing.

## 3 Decisions resolving the source brief

| Source request | Execution decision |
| --- | --- |
| Two hero headline options | Use Make your next move as the homepage headline. Keep Your growth is our pulse as the brand tagline and About headline. |
| Moving text in the hero | Use real HTML text over the video. Keep the headline stationary and readable; a subtle entrance is optional. Do not burn important copy into video. |
| Homepage video across all pages | Share the visual system across pages. Play the showreel on Home only; use specific project media or stills on interior pages. This is a performance and relevance recommendation. |
| Remove contact video | Use a static Contact page with a clear form and contact details. |
| Services shown as names only | Use typography-led rows with names and arrows on Home. Show descriptions on the Services index and detail pages. |
| Add service words to cover images | Overlay live HTML service labels. Keep source images clean and accessible. |
| Add slogan and numbers to video | Keep the tagline in HTML. Render statistics only from approved, sourced records; screenshot reference numbers are not PMP evidence. |
| Several Read More links | Use meaningful destinations such as Meet PMP and service titles. Put vision and mission on About rather than in homepage pop-ups. |
| Client logo composition | Use an orderly responsive logo grid or restrained static composition. Never alter, crop, recolor without permission, or write inside client logos. |
| Kavra branding example | Prepare a draft case study record and asset request. Publish only approved project material and claims. |

## 4 Sitemap and routing

All public content routes use a locale prefix. The paths below are locale-relative; resolve /contact as /en/contact or /ar/contact using a single link helper. Keep query strings and anchors when adding a locale.

| Route | Page and purpose |
| --- | --- |
| / | Home and first impression |
| /work | Filterable portfolio |
| /work/[slug] | Approved individual case study |
| /services | Six service categories |
| /services/production | Video, photo, podcast, and print production |
| /services/branding | Brand strategy and identity |
| /services/media-coverage | Media coverage and public relations |
| /services/social-media | Social strategy, content, and management |
| /services/media-buying | Paid campaigns and performance advertising |
| /services/seo-web-development | Two content groups on one page: SEO and Web Development |
| /about | Agency, approach, vision, mission, and founder |
| /contact | Contact details and project inquiry form |
| /privacy | Owner-approved privacy notice |

At the domain root, redirect / to /en by default. When Arabic is active, the language switch opens the equivalent route and preserves valid service/filter parameters. It must never strand a visitor on a missing translation. Unsupported locales and unknown slugs return a real 404. API, assets, robots.txt, and sitemap.xml are not locale-prefixed.

Keep navigation short: Home, Work, Services, About, Contact, plus Start a Project. The primary CTA targets /contact#inquiry. Service CTAs target /contact?service={serviceId}#inquiry. Validate serviceId against the six allowed IDs; unknown values leave the selector unselected.

Migration: the source identifies https://pmp-agency.com/en/home. Map /en/home to /en with a permanent redirect at migration. Inventory other current indexed URLs before replacing the existing site; map equivalent content individually. Do not redirect every unknown URL to Home. Confirm the final production origin before setting SITE_URL or changing DNS.

## 5 Page layouts and behavior

### Home

1. Header: logo at inline start, desktop links, language switch when available, and Start a Project. Use a readable solid background after scrolling. Do not hide keyboard focus under the sticky header.
2. Hero: 8 to 12 second authentic project montage, poster image, one H1, short support copy, Explore Our Work and Let's Talk. Use an opaque enough overlay for text contrast on every frame. The text and buttons must work before video loads.
3. Selected work: three approved projects in a deliberate editorial grid. Each card includes a real cover, project name, service label, and link. One featured card may be larger; preserve a logical reading order. Mobile uses one column.
4. Services: six numbered typographic rows. Each complete row is one accessible link with an arrow. No service thumbnails here. Do not make a click necessary to discover the service name.
5. About teaser: concise paragraph and Meet PMP. Use one approved team or production image if available.
6. Clients: approved logo grid with names available to assistive technology. Hide the complete block when there are no approved logos.
7. Approach: four short steps from the content file. This is proposed process copy; PMP should confirm it reflects the actual workflow.
8. Closing CTA and footer: clear project invitation, contact links, legal link, and approved social profiles. No decorative contact video.

A statistics block is optional and disabled by default. If used, insert it after clients and render no more than four approved figures with context, period, and provenance retained in the content record. No animated invented counters.

### Services index and detail pages

The index uses an introductory H1 followed by six stacked rows containing service name, one-sentence summary, and a detail link. Detail pages use a single shared template: breadcrumb, service title and intro, approved cover, capability groups, related approved work, closing CTA, and footer.

Keep capability descriptions visible rather than burying everything in accordions. For SEO and Web Development, show both groups with optional in-page anchor links. A service cover is not required for the component to render; use a clean typographic header when missing.

Related work matches the project's serviceIds and shows up to three published projects. Omit the block when there are no matches. Do not repeat unrelated projects to fill space.

### Work index and case studies

Filters: All Work plus the six service names. Use ?service={id}, update the URL without a full reload, and support direct loads and browser back/forward. A project may match several categories. Filter controls are buttons with their selected state exposed. Announce the number of results accessibly. A clear reset returns to All Work.

Case study order: project name and summary; approved cover; client and services; challenge; PMP's approach; actual deliverables; gallery; results when verified; next project; Start a Project. Omit year, sector, results, or other optional facts when not supplied. Never display empty section headings.

For qualitative projects, approved visuals and deliverables are sufficient; do not invent performance figures. For quantitative results, retain metric name, unit, baseline, after value, comparison periods, source, and permission. Percentage uplift is (after minus baseline) divided by baseline times 100; if the baseline is zero, show the absolute change instead. Do not imply causation beyond the evidence.

Kavra is a candidate branding case study from the brief. Request identity files, menu, packaging, signage, and real applications. Keep Kavra's own colors and lighting; do not recolor client work burgundy. Avoid generic food photography as the only evidence of branding.

### About

Order: agency introduction, Why PMP, proposed four-step approach, vision and mission, founder block, closing CTA. Keep vision and mission visible. Use the supplied short founder introduction and name; do not publish the truncated academic qualifications or extended biography without verification. If no approved portrait exists, use a typographic founder block.

### Contact and footer

Desktop: contact details in one column and form in the other. Mobile: brief intro, form, then contact details. Give the form section id=inquiry and scroll margin for the fixed header. Keep keyboard users' focus logical when arriving from a CTA.

Use the brief's email, phone, and Dokki location. Show separate Email, Call, and WhatsApp actions. No calendar booking flow or response-time promise is supplied. Hide Get Directions until the exact office map URL is approved; do not guess a pin for Dokki.

The footer includes the wordmark or approved logo, short description, navigation, contact links, approved social links, and Privacy Notice. Compute the copyright year at build or render time. Do not add unverified awards or trust badges.

## 6 Visual design system

Direction: a premium creative agency portfolio, with strong typography, generous space, authentic project imagery, dark hero sections, and lighter reading sections. The source suggests burgundy and black. The following tokens are proposed implementation values, not a supplied brand guideline.

| Token | Proposed value | Application |
| --- | --- | --- |
| ink | #171216 | Dark surfaces and body text |
| burgundy | #7B1E3A | Primary buttons, active states, small accents |
| paper | #F5F1ED | Light content surfaces |
| white | #FFFFFF | Text on dark surfaces and clean panels |
| muted | #625B60 | Secondary text on light surfaces |
| border | #D9D0D4 | Dividers on light surfaces |
| content width | 1280px maximum | Centered page container |
| side padding | 20px / 32px / 64px | Mobile / tablet / desktop |
| spacing scale | 4, 8, 12, 16, 24, 32, 48, 64, 96px | Consistent rhythm |
| section spacing | 56px mobile / 96px desktop | Main content blocks |

Use licensed, self-hosted font files when available. Proposed typefaces are Manrope for English and Noto Sans Arabic for Arabic; an approved PMP typeface takes precedence. Use a regular body weight and a bold heading weight rather than loading many variants. Body text: at least 16px, approximately 1.6 line height. Hero title: fluid 44 to 88px; H2: 32 to 52px. Arabic type needs its own size and line-height adjustment; never apply Latin letter spacing to Arabic text.

Use a 12-column desktop grid, 8-column tablet grid, and 4-column mobile grid. Major component changes at 768px and 1024px; validate between breakpoints. Keep radius restrained, approximately 8 to 12px on media or form controls. Prefer rules, spacing, and type over enclosing every section in cards.

Keep project media at deliberate aspect ratios: 16:9 for hero and service covers, 4:3 for project cards, 9:16 for vertical social work. Store focal points when cropping matters. No horizontal scroll hijacking, custom cursor requirement, heavy 3D, or hover-only content. Essential information must work on touch screens.

Motion: 150 to 250ms for hover/focus transitions and optional 300 to 500ms restrained section entrances. Respect prefers-reduced-motion. Disable autoplay and decorative movement for reduced motion; use the poster. Avoid flashing cuts. Always provide a keyboard-accessible pause control for a looping hero.

## 7 Media and asset requirements

asset-manifest.json is the asset request list. expectedPath describes a future destination, not an existing file. Only an entry with status=approved, an actual src, dimensions where applicable, usage permission, and useful alt text can render as content. The manifest currently records missing source assets.

Use the real PMP logo in SVG where possible. Preserve proportions, clear space, and approved variants. Until supplied, use a plain text PMP name in development; do not draw a replacement logo from a screenshot. Use original project assets instead of extracting presentation thumbnails.

Hero video: 8 to 12 seconds; seamless loop; muted; playsInline; no audio track; MP4 and optional WebM; mobile-specific crop if needed. Target at most 4 MB desktop and 2 MB mobile. Poster target at most 200 KB. These are project budgets, not platform limits.

Load the poster first. Attach the video source after critical content is visible and only when playback is appropriate. Where Save-Data is exposed and enabled, prefer the poster. If autoplay is blocked or media fails, the poster stays visible and the layout remains complete. Pause out-of-view video. Do not load the homepage montage on every route.

Images: deliver responsive AVIF/WebP when suitable, preserve width and height to avoid layout shift, and lazy-load below the fold. Do not lazy-load the principal above-the-fold image. Aim for 1600 to 2400px source width for wide covers and 800 to 1200px for cards, adjusted to actual usage. Asset budgets must be checked against visual quality.

Embedded project videos are click-to-load. Prefer a local poster before loading third-party players. Content-bearing videos require captions and an appropriate transcript or alternative; the decorative montage must convey no essential information unavailable in nearby text.

## 8 Recommended implementation architecture

For a new standalone repository, use Next.js App Router, TypeScript, and CSS Modules or an already-established Tailwind setup. Use static or server-rendered marketing pages and small client components for the menu, filters, form, and optional media controls. Prefer native elements and CSS over animation or component-library dependencies for this small site.

Select currently supported stable versions at execution time, verify compatibility with the chosen host, pin dependencies in the lockfile, and use the matching official documentation. Do not hardcode a stale framework or Node version from this handoff. Next.js is a recommendation, not a reason to replace a suitable existing application.

The runtime must support the inquiry endpoint. A purely static export needs a separately hosted secure form API; it cannot implement the specified server endpoint by itself. Default to a host that supports the selected Next.js runtime. Do not deploy or buy services merely to complete the handoff.

| Repository area | Responsibility |
| --- | --- |
| app/[locale]/ | Public pages, localized layout, service and project routes |
| app/api/inquiries/route.ts | Server-only validation and email delivery |
| app/robots.ts and app/sitemap.ts | Crawl rules and published URL list |
| components/layout/ | Header, mobile navigation, footer, locale switch |
| components/sections/ | Hero, service rows, work grid, clients, process, CTA |
| components/forms/ | Inquiry form and accessible feedback |
| content/en.json and content/ar.json | Localized copy with identical structural keys |
| content/projects.json and content/assets.json | Approved projects and media registry |
| lib/content.ts and lib/i18n.ts | Validated content loading and locale route helpers |
| lib/inquiries/ | Schema, delivery adapter, rate limiter, configuration |
| styles/ | Tokens, base styles, layout, typography, RTL support |
| public/brand and public/media | Approved local media only |
| tests/ | Inquiry, routing, portfolio, and accessibility checks |

Use a shared ServicePage component for all six services and a shared CaseStudyPage for approved projects. The supplied JSON's route values are locale-relative. Keep all user-facing strings, including validation and navigation labels, in localized content. Do not embed long copy in JSX.

Create a site configuration module with defaultLocale=en, activeLocales=[en] until Arabic is approved, inquiryEnabled=false until delivery and privacy notice are configured, analyticsEnabled=false until configured, and productionOrigin derived from SITE_URL. Production eligibility is a separate validation function, not inferred from non-empty strings.

Server secrets: EMAIL_API_KEY or equivalent provider credential, INQUIRY_FROM, INQUIRY_TO, and rate-limit storage credentials if needed. Nonsecret settings: SITE_URL, email provider selection, active locales, optional analytics ID, and privacy notice revision. Do not expose secret values in NEXT_PUBLIC variables, client bundles, logs, or the repository. Commit .env.example with variable names and explanations only.

Use an email adapter with one implementation for the chosen transactional provider and a mock transport only in automated tests or explicitly labeled local development. The chosen provider and account belong to PMP. No app database or CRM is required for the first version; shared managed storage may still be needed for production rate limits and duplicate-request protection.

## 9 Content and publication model

Treat pmp-content.en.json as the proposed copy source and asset-manifest.json as the asset source. Import the copy into content/en.json; do not expose reviewStatus or internal notes as UI text. Validate content against types or a runtime schema. Blank arrays are intentional, not permission to generate fake records.

Minimum Project fields: id, slug, title, summary, serviceIds, coverAssetId, galleryAssetIds, challenge, approach, deliverables, status, and ownerApproved. Optional fields: clientName, year, sector, results, and nextProjectId. A published project requires owner approval, valid service IDs, approved assets, and no placeholder strings. Keep source/proof notes private to the content layer.

ClientLogo fields: clientName, assetId, permissionApproved, and optional officialHref. Statistic fields: value, unit, label, period, source, and ownerApproved. SocialLink fields: platform, label, approved URL. Do not use # links or guessed profiles.

The Kavra record in the manifest is a draft candidate, not publishable case study copy. No portfolio records or client logos are included as verified deliverables in the JSON. Hide missing optional blocks in production. A private preview may show labeled layout placeholders only when a dedicated preview flag is on; exclude them from sitemap and indexing. Never call a placeholder an actual client project.

## 10 Inquiry form contract

| Field | Rules | UI behavior |
| --- | --- | --- |
| name | Required, trimmed, 2 to 100 characters | autocomplete=name; accept Arabic and other scripts |
| email | Required, valid email, at most 254 characters | type=email; allow personal domains despite Work email label |
| phone | Optional, at most 32 input characters | type=tel; allow +, spaces, hyphens, and parentheses; 7 to 15 digits if present |
| serviceId | Required | One of six service IDs or not-sure |
| message | Required, trimmed, 20 to 3000 characters | Visible label and hint; preserve line breaks |
| website | Hidden anti-spam field | Not focusable and absent from assistive reading order |
| locale | Required system field | en or an active approved locale |
| sourcePath | Optional system field, at most 256 characters | Valid internal path only; strip arbitrary query data |
| requestId | Required system field | Fresh UUID per genuine submission; reuse for network retry |

Send JSON to POST /api/inquiries. Enforce a 16 KB request-body limit, supported content type, an allowed same-origin policy, field length limits, and server-side validation. Reject unsupported payload fields. Escape content used in HTML email; sanitize email headers. Set Reply-To from a validated email and use a verified sender as From. Never place user data directly in mail headers or executable markup.

Apply a production rate limit, initially five accepted attempts per ten minutes per trusted client identifier, with a global abuse limit. Use host-backed or shared storage; process memory alone is insufficient across instances. Only trust forwarding headers configured by the host. Keep the threshold configurable and review it after launch.

Use a persistent request key or the provider's documented idempotency support to suppress duplicates from retries. Repeated completed requests return the earlier result; pending retries must not send a second message. Do not store unnecessary full inquiry bodies for rate limiting or duplicate detection. Define minimal retention for these records with the selected implementation.

Submit states: idle, submitting, success, validation error, throttled, unavailable, delivery error. Disable repeat clicks during submission, preserve inputs on failures, focus the error summary when appropriate, and announce server status with a live region. Show success only after the server confirms the email provider accepted the message. Provider acceptance is not a guarantee of inbox delivery.

| HTTP status | Response shape | Meaning |
| --- | --- | --- |
| 200 | { ok: true, requestId } | Accepted, including a confirmed duplicate |
| 400 | { ok: false, code: INVALID_INPUT, fieldErrors } | Invalid field data |
| 403 | { ok: false, code: FORBIDDEN } | Rejected origin or abuse request |
| 413 or 415 | { ok: false, code } | Oversized body or unsupported type |
| 429 | { ok: false, code: RATE_LIMITED } | Throttled; include a valid Retry-After header |
| 503 | { ok: false, code: UNAVAILABLE } | Delivery not configured or temporarily unavailable |
| 502 | { ok: false, code: DELIVERY_FAILED } | Provider rejected or failed |

Response examples are notation, not literal unquoted JSON. Do not return provider secrets or raw internal errors. If email is unconfigured, return 503, disable online submission in the UI, and present the provided email and WhatsApp alternatives. Never simulate successful submissions in production. Do not send live test mail without a configured test recipient and explicit execution authorization.

Show a concise inquiry privacy notice linked to the approved full notice. Do not bundle newsletter enrollment into this form. The full notice must match the actual recipient, delivery provider, purposes, retention, analytics, and contact for privacy questions. PMP must supply or approve it before public form activation; this handoff does not invent legal policy.

## 11 Arabic and localization

English copy is complete in the supplied JSON. Create Arabic with matching content keys and get linguistic and brand review before activation. Do not ship English paragraphs under an Arabic route or a decorative language switch. Until Arabic is complete, hide the switch in production and expose no Arabic hreflang or sitemap entries.

Use html lang and dir correctly: en/ltr and ar/rtl. Use logical CSS properties, allow natural RTL reading order, and mirror directional navigation arrows where appropriate. Do not mirror logos, photographs, playback symbols, or brand artwork. Isolate email, URLs, phone numbers, and mixed-language tokens with dir=ltr or bdi. Test every page template in Arabic, including long menu labels and form errors.

Keep service IDs and slugs stable between languages. Localize visible titles, metadata, buttons, alt text, and error messages. Publish reciprocal language alternates only for existing approved counterparts. A route switch must preserve the content identity; where a counterpart is unavailable, do not offer that switch on that page.

## 12 SEO accessibility and performance

Each indexable page needs a unique title and description from the content file, one clear H1, logical H2/H3 structure, an absolute canonical URL, and relevant internal links. Use Next.js metadata APIs or the equivalent in the existing stack. Add approved Open Graph images, favicon assets, and locale metadata. [T1]

Generate sitemap entries only for published pages in active locales. Preview environments must use noindex and appropriate access protection; robots.txt alone is not privacy. On production, ensure indexable pages are not blocked inadvertently. Set Organization structured data using verified name, URL, logo, and contact information; do not invent reviews, aggregate ratings, or exact street addresses. Add breadcrumbs on service and case-study pages if implemented consistently.

Target WCAG 2.2 AA. Include a skip link, semantic landmarks, keyboard operation, visible focus, labeled controls, meaningful alt text, error association, and sufficient contrast. Normal text needs at least 4.5:1 contrast; large text and relevant interface boundaries need at least 3:1. Design touch targets to at least 44 by 44 CSS pixels as a project target. Test 200 percent zoom and reflow down to 320 CSS pixels. A mobile navigation overlay must close with Escape, keep focus inside while open, and return focus to its trigger. [T3]

Core Web Vitals targets at the 75th percentile of real visits: LCP at most 2.5 seconds, INP at most 200 milliseconds, and CLS at most 0.1, evaluated separately for mobile and desktop. These are post-launch field goals; a local Lighthouse run does not establish field compliance. Before launch, use repeatable mobile lab tests, investigate regressions, and target Lighthouse performance of at least 90 on representative pages as a project benchmark. [T2]

Provisional budgets: no more than 250 KB compressed initial client JavaScript on Home and no more than 1.5 MB initial page transfer before optional video/analytics. Measure the production build under the same conditions. Prefer optimized images, local fonts, and deferred optional media over adding caching layers to compensate for oversized files.

## 13 Analytics and observability

Analytics is optional and off until PMP provides an approved setup and any required consent behavior. Record only useful conversion events: project_open with projectId; service_open with serviceId; inquiry_start once per form interaction; inquiry_submit_success once per server-confirmed success; and contact_click with channel=email, phone, or whatsapp. Include locale and a sanitized pathname where useful.

Never send names, emails, phone numbers, inquiry messages, or unfiltered URL query strings to analytics. Keep event properties allowlisted. Do not count button clicks as successful leads. Track delivery failures with an opaque requestId and sanitized error category; redact payloads and credentials. Configure error monitoring only with an approved provider.

## 14 Implementation sequence

1. Inspect the repository, AGENTS.md, dependency files, and hosting constraints. Record the final stack and runtime commands. Keep existing work safe.
2. Load and validate content and asset data. Establish tokens, fonts, locales, the route helper, and shared layout. Make missing assets render safely.
3. Implement Home and the six service pages with the real proposed copy. Build responsive layouts before adding motion.
4. Implement Work filters and the case study template with isolated test fixtures. Keep unapproved projects out of production content.
5. Implement About and Contact, then server validation, delivery adapter, failure states, and spam protection. Configure secrets through the host, never source files.
6. Add approved media, Arabic content when ready, SEO metadata, redirects, privacy notice, and optional analytics.
7. Run the acceptance checks below. Produce a private review build where supported. Do not describe missing integrations or assets as complete.
8. Report the pages implemented, commands run, results, remaining blockers, configuration instructions, and deployment status. Deployment must follow the user's request and the selected environment's rules; this handoff does not itself authorize publishing.

## 15 Acceptance checks

| ID | Acceptance criterion |
| --- | --- |
| CONTENT 01 | All six service categories and every capability in the content JSON appear in the correct detail page. |
| CONTENT 02 | No Lorem ipsum, fabricated projects, reference-image metrics, unsupported qualifications, or missing-image icons appear publicly. |
| ROUTES 01 | All active routes load directly and after refresh; invalid slugs/locales return 404. |
| ROUTES 02 | /en/home redirects to /en; canonical URLs and sitemap use the chosen production origin. |
| CTA 01 | Header and closing CTAs reach the form; each service CTA selects the correct service. |
| WORK 01 | Filters match service IDs, URL state survives refresh, browser back works, and empty results can reset. |
| FORM 01 | Invalid fields show accessible errors; valid requests reach a mock provider in automated tests. |
| FORM 02 | Delivery failure, unconfigured delivery, rate limit, large payload, and duplicate retry behave as specified. |
| FORM 03 | Production success is impossible without server acceptance; sensitive content is absent from logs and analytics. |
| MEDIA 01 | Hero remains readable with blocked video, reduced motion, slow loading, and missing optional media. |
| A11Y 01 | Keyboard navigation, focus return, pause control, contrast, labels, and zoom/reflow pass review. |
| RESPONSIVE 01 | Layouts work at 360, 390, 768, 1024, and 1440px, plus 320px reflow; no accidental horizontal overflow. |
| LOCALE 01 | Every active locale has complete copy; Arabic uses RTL and preserves phone/email readability. |
| SEO 01 | Published pages have unique metadata, valid canonicals, working social previews, and no accidental noindex. |
| QUALITY 01 | Type checking, linting, production build, focused tests, and browser smoke checks pass with commands recorded. |
| PERFORMANCE 01 | Production lab measurements and transfer budgets are recorded; field CWV is marked pending until real traffic exists. |

Use focused tests for service-prefill parsing, published-content gating, locale routes, filters, and inquiry validation/delivery failures. Use browser tests for the mobile menu, keyboard form flow, successful mock submission, and an example case study. Run an automated accessibility scan and manual keyboard checks; an automated scan alone is insufficient.

## 16 Inputs and release readiness

| Input | Status in this handoff | Required action |
| --- | --- | --- |
| English copy | Proposed, complete | PMP reviews tone and service accuracy |
| Arabic copy | Not supplied | Translate all public strings and review before Arabic activation |
| Logo and fonts | Original assets not supplied | Supply approved logo variants and font files or approve proposed typography |
| Hero montage and poster | Not supplied | Export original PMP footage and approved still |
| Portfolio | Kavra identified as candidate only | Supply at least three approved featured projects and real assets for the intended work-led launch |
| Client logos | No approved list supplied | Provide artwork, names, and display permission or omit block |
| Founder | Name, role, and short intro supplied | Approve portrait and any extended biography; verify qualifications separately |
| Statistics | None verified | Supply evidence and context or omit completely |
| Contact details | Present in brief | Reconfirm destination email, phone, WhatsApp, and optional exact map pin |
| Form delivery | Provider and credentials not selected | Configure recipient, sender, provider, rate limits, and test transport |
| Privacy and analytics | Notice and settings not supplied | Approve notice and data handling before public inquiry activation |
| Hosting and domain | Existing domain referenced | Confirm host, ownership, DNS plan, SITE_URL, and migration redirects |

Codex can complete layout and behavior with controlled test data while these inputs are pending. A review preview may be usable with optional blocks omitted. The intended public launch requires approved copy and assets, working contact delivery, the approved privacy notice, completed migration checks, and real portfolio content. Arabic launch additionally requires full translation and RTL QA. Track each unresolved item explicitly; do not stop implementing independent work because one asset is missing.

## 17 Source map and technical references

Primary content source: PMP Website Content .pptx(1).pdf, 31 pages, supplied by PMP. Pages 2 to 5 cover positioning, navigation, and hero; 6 to 8 About, vision, mission, and founder; 9 to 14 service summaries and homepage visuals; 15 to 20 production and branding; 21 to 26 media coverage, social, and media buying; 27 to 28 SEO and web development; 29 to 30 Contact. Pages 1 and 31 are presentation covers and are not website sections.

The PDF truncates some paragraphs and biography text. The handoff rewrites those passages for web use without reconstructing unverified facts. The Media Monitoring description and complete four-step approach are proposed additions. The presentation's CLIENT NAME and CONTENT CALENDAR labels, reference screenshots, and sample numbers must not become website content.

The source links the existing site at https://pmp-agency.com/en/home and the portfolio at https://www.behance.net/pmp-agency. These are reference pointers, not a verified project inventory or a license to reuse every image. Obtain original approved assets from PMP. Pinterest and third-party design references in the PDF are mood references only; the written decisions here are sufficient to implement the layout without copying them.

Official technical references checked on 27 October 2026:

- T1: Next.js metadata and Open Graph images: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- T2: Google Web Vitals metrics and thresholds: https://web.dev/articles/vitals
- T3: W3C WCAG 2.2 quick reference: https://www.w3.org/WAI/WCAG22/quickref/
- T4: Next.js internationalization routing guidance: https://nextjs.org/docs/app/guides/internationalization

The stack, layout tokens, transfer budgets, contact limits, event plan, and implementation order are project recommendations. Recheck the official documentation for the actual installed framework version during implementation.
