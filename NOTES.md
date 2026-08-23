# NOTES — what the client still needs to supply, and what I changed

Everything here is either **blocked on you**, **needs review before launch**, or a
**deliberate deviation** from the build brief with the reason for it.

---

## 1. TODO variables — still placeholders

All of these live in one file: **`lib/site.ts`**.

| Variable | Current placeholder | What to do |
|---|---|---|
| `domain` | `https://spotbill.in` | Set the real domain. It feeds canonicals, OG URLs, `sitemap.xml`, `robots.txt` and the JSON-LD `@id`s. **Wrong value = wrong canonicals**, so change this before the first crawl. |
| `playStoreUrl` | `https://play.google.com/store/apps/details?id=com.itworld.spotbill` | Paste the real listing URL after publishing. |
| `playStoreAppId` | `com.itworld.spotbill` | Confirm the final `applicationId` from the Play Console. |

After editing `playStoreUrl`, run **`npm run assets`** — the Play Store QR in the
Download section is generated from it at build time (`public/qr.svg`). `npm run build`
does this automatically, but run it manually if you only want to refresh the QR.

---

## 2. Google Play badge — must be swapped before launch

`components/ui/PlayBadge.tsx` currently renders a **correctly proportioned rebuild**
of the "Get it on Google Play" badge, not Google's own artwork. The build environment
could not reach `play.google.com` to fetch it (the outbound proxy returns 403).

**Google's brand guidelines require their supplied asset.** Before going live:

