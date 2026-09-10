# Documentation site

Astro with the [Starlight](https://starlight.astro.build/) documentation theme.
The homepage is a custom route (`src/pages/index.astro`), outside the themed
layout. Markdown under `src/content/docs/` is the documentation.

English only. Do not add translation scaffolding.

If `src/content/walkthrough/` exists, leave it. Capture files for the worked
example live there and are published by a later ticket.

## Build

From this directory, after Node is selected from the repository-root `.nvmrc`:

```bash
nvm use && npm ci && npm run build
```

That is the only local production-build command. Output is `dist/`. Preview
it with `npm run preview`. During work, `npm run dev` serves a live reload.

GitHub Actions runs the same `npm ci` and `npm run build` on every pull
request and on every push to `main`. A failed build skips the GitHub Pages
deploy. Pages is served at `https://theclaessens.github.io/faktion-skills/`.
