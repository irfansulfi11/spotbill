import MobileRedirect from '@/components/layout/MobileRedirect';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import MarqueeBand from '@/components/sections/Marquee';
import WhyGrid from '@/components/sections/WhyGrid';
import FeatureModules from '@/components/sections/FeatureModules';
import PerfectFor from '@/components/sections/PerfectFor';
import Offline from '@/components/sections/Offline';
import Printer from '@/components/sections/Printer';
import Setup from '@/components/sections/Setup';
import Offer from '@/components/sections/Offer';
import Faq from '@/components/sections/Faq';
import Download from '@/components/sections/Download';
import FinalCta from '@/components/sections/FinalCta';
import { homeSchema, jsonLd } from '@/lib/seo';

export default function Home() {
  return (
    <>
      <MobileRedirect />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(homeSchema()) }}
      />
      <Nav />
      <main id="main">
        <Hero />
        <MarqueeBand />
        <WhyGrid />
        <FeatureModules />
        <Offline />
        <Printer />
        <Setup />
        <PerfectFor />
        <Offer />
        <Faq />
        <Download />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
