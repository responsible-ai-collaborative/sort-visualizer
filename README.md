# SORT Visualizer

A scrollytelling explainer of the SORT framework from Slattery et al. (2026),
*Classification of AI incident trajectories* — built for the MIT AI Risk Initiative.

The site walks through the framework one assumption at a time: how harm and exposure
bounds get constructed, which proxies stand in for the quantities nobody measures
directly, and how the resulting distribution lands (or fails to land) in one of the
four SORT quadrants. A companion page at `/classifier` runs the same probabilistic
classifier on your own point estimates.

**Read the paper:** <https://arxiv.org/abs/2604.19914>

> The paper is linked, never redistributed from this repo — there is no PDF in the
> tree and `*.pdf` is gitignored. Keep it that way.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · GSAP · Framer Motion ·
Scrollama · driver.js

Node 20+ (Node 24 LTS recommended), pnpm.

## Local development

This project uses [portless](https://github.com/vercel-labs/portless) so the dev server
is reachable at a stable HTTPS URL instead of a shifting `localhost:PORT`.

```bash
pnpm install
pnpm dev
```

The site is served at:

```
https://sort-visualizer.localhost
```

First-time setup: portless generates a local CA and prompts for `sudo` to bind port 443
and add the CA to your system trust store. After that, no further setup is needed.

### Without portless

If you need to bypass the proxy (CI, debugging, no admin rights):

```bash
pnpm dev:port     # next dev on http://localhost:3000
```

### Useful portless commands

```bash
portless list    # show active routes
portless trust   # re-add the local CA to your trust store
portless clean   # wipe portless state
```

## Checks

```bash
pnpm build          # next build — catches type + build errors
npx tsc --noEmit    # typecheck only (there is no `typecheck` script)
pnpm lint           # eslint
pnpm format         # prettier --write over src/
pnpm format:check   # prettier in CI mode
```

`pnpm start` serves the production build locally after `pnpm build`.

## Deployment

The app has no server-side data dependencies, no environment variables, and no
external API calls at runtime, so deployment is unusually boring. `vercel.json` only
declares the framework so the build is detected deterministically.

### Vercel (recommended)

Import the repo at [vercel.com/new](https://vercel.com/new). The defaults are correct:

| Setting          | Value                        |
| ---------------- | ---------------------------- |
| Framework preset | Next.js (from `vercel.json`) |
| Build command    | `pnpm build`                 |
| Install command  | `pnpm install`               |
| Output directory | `.next` (managed)            |
| Node version     | 24.x                         |
| Env vars         | none                         |

Pushes to `main` deploy to production; every other branch and PR gets a preview URL.

From the CLI:

```bash
pnpm dlx vercel@latest link      # one-time, links this dir to a Vercel project
pnpm dlx vercel@latest           # deploy a preview
pnpm dlx vercel@latest --prod    # deploy to production
```

### Anywhere else

Any host that runs a Node server works — there is nothing Vercel-specific in the app
code:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start        # serves on $PORT, default 3000
```

Note that `public/` is gitignored, so a deploy carries no static assets beyond what
Next.js emits from `src/`. The favicon is `src/app/icon.svg` (App Router convention),
not a `public/favicon.ico`. If you add real static assets later, un-ignore `public/`
but keep the `*.pdf` rule.

## Project layout

```
src/app/                  App Router entry — page, layout, globals.css, icon.svg
  classifier/             standalone "run it on your own numbers" tool
src/components/           section components (Header, Assumption, PivotSection, Closing)
  steps/                  per-step text primitives
  viz/                    visualizations (charts, quadrants, estimation panels)
src/content/*-steps.tsx   the prose — one array of `ContentStep` per act
src/lib/                  case data, incident counts, classifier, hooks
content.md                site copy reference (not consumed at build)
incidents.csv             AIID export, unrelated to the chart — kept for reference
```

### How content and visuals fit together

Copy and visuals are deliberately separate. Each act's prose lives in
`src/content/*-steps.tsx` as an array of `ContentStep`; `src/app/page.tsx` pairs each
content array with a viz component via `SECTION_SPECS`.

**Step numbering gotcha:** the display numbers ("01".."20") come from a single running
counter in `page.tsx`, passed into each step's `render(num)`. Never hardcode a step
number in a content module — inserting or removing a step would desync everything
after it.

## Data

`src/lib/incident-counts.json` is a real OECD AIM export (incidents + hazards,
2020-12 → 2025-12), schema `{ym, incidents, hazards}`. The chart computes its own
six-month rolling average, including partial windows at the series start. Chart copy
references "late 2025" and "five hundred a month" — keep those in sync if the data is
refreshed.

`src/lib/case-data.ts` is the single source for every number the visualizations
render; quadrant copy lives in `src/lib/quadrant-copy.ts`.
