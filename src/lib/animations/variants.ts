import type { Variants, Transition } from 'framer-motion';

// ─── Shared easings ───────────────────────────────────────────────────────────

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;
const EASE_REVEAL = [0.76, 0, 0.24, 1] as const;

// ─── Fade In Up — scroll reveal for text and cards ───────────────────────────

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_LUXURY,
    },
  },
};

// ─── Fade In — simple opacity reveal ─────────────────────────────────────────

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: EASE_LUXURY,
    },
  },
};

// ─── Image Reveal — clip-path from bottom ────────────────────────────────────

export const imageReveal: Variants = {
  hidden: {
    clipPath: 'inset(100% 0 0 0)',
    opacity: 0,
  },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: EASE_REVEAL,
    },
  },
};

// ─── Hero Entrance — scale + fade for the hero image ─────────────────────────

export const heroEntrance: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.05,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: EASE_LUXURY,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.8,
      ease: EASE_REVEAL,
    },
  },
};

// ─── Hero Text — staggered lines ─────────────────────────────────────────────

export const heroTextContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
};

export const heroTextLine: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_LUXURY,
    },
  },
};

// ─── Stagger Container — parent for staggered children ───────────────────────

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

// ─── Page Transition ──────────────────────────────────────────────────────────

export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_LUXURY,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: EASE_LUXURY,
    },
  },
};

// ─── Hover Scale — collection card hover ─────────────────────────────────────

export const hoverScaleTransition: Transition = {
  duration: 0.5,
  ease: EASE_LUXURY,
};

// ─── Slide In from Left/Right ─────────────────────────────────────────────────

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: EASE_LUXURY },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: EASE_LUXURY },
  },
};

// ─── Scale Up — for stats/numbers ────────────────────────────────────────────

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_LUXURY },
  },
};

// ─── Viewport config for scroll-triggered animations ─────────────────────────

export const viewportConfig = {
  once: true,
  margin: '-10%',
} as const;
