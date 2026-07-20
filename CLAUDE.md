# Project instructions

## Commands

Package manager is **pnpm**. Verify UI changes without a browser via:

```bash
pnpm build          # next build — catches type + build errors
npx tsc --noEmit    # typecheck only (there is no `typecheck` script)
pnpm lint           # eslint
```

Dev server runs through portless at `https://sort-visualizer.localhost` (`pnpm dev`),
not `localhost:3000`. Use `pnpm dev:port` for plain `http://localhost:3000`. See README.

Import alias: `@/*` → `src/*`.

## Architecture

Scrollytelling explainer. Content and visuals are separate: each act's copy lives in
`src/content/*-steps.tsx` as arrays of `ContentStep`, and `src/app/page.tsx` pairs each
content array with a viz component (`src/components/viz/`) via `SECTION_SPECS`.

**Step numbering (gotcha):** display numbers ("01".."20") are assigned by a single running
counter in `page.tsx` and passed into each step's `render(num)`. Never hardcode step numbers
in content modules — inserting/removing a step would desync everything after it.

## Browser automation

Do not use `mcp__claude-in-chrome__*` tools or Playwright to drive a browser unless I explicitly ask you to. If you need to verify UI changes, build/typecheck instead and describe what to look for — let me drive the browser.
