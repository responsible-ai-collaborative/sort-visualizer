# SORT Visualizer

A scrollytelling explainer of the SORT framework from Slattery et al. (2026), *Classification of AI incident trajectories* — built for the MIT AI Risk Initiative.

Stack: Next.js 16 (App Router), React 19, Tailwind v4, GSAP, Framer Motion, Lenis, Scrollama.

## Local development

This project uses [portless](https://github.com/vercel-labs/portless) so the dev server is reachable at a stable HTTPS URL instead of a shifting `localhost:PORT`.

```bash
pnpm install
pnpm dev
```

The site will be served at:

```
https://sort-visualizer.localhost
```

First-time setup: portless will generate a local CA and prompt for `sudo` to bind port 443 and add the CA to your system trust store. After that, no further setup is needed.

### Without portless

If you need to bypass the proxy (CI, debugging, no admin rights):

```bash
pnpm dev:port
```

That runs `next dev` directly on `http://localhost:3000`.

### Useful portless commands

```bash
portless list    # show active routes
portless trust   # re-add the local CA to your trust store
portless clean   # wipe portless state
```

## Build & production

```bash
pnpm build
pnpm start
```

## Project layout

- `src/app/` — Next.js App Router entry (page, layout, global styles)
- `src/components/` — section components (Header, Assumption, PivotSection, Closing, TuningPanel)
- `src/components/viz/` — visualization components (charts, quadrants, estimation panels)
- `src/lib/` — case data, incident counts, hooks
- `content.md` — site copy reference
- `incidents.csv` / `src/lib/incident-counts.json` — source data
