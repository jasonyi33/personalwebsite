# NERV-OS

Personal website rendered as an in-browser, NERV-themed operating system. Visitors land on a boot sequence, a desktop materializes, and every section of the site (projects, blog, about, now) opens as an "application" window inside that OS. Built on Next.js 16 (App Router) with Tailwind v4, MDX content via contentlayer2, framer-motion, zustand, and a `three.js` wireframe sphere inside the signature `NERV_Terminal` window.

## Develop

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build

```bash
npm run build
npm start
```

## Source of truth

The full design + build spec (color tokens, typography, OS architecture, per-app behavior, content schemas, implementation phases) lives at:

`/Users/jasonyi/.claude/plans/i-want-to-create-generic-narwhal.md`

Phase progress and personal content placeholders live in `SITE_FILLOUT.md`.
