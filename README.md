# SpotBill — marketing site

Production site for **SpotBill**, the Android billing & POS app from
**IT WORLD EXPERIENCE STORE**, Kerala.

The site has one job: get a shop owner to tap *Get it on Google Play*. Everything
else on the page exists to remove doubt before that tap.

> **Read `NOTES.md` before you deploy.** It lists the placeholder values you still
> need to fill in, the Google Play badge that must be swapped for Google's official
> artwork, and the legal review the privacy/terms pages need.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # generates brand assets, then a static export into out/
npm run lint
npm run typecheck
```

`npm run build` produces a fully static site in **`out/`** — no Node server, no API
routes, no server actions. It will run on Vercel, Netlify, Cloudflare Pages, S3, or
plain shared hosting.

---

## Editing the copy

**Every word a customer reads lives in `lib/content.ts`.** No user-facing string is
allowed inside a component. Changing headlines, feature bullets, FAQ answers, or the
legal pages is a one-file edit.

The file is organised in page order — `nav`, `hero`, `marquee`, `why`, `features`,
`offline`, `printer`, `setup`, `perfectFor`, `offer`, `faq`, `download`, `finalCta`,
`footer`, `support`, then `screens` (the sample bill data) and `legal`.

Two things worth knowing:

- **The FAQ array feeds both the accordion and the `FAQPage` structured data.** Edit
  it once and the rich result follows. They cannot drift apart.
- **Icons are referenced by name** (`icon: 'Zap'`), resolved in `lib/icons.ts`. If you
  add a new one, add it to that registry too — it's the only place lucide is imported.

Business details — phone, WhatsApp, email, domain, Play Store URL — are in
**`lib/site.ts`**, separate from the marketing copy.

---

## Turning the launch offer off

In `lib/site.ts`:

```ts
offerActive: false,
```

That is the whole change. It removes the hero ribbon, the entire pricing section, the
offer FAQ entry and the priced `offers` block in the structured data, all together.
Nothing else needs touching and no layout breaks.

---

## Deploying

### Vercel

Import the repo and accept the defaults — the Next.js preset picks up
`output: 'export'` and serves `out/` automatically. Set your production domain, then
update `site.domain` in `lib/site.ts` to match and redeploy so canonicals, OG URLs and
the sitemap point at the right host.

### Netlify

- Build command: `npm run build`
- Publish directory: `out`

### Anywhere else

Upload the contents of `out/` to the web root. The site is entirely static files.
`trailingSlash: true` is set, so `/support/` resolves to `/support/index.html` on hosts
that don't rewrite — no server config needed.

**After changing `site.domain` or `site.playStoreUrl`, rebuild.** Both are baked in at
build time, and the Play Store QR is regenerated from the URL.

---

## How it's built

| | |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript, static export |
| Styling | Tailwind CSS v4, design tokens in `app/globals.css` |
| Motion | GSAP 3 core + Lenis; scroll behaviour is IntersectionObserver + CSS |
| Icons | lucide-react |
| Fonts | `next/font` (self-hosted Archivo / Inter Tight / JetBrains Mono) |

### Layout

```
app/          routes, metadata, sitemap, robots, OG image
components/
  layout/     Nav, Footer, MobileDrawer, SmoothScroll, PageShell
  sections/   one file per band of the page
  phone/      PhoneFrame, the six live screens, Receipt
  ui/         Button, PlayBadge, Card, Eyebrow, Accordion, Marquee, Counter, Logo
lib/          content.ts (all copy) · site.ts (config) · seo.ts · gsap.ts · utils.ts
scripts/      generate-assets.mjs — brand SVGs, icons, favicon, manifest, QR
```

### Two conventions worth keeping

**The phone screens are React, not screenshots.** Six components under
`components/phone/` render the actual SpotBill UI from the design tokens, each with one
idle animation. They stay crisp at any DPI and are edited like any other component.
Screens below the fold are deferred behind an IntersectionObserver (`LazyScreen`) and
code-split — only the hero's billing screen is in the initial bundle.

**Motion is split deliberately.** GSAP drives the timeline-shaped things — the hero
load sequence, the receipt print, the idle screen loops, the accordion. Everything
scroll-position-driven is IntersectionObserver, CSS transitions and `position: sticky`,
coordinated through `lib/reveal.ts`, which also owns the single `requestAnimationFrame`
loop the receipt scrub and the parallax read from. ScrollTrigger is not a dependency;
see `NOTES.md` §5.3 for why.

**Every rupee figure goes through `formatINR()`** in `lib/utils.ts`, which uses
`Intl.NumberFormat('en-IN')` so you get ₹3,708 and never ₹3.708. Every rupee amount is
also set in the mono face. That is the typographic rule of this site — and it has a
performance edge to it: `₹` lives in the fonts' `latin-ext` subset, so a rupee sign in
body copy pulls down an extra 90KB font file. `components/ui/Rupees.tsx` keeps stray
amounts in running text inside the mono face automatically.

### Regenerating brand assets

```bash
npm run assets
```

Rebuilds the logo SVGs (mark, lockup, reverse, app icon) from the vector definitions in
`scripts/generate-assets.mjs`, the PWA icon set and `favicon.ico`, `site.webmanifest`,
and the Play Store QR. `npm run build` runs it first, so you rarely need it directly.

---

## Accessibility and motion

- Every non-essential animation sits behind `prefers-reduced-motion: no-preference`.
  Under reduced motion all content renders in its final state, the marquee is static,
  Lenis is never instantiated, and the pinned section falls back to stacked cards.
- Visible focus rings on everything interactive — 2px `--sb-blue-bright`, 2px offset.
- Skip link, semantic landmarks, one `h1` per page, `aria-expanded` on the accordion,
  `role="switch"` on the offline toggle.
- Lighthouse mobile: **Performance 96, Accessibility 100, Best Practices 100, SEO 100**,
  CLS 0, with no failed audits. `NOTES.md` §6 has the full numbers and how they got
  there.