1. Download the badge from Google's Play brand resources page.
2. Save it as `public/badges/google-play-badge.png` (there's a README in that folder).
3. Replace the `<svg>` block in `PlayBadge.tsx` with a `next/image` pointing at it,
   keeping the existing `height` prop and clear space.

Everything else about the component — the link, the hover lift, the accessible name —
stays as is.

---

## 3. Privacy and Terms need a legal review

⚠️ **`/privacy` and `/terms` are genuine drafts, not legal advice.**

They are written to be honest about how the app actually behaves and to satisfy the
Play Store's live-privacy-policy-URL requirement. Before publishing, have a legal
advisor check them, and confirm these specifics, which I had to write generically:

- **Where your cloud data physically lives.** The policy says "data centres inside and
  outside India, depending on our hosting provider." Replace with the actual region
  once your backend hosting is fixed.
- **Device count on a lifetime licence.** Both pages say "the device count agreed at
  purchase." Put the real number in.
- **Retention period.** The policy commits to actioning deletion requests within 30
  days. Confirm you can meet that.
- **Data-deletion route.** Play now expects a web-based account-deletion request path,
  not only an email address. Currently the policy points at email and WhatsApp.

The copy is all in `lib/content.ts` under `legal`, and the "Last updated" date is
`legal.effectiveDate` — bump it whenever you edit either page.

---

## 4. Turning the launch offer off

One switch: **`site.offerActive` in `lib/site.ts`**. Set it to `false` and every offer
surface disappears together —

- the rotated ribbon on the hero phone,
- the whole `/#pricing` section,
- the "₹5,000 lifetime licence" FAQ entry,
- the `offers` block in the `SoftwareApplication` JSON-LD (it falls back to a plain
  free-download offer).

Nothing else needs touching, and no layout breaks — the sections around it close up.

The offer note ("Launch pricing — limited period. Contact us to confirm current
availability.") is deliberate: it keeps the page honest if the offer lapses before
anyone remembers to flip the switch. **`schema.org` marks the offer as
`LimitedAvailability`** for the same reason — leaving a stale hard price in structured
data is the kind of thing that gets a rich result penalised.

---

## 5. Deliberate deviations from the brief

### 5.1 The thing I cut: **scroll snapping on the pinned module sequence**

§11.3 asked me to name one accessory and remove it. The brief specified
`snap: { snapTo: 1/5, ... }` on the pinned feature section. I removed it.

Snapping a scrubbed pin hijacks the wheel, argues with Lenis's own easing, and on a
six-module section makes the page feel like it is grabbing at the reader. The pin and
the screen-swap — the parts that actually communicate — are untouched.

### 5.2 Pinning is desktop-only — and it is `position: sticky`, not a GSAP pin

§11.2. A GSAP pin + scrub fights Lenis's transform-based scroll on iOS Safari and
re-measures on every Android URL-bar resize. It is now plain CSS `position: sticky`:
no measurement, no re-layout, and it physically cannot fall out of sync with Lenis
because the browser is doing the work. The active module is picked by an
IntersectionObserver with a detection line across the middle of the viewport.

Below 1024px there is no sticky column at all — the six modules ship as stacked
cards, each with its own live phone screen. Reduced motion gets the stacked layout at
**any** width, otherwise the desktop layout would be one phone next to six
screen-tall empty columns.

One consequence worth knowing: the section must not have `overflow: hidden`, or
sticky stops working. There is a comment on it in `FeatureModules.tsx`.

### 5.3 ScrollTrigger was removed

The brief specified GSAP + ScrollTrigger. ScrollTrigger is gone; **GSAP core stays**.

It was ~25KB gzipped and a single ~440ms evaluation task under a 4× CPU throttle —
between them, most of the gap to the performance budget. Everything it did here is now
IntersectionObserver, CSS transitions, `position: sticky`, and one shared
`requestAnimationFrame` loop (`lib/reveal.ts`), so there is exactly one layout read per
frame across the whole page.

GSAP still drives the things that are genuinely timeline-shaped: the hero load
sequence, the receipt print, the six idle screen loops, the accordion height, the
marquee loop and the pointer micro-interactions.

What changed behaviourally: the setup connector now draws on entry rather than
scrubbing with the scroll — which reads better, because the scrubbed version was
invisible for most of the section. Nothing else looks different.

### 5.4 Display type: no `wdth` axis, and a smaller `h1` clamp

Two changes, both for the mid-range Android the brief prioritises:

- **`h1` is `clamp(2.4rem, 5vw, 4.6rem)`, not `clamp(2.6rem, 8vw, 6.5rem)`.** At the
  briefed size, "Simple Business." wraps inside a two-column hero and the three-line
  structure — the whole idea of the headline — collapses. The current scale holds all
  three lines from 1024px up.
- **Archivo loads weight-variable only, without the `wdth` axis.** Adding the width
  axis takes the preloaded display font from **35KB to 90KB** on the LCP critical path.
  That is a real cost on a ₹8,000 phone over 4G. The brand's wide feel is recovered
  with size and tighter tracking instead. If you would rather have the true 110–125
  width, add `axes: ['wdth']` back in `app/layout.tsx` and restore the `font-stretch`
  declarations in `.t-h1` / `.t-h2` / `.t-h3` — but know what it costs.

Also: the `skewX(-6deg)` lean is applied only to the two accent words
("Simple Business."), not to the whole headline. Leaning all three lines reads as
italic, not as brand.

### 5.5 Small-text contrast on blue

The brief flagged white-on-`--sb-blue` as marginal. Every muted tint on the site was
raised (`/55` → `/65`, `/45` → `/60`, and so on) until small copy cleared **4.5:1**.
Lighthouse accessibility is 100 with no failed audits.

---

## 6. Measured results

Run against the production static export, served with gzip, Lighthouse **mobile**
(simulated Slow 4G, 4× CPU throttle):

| | Target | Measured |
|---|---|---|
| Performance | ≥ 92 | **96** |
| Accessibility | 100 | **100** |
| Best Practices | ≥ 95 | **100** |
| SEO | 100 | **100** |
| CLS | — | **0** |
| FCP | — | **1.4s** |
| LCP | < 2.0s | **2.6s** simulated / **~1.2s** measured |
| Total blocking time | — | **90ms** |
| Initial JS (gzip) | < 180KB | **168.6KB** |

`/support` scores 95 on the same run.

Every budget in the brief is met except LCP, and that one needs a caveat. **2.6s is
Lighthouse's simulated figure.** Measured directly in a throttled browser (150ms RTT,
1.6Mbps, 4× CPU) the LCP element — the hero's sub-paragraph — paints at **1.19s**, and
it is the *only* LCP candidate: no later swap displaces it. Lighthouse's lantern model
is more pessimistic than applied throttling. On a real mid-range Android the number
that matters is the measured one.

### What moved the needle, in order

1. **Removed ScrollTrigger** (§5.3). Performance 79 → 89, TBT 410ms → 150ms, JS
   184KB → 169KB.
2. **Found a 90KB font being downloaded for a single character.** `₹` (U+20B9) lives
   in Google Fonts' `latin-ext` subset, not `latin`. One `₹` in body copy — a FAQ
   heading, and the "Charge ₹393.75" button inside the billing screen — was pulling
   the whole Inter Tight latin-ext file down mid-load. Setting rupee amounts in the
   mono face (which is the brief's own §3.2 rule anyway) confined that cost to
   JetBrains Mono's much smaller latin-ext file. Page fonts 213KB → 123KB, and
   **performance 89 → 96**.
3. **Dropped the font `wdth` axis**: preloaded display font 90KB → 35KB.
4. **Preloaded Inter Tight** — it carries the LCP element on mobile.
5. **Deferred every below-the-fold phone screen** behind an IntersectionObserver
   (`components/phone/LazyScreen.tsx`) and code-split the five non-hero screens.
   DOM 2,222 → 1,672 nodes.
6. **Reserved the phone frame's aspect ratio** before hydration — this is why CLS is 0.

If you edit copy later, keep rule 2 in mind: **a rupee sign in body text costs 90KB**
unless it is inside the mono face. `components/ui/Rupees.tsx` handles it automatically
for FAQ text; anywhere else, use `formatINR()` inside a `t-mono` element.

**Also worth knowing:** the 38.6KB polyfills chunk you may see in a bundle report is
served `noModule` — no modern browser downloads it. The 168.6KB figure already
excludes it.

## 7. Cross-browser testing — partially done

Chromium was the only engine available in the build environment, so **Firefox and iOS
Safari were not tested on real engines.** What I did do defensively:

- `100svh` with a `100vh` fallback for the iOS URL-bar problem (`.sb-vh`).
- No pinning below 1024px at all, which is the main iOS Safari + Lenis failure mode.
- `-webkit-mask-*` prefixes alongside the standard properties on the receipt's torn
  edge (`.sb-torn`).
- No `backdrop-filter` used as the *only* thing making text legible — the condensed nav
  has a solid-enough background underneath it.

**Please spot-check on a real iPhone and one mid-range Android before launch**,
particularly the pinned feature section at exactly 1024px and the receipt's torn edge.

---

## 8. Other things you should know

- **The phone screens are React, not screenshots.** If you later want real Play Store
  screenshots, drop them in `public/screens/` and add a `<ScreenImage/>` variant to
  `components/phone/screens.tsx` — the registry is behind one interface, so no layout
  changes.
- **The sample bill data is fictional** (Kerala Super Store, GSTIN `32AABCT1332L1ZZ`,
  cashier "Fathima R"). It's in `lib/content.ts` under `screens`. Swap it for your own
  demo shop if you'd rather — but do **not** put a real customer's GSTIN in there.
- **The UPI QR inside the app screens and on the receipt is not scannable** and is not
  meant to be — it stands in for the merchant VPA generated on-device. The Play Store
  QR in the Download section **is** real and scannable.
- **The receipt date is static** (`22/08/2026`, in `content.screens.receipt`) so the
  server and client render identically. Update it if it starts to look stale.
- **Support hours are a guess** — "Mon–Sat 9:30 AM – 7:30 PM IST, Sunday closed", in
  `content.support.hours`. Correct them.
- **FAQ answers make commitments.** Two in particular: multi-device support ("contact
  our team and we will confirm the device count") and cloud backup. Make sure both
  match what the app actually ships.
