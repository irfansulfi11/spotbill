import Link from 'next/link';
import Nav from './Nav';
import Footer from './Footer';
import Eyebrow from '@/components/ui/Eyebrow';

/** Shared chrome for the three sub-routes. */
export default function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main id="main">
        <header className="bg-sb-ink pb-16 pt-32 lg:pb-20 lg:pt-40">
          <div className="sb-shell">
            <nav aria-label="Breadcrumb" className="t-mono-sm text-white/65">
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
              <span aria-hidden="true"> / </span>
              <span className="text-white/70">{title}</span>
            </nav>
            <div className="mt-8">
              <Eyebrow tone="dark">{eyebrow}</Eyebrow>
            </div>
            <h1 className="t-h1 mt-5 text-white">{title}</h1>
            {intro ? (
              <p className="t-body mt-6 max-w-2xl text-white/60">{intro}</p>
            ) : null}
          </div>
        </header>

        <div data-band="light" className="bg-white py-16 lg:py-24">
          <div className="sb-shell">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
