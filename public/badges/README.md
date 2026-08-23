# Google Play badge

`components/ui/PlayBadge.tsx` currently renders a correctly proportioned SVG
rebuild of the "Get it on Google Play" badge.

**Before launch**, download the official badge artwork from Google's Play
brand resources, save it here as `google-play-badge.png`, and swap the
`<svg>` in `PlayBadge.tsx` for a `next/image` pointing at it. Google's brand
guidelines require their supplied asset at the published proportions and
clear space.
