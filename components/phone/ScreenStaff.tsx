'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import ScreenShell from './ScreenShell';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useInView } from '@/lib/useInView';
import { screens } from '@/lib/content';
import { cn } from '@/lib/utils';

const { staff } = screens;

/** Role chips toggle between Admin and Cashier on the two non-owner rows. */
export default function ScreenStaff() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const id = window.setInterval(() => setFlipped((v) => !v), 2600);
    return () => window.clearInterval(id);
  }, [inView]);

  useEffect(() => {
    if (!inView || !ref.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-staff-chip]', {
        scale: 0.8,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(2)',
      });
    }, ref);
    return () => ctx.revert();
  }, [flipped, inView, ref]);

  return (
    <div ref={ref} className="h-full">
      <ScreenShell
        title={staff.title}
        subtitle={`${staff.members.length} accounts`}
      >
        <ul className="flex flex-col gap-1.5">
          {staff.members.map((member, index) => {
            const roleIndex = member.owner
              ? 0
              : flipped
                ? 1 - member.role
                : member.role;

            return (
              <li
                key={member.name}
                className="flex items-center gap-2.5 rounded-xl border border-sb-line bg-white px-2.5 py-2.5"
              >
                <span className="sb-gradient flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.55rem] font-bold text-white">
                  {member.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.68rem] font-semibold leading-tight text-sb-navy">
                    {member.name}
                  </p>
                  <p className="t-mono text-[0.5rem] leading-tight text-sb-navy/65">
                    {staff.activityLabel} · {index === 0 ? 'now' : `${index * 12}m`}
                  </p>
                </div>
                <span
                  key={`${member.name}-${roleIndex}`}
                  data-staff-chip
                  className={cn(
                    'flex items-center gap-1 rounded-full px-2 py-1 text-[0.5rem] font-bold uppercase tracking-wide',
                    roleIndex === 0
                      ? 'bg-sb-blue/12 text-sb-blue-deep'
                      : 'bg-sb-cloud text-sb-navy/70',
                  )}
                >
                  {roleIndex === 0 ? (
                    <ShieldCheck className="h-2.5 w-2.5" aria-hidden="true" />
                  ) : null}
                  {staff.roles[roleIndex]}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-2 rounded-xl border border-dashed border-sb-line bg-sb-cloud/60 px-2.5 py-2">
          <p className="t-mono-sm text-[0.48rem] text-sb-navy/70">
            {staff.ownerLabel}
          </p>
          <p className="mt-1 text-[0.6rem] leading-snug text-sb-navy/70">
            Only the owner account can open pricing, profit and staff settings.
          </p>
        </div>
      </ScreenShell>
    </div>
  );
}
