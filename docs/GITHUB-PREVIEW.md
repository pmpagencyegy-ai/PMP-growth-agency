# GitHub Pages preview

A separate static preview can be built without changing the primary Next.js server application:

```sh
node scripts/build-pages-preview.mjs /tmp/pmp-pages-publish
```

This stages source in a temporary directory, reuses installed dependencies, exports the 12 English pages under `/PMP-growth-agency`, and omits the inquiry API. Online inquiries and search indexing are explicitly disabled. Email/WhatsApp links remain functional. No credentials or local environment files are copied. The server version remains the intended version for real inquiry delivery.

The static output includes `.nojekyll`, a root redirect, the legacy home redirect, a custom 404, Next.js hydration assets and route data. It was checked with a local static HTTP server at the repository base path: homepage, service navigation, service-prefilled contact, refresh, disabled submission, portfolio filters and JavaScript error checks.

GitHub setup, when needed:

1. Open https://github.com/pmpagencyegy-ai/PMP-growth-agency/settings/pages
2. Choose **Deploy from a branch**, branch **gh-pages**, folder **/ (root)**, then **Save**.
3. Wait for the Pages deployment to finish. The expected URL is https://pmpagencyegy-ai.github.io/PMP-growth-agency/en/ — this is not a claim that publication has completed.

Source is kept on `preview/pmp-website`; `main` is not changed. `gh-pages` contains only generated static files. Publishing later updates requires rebuilding and pushing the generated output to that branch. Do not overwrite user commits or change repository visibility. GitHub's private-repository Pages eligibility depends on the account plan.

This workspace can read and push Git through the platform proxy, but its requests to `api.github.com` and the Pages hostname were blocked by network policy during this task. The two exact domains were saved as additions in the environment configuration draft; that save does not activate them. Live Pages status and automatic Pages activation remain unverified until access is applied or the owner enables Pages directly.
