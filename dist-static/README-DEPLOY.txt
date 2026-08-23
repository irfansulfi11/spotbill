SpotBill — ready-to-upload static build
=======================================

This folder is the compiled site. Upload its CONTENTS to your web root and
the site is live — no Node, no server, no build step needed on the host.

  cPanel / shared hosting : upload everything in here into public_html/
  Netlify                 : drag this folder onto the Netlify drop zone
  Cloudflare Pages / S3   : upload as the site root

Baked in at build time from lib/site.ts:

  domain        https://spotbill.in
  Play Store    https://play.google.com/store/apps/details?id=com.spotbill.app

IMPORTANT — the domain is still a placeholder in lib/site.ts:

  domain   https://spotbill.in

Once DNS is pointed at the real domain, update it there and run
`npm run build` again to regenerate this folder.

This folder is regenerated on every `npm run build` — don't hand-edit
files in here, edit the project one level up instead. See NOTES.md in the
project root for anything else still marked TODO.
