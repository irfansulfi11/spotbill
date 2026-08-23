import Marquee from '@/components/ui/Marquee';
import { marquee } from '@/lib/content';

export default function MarqueeBand() {
  return (
    <section aria-label="Businesses using SpotBill" className="bg-sb-blue py-3.5">
      <h2 className="sr-only">Who uses SpotBill</h2>
      <Marquee
        items={marquee}
        itemClassName="t-mono-sm text-white text-[0.72rem] sm:text-[0.8125rem]"
      />
    </section>
  );
}
