/**
 * Build-time asset generation. Runs before `next build` (see package.json).
 *
 *   - brand SVGs (mark, lockup, app icon) in both two-tone and reverse
 *   - PWA / favicon PNG set + favicon.ico
 *   - the Play Store QR code, generated locally so we never hotlink a
 *     third-party QR API from a production page
 *
 * Re-run with `npm run assets` after changing the Play Store URL in lib/site.ts.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import QRCode from 'qrcode';
import pngToIco from 'png-to-ico';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brandDir = path.join(root, 'public', 'brand');
const publicDir = path.join(root, 'public');

const BLUE = '#0B63F6';
const BLUE_BRIGHT = '#3B8CFF';
const BLUE_DEEP = '#0A44B8';
const NAVY = '#0A1739';

/* ---------------------------------------------------------------- geometry */

const BOLT =
  'M176 26 L112 136 L142 136 L120 240 L188 120 L152 120 Z';
const S_PATH =
  'M164 54 C164 34 138 24 112 28 C82 33 66 57 82 75 C94 89 122 92 144 100 C166 108 172 126 156 136 C140 146 108 146 94 132';
const D_PATH =
  'M138 122 L138 224 L172 224 C206 224 224 200 224 173 C224 146 206 122 172 122 L138 122';
const RECEIPT =
  'M184 14 h42 a10 10 0 0 1 10 10 v82 l-8.7 -8.5 -8.7 8.5 -8.7 -8.5 -8.7 8.5 -8.7 -8.5 -8.5 8.5 z';
const SPEED = [
  { x: 14, y: 164, w: 86 },
  { x: 28, y: 192, w: 72 },
  { x: 48, y: 220, w: 52 },
];
const RULES = [
  { x: 193, y: 36, w: 34 },
  { x: 193, y: 52, w: 34 },
  { x: 193, y: 68, w: 23 },
];

/**
 * The mark. Gaps (the bolt's outline and the receipt's ruled lines) are cut
 * with a mask rather than painted white, so the artwork drops onto any
 * background — including the gradient app icon — without a halo.
 */
