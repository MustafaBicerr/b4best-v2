'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * Returns a ref and a boolean indicating whether the element is in the viewport.
 * Use this to trigger scroll-based animations.
 *
 * @param once - if true, animation only fires once (default: true)
 * @param margin - intersection margin (default: '-10%')
 */
export function useScrollAnimation(
  once = true,
  margin: `-${number}%` | `${number}px` = '-10%'
) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin });

  return { ref, isInView };
}
