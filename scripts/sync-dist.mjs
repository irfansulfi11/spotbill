/**
 * Mirrors the Next.js static export (`out/`) into `dist-static/` — the
 * folder `dist-static/README-DEPLOY.txt` documents as the ready-to-upload
 * build. `next build` (with `output: 'export'`) always writes to `out/` and
 * has no option to target another directory, so this runs as the last step
 * of `npm run build` to keep the two in sync.
 */
import { rm, cp, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'out');
const dest = path.join(root, 'dist-static');

/** README-DEPLOY.txt lives only in dist-static/ (not in the export), so it
 * has to be regenerated here rather than copied — pulled fresh from
 * lib/site.ts each run so it can never repeat last time's placeholder
 * warning after the real values are filled in. */
async function writeDeployReadme() {
  const siteSrc = await readFile(path.join(root, 'lib', 'site.ts'), 'utf8');
  const domain = siteSrc.match(/domain:\s*\n?\s*'([^']+)'/)?.[1] ?? '';
  const playStoreUrl =
    siteSrc.match(/playStoreUrl:\s*\n?\s*'([^']+)'/)?.[1] ?? '';
  const domainIsPlaceholder = /TODO/.test(
    siteSrc.match(/\/\*\*[^]*?\*\/\s*domain:/)?.[0] ?? '',
  );

  const warning = domainIsPlaceholder
    ? `\nIMPORTANT — the domain is still a placeholder in lib/site.ts:\n\n  domain   ${domain}\n\nOnce DNS is pointed at the real domain, update it there and run\n\`npm run build\` again to regenerate this folder.\n`
    : '';

  const readme = `SpotBill — ready-to-upload static build
=======================================

This folder is the compiled site. Upload its CONTENTS to your web root and
the site is live — no Node, no server, no build step needed on the host.

  cPanel / shared hosting : upload everything in here into public_html/
  Netlify                 : drag this folder onto the Netlify drop zone
  Cloudflare Pages / S3   : upload as the site root

Baked in at build time from lib/site.ts:

  domain        ${domain}
  Play Store    ${playStoreUrl}
${warning}
This folder is regenerated on every \`npm run build\` — don't hand-edit
files in here, edit the project one level up instead. See NOTES.md in the
project root for anything else still marked TODO.
`;

  await writeFile(path.join(dest, 'README-DEPLOY.txt'), readme, 'utf8');
}

async function main() {
  await rm(dest, { recursive: true, force: true });
  await cp(src, dest, { recursive: true });
  await writeDeployReadme();
  console.log('dist-static/ synced from out/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