function markBody({ blue, navy, id }) {
  const speed = SPEED.map(
    (r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="15" rx="7.5"/>`,
  ).join('');
  const rules = RULES.map(
    (r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="7" rx="3.5"/>`,
  ).join('');

  return `<defs><mask id="gap-${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256">
    <rect width="256" height="256" fill="#fff"/>
    <path d="${BOLT}" fill="none" stroke="#000" stroke-width="9" stroke-linejoin="round"/>
    <g fill="#000">${rules}</g>
  </mask></defs>
  <g mask="url(#gap-${id})">
    <g fill="${blue}">${speed}</g>
    <path d="${RECEIPT}" fill="${navy}"/>
    <path d="${S_PATH}" fill="none" stroke="${blue}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${D_PATH}" fill="none" stroke="${navy}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <path d="${BOLT}" fill="${blue}"/>`;
}

function markSVG({ blue = BLUE, navy = NAVY, id = 'c' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-label="SpotBill">
${markBody({ blue, navy, id })}
</svg>`;
}

/** Full horizontal lockup: mark + SPOTBILL wordmark + rule-flanked tagline. */
function lockupSVG({ blue = BLUE, navy = NAVY, muted = '#5B6B8C', id = 'l' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 240" width="880" height="240" role="img" aria-label="SpotBill — Smart Billing. Instant Growth.">
  <g transform="translate(8 -8)">${markBody({ blue, navy, id })}</g>
  <g font-family="Archivo, 'Archivo', 'Arial Black', system-ui, sans-serif" font-weight="800">
    <text x="292" y="140" font-size="104" letter-spacing="-2" fill="${navy}">SPOT<tspan fill="${blue}">BILL</tspan></text>
  </g>
  <g>
    <rect x="292" y="175" width="26" height="4" rx="2" fill="${blue}"/>
    <text x="332" y="182" font-family="'JetBrains Mono', ui-monospace, monospace" font-size="24" letter-spacing="1.6" fill="${muted}">SMART BILLING. INSTANT GROWTH.</text>
  </g>
</svg>`;
}

/** The glossy rounded-square app icon — favicon / PWA / apple-touch only. */
function iconSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="SpotBill">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${BLUE_BRIGHT}"/>
      <stop offset="0.55" stop-color="${BLUE}"/>
      <stop offset="1" stop-color="${BLUE_DEEP}"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="0.6" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="114" fill="url(#bg)"/>
  <rect width="512" height="512" rx="114" fill="url(#sheen)"/>
  <g transform="translate(76 76) scale(1.406)">
    ${markBody({ blue: '#FFFFFF', navy: '#0A1739', id: 'i' })}
  </g>
</svg>`;
}

/**
 * Android adaptive-icon "maskable" variant. The OS applies its own mask
 * (circle, squircle, rounded square, ...) on top of this, so anything
 * outside the centre safe-zone gets clipped — the regular `iconSVG` mark
 * sits too close to the edge for that (it's tuned for a fixed rounded-square
 * frame, not an arbitrary one). This scales the mark down to comfortably
 * clear a 66%-diameter safe circle, full-bleed background, no corner radius
 * (the mask supplies the shape).
 */
function iconMaskableSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="SpotBill">
  <defs>
    <linearGradient id="bgmask" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${BLUE_BRIGHT}"/>
      <stop offset="0.55" stop-color="${BLUE}"/>
      <stop offset="1" stop-color="${BLUE_DEEP}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bgmask)"/>
  <g transform="translate(149 150) scale(0.85)">
    ${markBody({ blue: '#FFFFFF', navy: '#0A1739', id: 'mi' })}
  </g>
</svg>`;
}

/** Safari's pinned-tab / mask-icon: a single-colour silhouette — Safari
 * recolours it from the `color` attribute on the `<link rel="mask-icon">`
 * tag, so the fill values here don't actually matter, only the shape. */
function maskIconSVG() {
  return markSVG({ blue: '#000000', navy: '#000000', id: 'mask' });
}

/* ------------------------------------------------------------------- run */

async function main() {
  await mkdir(brandDir, { recursive: true });

  const files = {
    'spotbill-mark.svg': markSVG({ id: 'm' }),
    'spotbill-mark-white.svg': markSVG({ blue: '#FFFFFF', navy: '#FFFFFF', id: 'mw' }),
    'spotbill-logo.svg': lockupSVG({ id: 'lc' }),
    'spotbill-logo-white.svg': lockupSVG({
      blue: '#FFFFFF',
      navy: '#FFFFFF',
      muted: '#B9C8E6',
      id: 'lw',
    }),
    'spotbill-icon.svg': iconSVG(),
  };

  for (const [name, svg] of Object.entries(files)) {
    await writeFile(path.join(brandDir, name), svg, 'utf8');
  }

  // Safari pinned-tab mask icon — lives at the public root by convention.
  await writeFile(path.join(publicDir, 'safari-pinned-tab.svg'), maskIconSVG(), 'utf8');

  // Raster icon set from the app-icon SVG.
  const iconBuf = Buffer.from(files['spotbill-icon.svg']);
  const png = (size) => sharp(iconBuf).resize(size, size).png({ compressionLevel: 9 });

  await png(192).toFile(path.join(publicDir, 'icon-192.png'));
  await png(512).toFile(path.join(publicDir, 'icon-512.png'));
  await png(180).toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Separate maskable icon (Android adaptive icons) — safe-zone padded so
  // launchers that mask to a circle/squircle don't clip the mark.
  await sharp(Buffer.from(iconMaskableSVG()))
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-512-maskable.png'));

  const ico = await pngToIco([
    await png(32).toBuffer(),
    await png(48).toBuffer(),
  ]);
  await writeFile(path.join(root, 'app', 'favicon.ico'), ico);

  // PWA manifest — a plain static file so `output: 'export'` serves it
  // straight from /public with no route involved.
  const manifest = {
    name: 'SpotBill — Billing & POS',
    short_name: 'SpotBill',
    description:
      'Billing and POS app for shops, restaurants, supermarkets and wholesalers.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#05091A',
    theme_color: '#0B63F6',
    orientation: 'portrait',
    lang: 'en-IN',
    categories: ['business', 'productivity', 'finance'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/brand/spotbill-icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
  await writeFile(
    path.join(publicDir, 'site.webmanifest'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  // Play Store QR — generated locally, never fetched from a QR API at runtime.
  const siteSrc = await readFile(path.join(root, 'lib', 'site.ts'), 'utf8');
  const url =
    siteSrc.match(/playStoreUrl:\s*\n?\s*'([^']+)'/)?.[1] ??
    'https://play.google.com';
  const qr = await QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 1,
    color: { dark: NAVY, light: '#00000000' },
  });
  await writeFile(path.join(publicDir, 'qr.svg'), qr, 'utf8');

  console.log(
    `assets: brand svgs, icon set (incl. maskable + mask-icon), favicon.ico, site.webmanifest, qr.svg -> ${url}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
