import PageShell from '@/components/layout/PageShell';
import LegalBody from '@/components/layout/LegalBody';
import { legal } from '@/lib/content';
import { jsonLd, pageMetadata, subPageSchema } from '@/lib/seo';

export const metadata = pageMetadata(
  'Terms of Service',
  'The terms covering your SpotBill licence, launch pricing, your responsibilities, support and liability.',
  '/terms',
);

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(subPageSchema('Terms of Service', '/terms')),
        }}
      />
      <PageShell
        eyebrow="Legal"
        title={legal.terms.title}
        intro={legal.terms.intro}
      >
        <LegalBody sections={legal.terms.sections} />
      </PageShell>
    </>
  );
}
