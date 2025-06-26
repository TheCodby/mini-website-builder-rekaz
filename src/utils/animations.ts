import { Variants } from "framer-motion";

/**
 * Animation variants for consistent motion throughout the app
 */

// Page transitions
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

export const pageTransition = {
  type: "tween" as const,
  ease: "anticipate",
  duration: 0.4,
};

// Section animations
export const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
  selected: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

// Drag animations
export const dragVariants: Variants = {
  drag: {
    scale: 1.05,
    rotate: 2,
    zIndex: 1000,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

// Drop zone animations
export const dropZoneVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    scaleY: 0,
  },
  visible: {
    opacity: 0.6,
    height: "auto",
    scaleY: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3,
    },
  },
  active: {
    opacity: 1,
    scale: 1.02,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderColor: "rgba(59, 130, 246, 0.4)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

// Button animations
export const buttonVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 600,
      damping: 30,
    },
  },
};

// Modal/overlay animations
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2,
    },
  },
};

export const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Sidebar animations
export const sidebarVariants: Variants = {
  collapsed: {
    width: "4rem",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  expanded: {
    width: "20rem",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

// List animations
export const listVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

// Floating action button
export const fabVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.5,
    },
  },
  hover: {
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.9,
  },
};

// Notification/toast animations
export const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.3,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.3,
    transition: {
      duration: 0.2,
    },
  },
};

// Loading animations
export const loadingVariants: Variants = {
  start: {
    rotate: 0,
  },
  end: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Pulse animation for active states
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Stagger animations for children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

/**
 * Animation presets for common use cases
 */
export const animationPresets = {
  // Quick fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },

  // Slide up from bottom
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },

  // Scale in
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },

  // Bounce in
  bounceIn: {
    initial: { scale: 0.3, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 15,
      duration: 0.6,
    },
  },
};

/**
 * Utility functions for animations
 */
export const createStaggerAnimation = (delay: number = 0.1) => ({
  visible: {
    transition: {
      staggerChildren: delay,
      delayChildren: 0.2,
    },
  },
});

export const createSpringTransition = (
  stiffness: number = 300,
  damping: number = 30
) => ({
  type: "spring" as const,
  stiffness,
  damping,
});

export const createEaseTransition = (
  duration: number = 0.3,
  ease: string = "easeInOut"
) => ({
  duration,
  ease,
});
