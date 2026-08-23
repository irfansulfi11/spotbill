'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import Eyebrow from '@/components/ui/Eyebrow';
import PhoneFrame from '@/components/phone/PhoneFrame';
import ScreenBilling from '@/components/phone/ScreenBilling';
import LazyScreen from '@/components/phone/LazyScreen';
import {
  prefersReducedMotion,
  revealDelay,
  useEnterOnce,
  useReveal,
} from '@/lib/reveal';
import { offline } from '@/lib/content';
import { cn } from '@/lib/utils';

const QUEUE = 3;

/**
 * A live Wi-Fi toggle. It plays itself once on scroll-in to make the point,
 * and stays clickable afterwards.
 */
export default function Offline() {
  const root = useRef<HTMLElement>(null);
  const [online, setOnline] = useState(true);
  const [queue, setQueue] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const played = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  const goOffline = useCallback(() => {
    clearTimers();
    setOnline(false);
    setSyncing(false);
    setQueue(0);
    // Bills keep piling up while the connection is down.
    [1, 2, 3].forEach((n) =>
      timers.current.push(
        window.setTimeout(() => setQueue(n), 500 + n * 550),
      ),
    );
  }, [clearTimers]);

  const goOnline = useCallback(() => {
    clearTimers();
    setOnline(true);
    setSyncing(true);
    // The queue drains one bill at a time, then the spinner stops.
    for (let n = QUEUE - 1; n >= 0; n -= 1) {
      timers.current.push(
        window.setTimeout(() => setQueue(n), (QUEUE - n) * 420),
      );
    }
    timers.current.push(
      window.setTimeout(() => setSyncing(false), QUEUE * 420 + 350),
    );
  }, [clearTimers]);

  const toggle = useCallback(() => {
    if (online) goOffline();
    else goOnline();
  }, [online, goOffline, goOnline]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useReveal(root);

  // Plays itself once when scrolled to, then stays clickable.
  const demo = useCallback(() => {
    if (played.current || prefersReducedMotion()) return;
    played.current = true;
    goOffline();
    timers.current.push(window.setTimeout(goOnline, 4200));
  }, [goOffline, goOnline]);

  useEnterOnce(root, demo, { rootMargin: '0px 0px -35% 0px' });

  return (
    <section
      ref={root}
      id="offline"
      data-band="dark"
      className="relative scroll-mt-24 overflow-hidden bg-sb-ink py-20 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_20%_50%,rgba(11,99,246,0.16),transparent_70%)]"
      />

      <div className="sb-shell relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div data-reveal style={revealDelay(0, 85)}>
            <Eyebrow tone="dark">{offline.eyebrow}</Eyebrow>
          </div>
          <h2 data-reveal style={revealDelay(1, 85)} className="t-h2 mt-5 max-w-xl text-white">
            {offline.heading}
          </h2>
          <p data-reveal style={revealDelay(2, 85)} className="t-body mt-5 max-w-xl text-white/60">
            {offline.body}
          </p>

          <ul data-reveal style={revealDelay(3, 85)} className="mt-8 flex flex-col gap-3">
            {offline.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-[0.95rem] text-white/65"
              >
                <Check
                  className="mt-1 h-4 w-4 shrink-0 text-sb-blue-bright"
                  strokeWidth={3}
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>

          {/* the control */}
          <div
            data-reveal style={revealDelay(4, 85)}
            className="mt-9 inline-flex items-center gap-4 rounded-2xl border border-sb-line-dark bg-white/[0.03] p-3 pr-5"
          >
            <button
              type="button"
              role="switch"
              aria-checked={online}
              aria-label={`${offline.toggleLabel} — ${online ? 'on' : 'off'}`}
              onClick={toggle}
              className={cn(
                'relative flex h-9 w-16 shrink-0 items-center rounded-full px-1 transition-colors duration-300',
                online ? 'bg-sb-blue' : 'bg-white/15',
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  online ? 'translate-x-7' : 'translate-x-0',
                )}
              >
                {online ? (
                  <Wifi className="h-3.5 w-3.5 text-sb-blue" strokeWidth={2.6} aria-hidden="true" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5 text-sb-navy/70" strokeWidth={2.6} aria-hidden="true" />
                )}
              </span>
            </button>

            <span className="flex flex-col leading-tight">
              <span className="t-mono-sm text-[0.62rem] text-white/60">
                {offline.toggleLabel}
              </span>
              <span className="text-[0.95rem] font-semibold text-white">
                {online ? 'On' : 'Off'} — billing continues
              </span>
            </span>
          </div>
        </div>

        <div data-reveal style={revealDelay(5, 85)} className="flex justify-center lg:justify-end">
          <div className="w-[15.5rem] sm:w-[17rem]">
            <PhoneFrame>
              <>
                <LazyScreen>
                  <ScreenBilling />
                </LazyScreen>

                {/* A single chip in the app bar — the queue readout lives on
                    its own card below, so nothing covers the bill or the
                    charge button. */}
                <span
                  className={cn(
                    'pointer-events-none absolute right-2 top-1 z-30 flex items-center gap-1 rounded-full px-2 py-1 text-[0.5rem] font-bold uppercase tracking-wide text-white transition-colors duration-500',
                    online ? 'bg-sb-mint' : 'bg-sb-amber',
                  )}
                >
                  {online ? (
                    <>
                      {syncing ? (
                        <RefreshCw className="h-2 w-2 animate-spin" aria-hidden="true" />
                      ) : (
                        <Check className="h-2 w-2" strokeWidth={3.5} aria-hidden="true" />
                      )}
                      {syncing ? offline.states.syncing : offline.states.onlineChip}
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-2 w-2" aria-hidden="true" />
                      {offline.states.offlineChip}
                    </>
                  )}
                </span>
              </>
            </PhoneFrame>

            <div
              aria-live="polite"
              className={cn(
                'mt-5 flex items-center justify-center gap-2.5 rounded-xl border px-4 py-3 transition-colors duration-500',
                queue > 0
                  ? 'border-sb-amber/40 bg-sb-amber/10'
                  : 'border-sb-mint/35 bg-sb-mint/10',
              )}
            >
              {syncing ? (
                <RefreshCw
                  className="h-3.5 w-3.5 shrink-0 animate-spin text-sb-mint"
                  aria-hidden="true"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    queue > 0 ? 'bg-sb-amber' : 'bg-sb-mint',
                  )}
                />
              )}
              <span className="t-mono-sm text-[0.62rem] text-white/70">
                <span className="text-white">{queue}</span>{' '}
                {offline.states.queued}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
