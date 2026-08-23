import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const alt =
  'SpotBill — Smart Billing. Instant Growth. Billing and POS app for Android. Available on Google Play.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Required by `output: 'export'` — the PNG is baked at build time. */
export const dynamic = 'force-static';

/**
 * Generated at build time (the site is a static export), so no runtime
 * image rendering happens in production.
 */
export default async function OpengraphImage() {
  const BOLT = 'M176 26 L112 136 L142 136 L120 240 L188 120 L152 120 Z';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #05091A 0%, #0A1739 55%, #0A44B8 100%)',
          padding: '68px 76px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <svg width="92" height="92" viewBox="0 0 256 256">
            <g fill="#FFFFFF">
              <rect x="14" y="164" width="86" height="15" rx="7.5" />
              <rect x="28" y="192" width="72" height="15" rx="7.5" />
              <rect x="48" y="220" width="52" height="15" rx="7.5" />
            </g>
            <path
              d="M184 14 h42 a10 10 0 0 1 10 10 v82 l-8.7 -8.5 -8.7 8.5 -8.7 -8.5 -8.7 8.5 -8.7 -8.5 -8.5 8.5 z"
              fill="#FFFFFF"
            />
            <path
              d="M164 54 C164 34 138 24 112 28 C82 33 66 57 82 75 C94 89 122 92 144 100 C166 108 172 126 156 136 C140 146 108 146 94 132"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M138 122 L138 224 L172 224 C206 224 224 200 224 173 C224 146 206 122 172 122 L138 122"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d={BOLT} fill="#3B8CFF" stroke="#0A1739" strokeWidth="9" strokeLinejoin="round" />
          </svg>
          <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, letterSpacing: -2 }}>
            <span style={{ color: '#FFFFFF' }}>SPOT</span>
            <span style={{ color: '#3B8CFF' }}>BILL</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.02,
              letterSpacing: -2.5,
              maxWidth: 940,
            }}
          >
            Billing & POS for shops, restaurants and supermarkets.
          </div>
          <div style={{ display: 'flex', fontSize: 32, color: '#8FB4F5', marginTop: 26 }}>
            {site.tagline}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              background: '#FFFFFF',
              color: '#05091A',
              fontSize: 26,
              fontWeight: 700,
              padding: '14px 28px',
              borderRadius: 999,
            }}
          >
            Available on Google Play
          </div>
          <div style={{ display: 'flex', fontSize: 24, color: '#7C93BF' }}>
            Works offline · GST ready · Thermal printer · {site.location}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
