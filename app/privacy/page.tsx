import PageShell from '@/components/layout/PageShell';
import LegalBody from '@/components/layout/LegalBody';
import { legal } from '@/lib/content';
import { jsonLd, pageMetadata, subPageSchema } from '@/lib/seo';

export const metadata = pageMetadata(
  'Privacy Policy',
  'How SpotBill collects, uses, stores and deletes your business data, and how to make a data request.',
  '/privacy',
);

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(subPageSchema('Privacy Policy', '/privacy')),
        }}
      />
      <PageShell
        eyebrow="Legal"
        title={legal.privacy.title}
        intro={legal.privacy.intro}
      >
        <LegalBody sections={legal.privacy.sections} />
      </PageShell>
    </>
  );
}
