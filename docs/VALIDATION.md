# Validation and release status

Validated on 27 October 2026 in the cloud workspace, using Node 24.19.0, Next.js 16.4.3 and the production server. This is a local review implementation, not a published website.

## Passed

- TypeScript (`npm run typecheck`), ESLint (`npm run lint`), production build (`npm run build`), and whitespace check (`git diff --check`).
- 10 unit tests (`npm test`): locale paths, query/anchor preservation, inactive Arabic, six-service integrity, project publication gates, international inquiry validation, provider acceptance/rejection, concurrent/completed retries, throttling, storage failure and ambiguous network outcomes. Provider and storage tests use isolated mocks; no live email was sent.
- 7 Playwright tests (`npm run test:browser`): home-to-service-to-contact navigation and prefill, disabled inquiry with real alternatives, portfolio URL filters/refresh/history/reset, 12 valid public pages, invalid routes/locales/unapproved Kavra 404s, legacy redirect, mobile menu Escape/focus return, reflow at 320/360/390/768/1024/1440px, automated accessibility scans and endpoint rejection/status behavior.
- Axe WCAG A/AA scans: Home, Branding detail, Work, About and Contact have zero reported violations. This does not establish a full WCAG conformance audit.
- Additional keyboard check: skip link moves focus to the main landmark. Home at 200% browser CSS zoom has no horizontal overflow. Mobile navigation and contact focus behavior are checked in Playwright.
- Desktop and mobile homepage screenshots inspected; missing system arrow glyphs were replaced with inline SVG. Unapproved media, logos, figures and projects are not displayed.

## Local mobile Lighthouse

Lighthouse 13.5.0, installed system Chromium, default simulated mobile conditions, production Home, single final run (no concurrent browser tests):

| Measure | Result |
| --- | --- |
| Performance | 97 |
| Accessibility | 100 |
| Best practices | 96 |
| SEO | 63 |
| Largest Contentful Paint | 2.1 seconds |
| Total Blocking Time | 180 milliseconds |
| Cumulative Layout Shift | 0 |
| Total transfer | 173 KiB |
| Script transfer | 157,925 bytes (about 154 KiB) |

The measured page meets the provisional 250 KB initial JavaScript and 1.5 MB initial transfer budgets. Video, portfolio media and analytics are absent, so remeasure after real assets are added. These are local lab observations, not field Core Web Vitals, an INP measurement, or guarantees for production traffic. SEO is intentionally limited by noindex, disallow-all robots and no canonical production origin. Best practices records the missing unapproved favicon request. A real favicon, canonical origin, approved social image and launch crawl settings remain pending. Raw final Lighthouse output is at `/tmp/pmp-lighthouse-final.json` in this instance.

## Still unverified or intentionally disabled

- Real Resend and shared Redis access, verified sender, live provider acceptance and inbox delivery: credentials/accounts were not supplied, and live sends were not authorized. Mock delivery outcomes pass. The form and API fail closed while unconfigured.
- Browser success/error flows for an enabled form and a populated case study are not exercised end to end; no real provider or approved project is available. Publication gating is unit-tested; real case study media and content still need review.
- Arabic translation, activation and full RTL QA; active routes are English only. RTL CSS is prepared, but bilingual completion is not claimed.
- Approved privacy text, English copy approval, real logo/fonts/favicon, original montage/poster, portfolio, client permissions and optional social links.
- Media pause/reduced-motion behavior for real footage is not implemented because no video is installed. The current static hero works without media and respects reduced motion for transitions.
- Final production domain/hosting configuration, access controls, legacy indexed-URL migration inventory and production crawl behavior.
- Broader assistive-technology audit, cross-browser testing and performance measurements on all templates.

## Environment persistence

The reusable `install_script` and `start_skill` were saved to the environment draft. Saving does not apply or publish that draft. Review and save them in environment settings, then publish the environment to retain the prepared filesystem for future tasks. That publishes the development environment, not the website or its domain.
