'use client';

import { gsap } from 'gsap';

export { gsap };
export { prefersReducedMotion } from './reveal';

/**
 * GSAP core only — no ScrollTrigger, and never `gsap/all`.
 *
 * GSAP earns its place for the things that are genuinely timeline-shaped:
 * the hero load sequence, the receipt print, the six idle screen loops, the
 * accordion height and the pointer micro-interactions. Everything
 * scroll-position-driven is handled by IntersectionObserver and one shared
 * rAF loop in `lib/reveal.ts` instead.
 */

/** House eases. Nothing on this site uses an ease that isn't one of these. */
export const EASE = {
  /** entrances */
  in: 'power3.out',
  /** state changes */
  state: 'power2.inOut',
  /** the receipt, and only the receipt */
  receipt: 'expo.out',
} as const;

/**
 * SplitText stand-in. Club GSAP is not a dependency of this project, so
 * headings are split here into word spans inside `overflow:hidden` masks.
 * Returns a cleanup that restores the original markup.
 */
export function splitWords(el: HTMLElement): {
  words: HTMLElement[];
  revert: () => void;
} {
  const original = el.innerHTML;
  const source = el.textContent ?? '';
  el.innerHTML = '';

  const words: HTMLElement[] = [];
  source.split(/(\s+)/).forEach((chunk) => {
    if (!chunk.trim()) {
      el.appendChild(document.createTextNode(chunk));
      return;
    }
    const mask = document.createElement('span');
    mask.style.display = 'inline-block';
    mask.style.overflow = 'hidden';
    mask.style.verticalAlign = 'top';
    mask.style.paddingBottom = '0.12em';
    mask.style.marginBottom = '-0.12em';

    const word = document.createElement('span');
    word.style.display = 'inline-block';
    word.style.willChange = 'transform';
    word.textContent = chunk;

    mask.appendChild(word);
    el.appendChild(mask);
    words.push(word);
  });

  return {
    words,
    revert: () => {
      el.innerHTML = original;
    },
  };
}

/**
 * Count a numeric value up, formatted with the supplied formatter (always
 * the Indian grouping one for rupee figures). Triggered by the caller —
 * usually from `useEnterOnce`.
 */
export function countUp(
  node: HTMLElement,
  to: number,
  format: (n: number) => string,
  vars: gsap.TweenVars = {},
) {
  const state = { value: 0 };
  return gsap.to(state, {
    value: to,
    duration: 1.1,
    ease: EASE.in,
    ...vars,
    onUpdate: () => {
      node.textContent = format(state.value);
    },
  });
}
