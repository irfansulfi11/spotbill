'use client';

import LogoMark from '@/components/ui/LogoMark';
import { cn } from '@/lib/utils';

/** Shared in-app chrome so all six screens read as the same product. */
export default function ScreenShell({
  title,
  subtitle,
  children,
  footer,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <header className="flex items-center gap-2.5 px-4 pb-3 pt-1">
        <LogoMark className="h-5 w-5 shrink-0 text-sb-blue" variant="color" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[0.82rem] font-bold uppercase leading-none tracking-tight text-sb-navy">
            {title}
          </p>
          {subtitle ? (
            <p className="t-mono mt-1 truncate text-[0.58rem] leading-none text-sb-navy/70">
              {subtitle}
            </p>
          ) : null}
        </div>
        <span
          aria-hidden="true"
          className="flex flex-col gap-[3px] rounded-md p-1"
        >
          <span className="block h-[2px] w-3.5 rounded-full bg-sb-navy/35" />
          <span className="block h-[2px] w-3.5 rounded-full bg-sb-navy/35" />
          <span className="block h-[2px] w-2.5 rounded-full bg-sb-navy/35" />
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden px-3">{children}</div>

      {footer ? <div className="px-3 pb-5 pt-2">{footer}</div> : null}
    </div>
  );
}
