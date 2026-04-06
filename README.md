# Novel Web Viewer

Astro JS application deployed on Cloudflare Workers.

## Stack

| Layer | Technology |
|---|---|
| Framework | [Astro JS](https://astro.build) (SSR, `output: server`) |
| Runtime | [Cloudflare Workers](https://workers.cloudflare.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite` |
| Database | Cloudflare D1 (SQLite) |
| KV Storage | Cloudflare KV |
| Object Storage | Cloudflare R2 |
| AI | Cloudflare AI binding |
| Testing | [Vitest](https://vitest.dev) |
| SEO | `@astrojs/sitemap` |
| Crypto | `jose` (native crypto not supported on Workers) |
| Utilities | `lodash`, `p-queue` |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Local Astro dev server |
| `npm run build` | Type-check → test → build |
| `npm run wrangler-dev` | Build + run via Wrangler locally (port 8787) |
| `npm run wrangler-types` | Regenerate `worker-configuration.d.ts` from `wrangler.jsonc` |
| `npm test` | Run Vitest in watch mode |
| `npm run check` | Astro TypeScript check |
| `npm run deploy-development` | Deploy to development environment |
| `npm run deploy-staging` | Deploy to staging environment |
| `npm run deploy-production` | Deploy to production environment |

## Environments

Three Cloudflare environments are configured in `wrangler.jsonc`:
- **development** — `novel-web-viewer-development`
- **staging** — `novel-web-viewer-staging`
- **production** — `novel-web-viewer`

Replace all `YOUR_*_ID` placeholders in `wrangler.jsonc` with your actual Cloudflare resource IDs.

## Project Structure

```
src/
├── actions/            # Astro server actions
├── adapter/
│   ├── application/    # Use cases and DTOs
│   └── infrastructure/ # Services (D1, KV, R2, external APIs)
├── api/
│   ├── config/         # CORS and API config
│   └── routes/         # Elysia route definitions
├── assets/             # Static assets (processed by Astro)
├── cloudflare/
│   ├── worker.ts       # Worker entry point (fetch/queue/scheduled)
│   └── durable-objects/
├── components/         # Shared UI components
├── container/          # DI containers (ApiContainer, etc.)
├── controller/         # Thin controllers (delegate to services)
├── domain/             # Domain models and business rules
├── features/
│   └── theme/          # Dark mode ThemeScript
├── i18/                # i18n utilities
├── layouts/
│   └── Layout.astro    # Base layout
├── lib/                # Internal helper libraries
├── middleware/         # Astro middleware
├── pages/              # Astro pages and API routes
├── stores/             # Client-side state stores
├── styles/
│   └── globals.css     # Tailwind entry point
├── test/               # Vitest tests
├── types/              # Shared TypeScript types
└── utils/              # Utility functions
db/
└── schema.sql          # D1 database schema
```

## Bindings

After modifying bindings in `wrangler.jsonc` (KV, D1, R2, Durable Objects, AI), always run:

```bash
npm run wrangler-types
```

This keeps `worker-configuration.d.ts` in sync so `Astro.locals.runtime.env` stays fully typed.
