import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * "Get it on Google Play" badge.
 *
 * NOTE FOR THE CLIENT — see NOTES.md: this is a faithful, correctly
 * proportioned rebuild. Before going live, download the official badge from
 * Google's Play brand resources and drop it in as
 * `/public/badges/google-play-badge.png`, then swap the <svg> below for an
 * <Image>. Google's brand guidelines require the supplied artwork.
 */
export default function PlayBadge({
  className,
  height = 54,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <a
      href={site.playStoreUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group inline-flex shrink-0 items-center gap-3 rounded-lg border border-[#A6A6A6] bg-black px-4 text-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 focus-visible:-translate-y-0.5',
        className,
      )}
      style={{ height }}
    >
      {/* The badge text is real text, not SVG <text>: it inherits the page
          font stack, scales with the user's zoom, and gives the link its
          accessible name without an aria-label that could drift from it. */}
      <svg
        viewBox="0 0 512 512"
        width={height * 0.42}
        height={height * 0.42}
        aria-hidden="true"
        focusable="false"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="gp-b" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00A0FF" />
            <stop offset="1" stopColor="#00E3FF" />
          </linearGradient>
          <linearGradient id="gp-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#00E874" />
            <stop offset="1" stopColor="#00C853" />
          </linearGradient>
          <linearGradient id="gp-y" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE000" />
            <stop offset="1" stopColor="#FF9C00" />
          </linearGradient>
          <linearGradient id="gp-r" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF3A44" />
            <stop offset="1" stopColor="#C31162" />
          </linearGradient>
        </defs>
        <path
          d="M22 0C9 6.8 0.3 19.2 0.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L22 0z"
          fill="url(#gp-b)"
        />
        <path d="M300.3 234.3L79.6 13l280.8 161.2-60.1 60.1z" fill="url(#gp-g)" />
        <path
          d="M447.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z"
          fill="url(#gp-y)"
        />
        <path d="M79.6 499l280.8-161.2-60.1-60.1L79.6 499z" fill="url(#gp-r)" />
      </svg>

      <span className="flex flex-col justify-center leading-none">
        <span
          className="uppercase tracking-[0.12em]"
          style={{ fontSize: height * 0.165 }}
        >
          Get it on
        </span>
        <span
          className="mt-1 font-medium tracking-[-0.01em]"
          style={{ fontSize: height * 0.35 }}
        >
          Google Play
        </span>
      </span>
    </a>
  );
}
