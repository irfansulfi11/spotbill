import { cn } from '@/lib/utils';

/** Mono, uppercase, prefixed with a 24px hairline rule. */
export default function Eyebrow({
  children,
  tone = 'light',
  className,
}: {
  children: React.ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <p
      className={cn(
        't-mono-sm flex items-center gap-3',
        tone === 'dark' ? 'text-sb-blue-bright' : 'text-sb-blue',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-block h-px w-6 shrink-0 bg-current opacity-70"
      />
      {children}
    </p>
  );
}
