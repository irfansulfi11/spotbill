'use client';

import { useEffect, useState } from 'react';

/**
 * Renders the desktop or the mobile branch, never both — mounting seven live
 * phone screens to hide six of them with CSS is exactly the waste this
 * page cannot afford.
 *
 * Starts `false` so the server output matches the mobile branch, then
 * upgrades after mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
