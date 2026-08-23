'use client';

import dynamic from 'next/dynamic';
import type { FeatureModule } from '@/lib/content';
import ScreenBilling from './ScreenBilling';

/**
 * One interface for every phone screen.
 *
 * Only the billing screen is in the initial bundle — it is what the hero
 * renders above the fold. The other five are code-split; because every
 * caller wraps them in <LazyScreen/>, none of them render during SSR, so
 * their chunks are fetched when the module sequence is actually scrolled to
 * rather than preloaded on first paint.
 *
 * If real Play Store screenshots land in /public/screens later, a
 * `<ScreenImage/>` variant slots in here without any layout touching.
 */
const blank = () => <div className="h-full" aria-hidden="true" />;

const registry: Record<FeatureModule['screen'], React.ComponentType> = {
  billing: ScreenBilling,
  inventory: dynamic(() => import('./ScreenInventory'), { loading: blank }),
  credit: dynamic(() => import('./ScreenCredit'), { loading: blank }),
  kot: dynamic(() => import('./ScreenKot'), { loading: blank }),
  reports: dynamic(() => import('./ScreenReports'), { loading: blank }),
  staff: dynamic(() => import('./ScreenStaff'), { loading: blank }),
};

export default function Screen({ name }: { name: FeatureModule['screen'] }) {
  const Component = registry[name];
  return <Component />;
}
