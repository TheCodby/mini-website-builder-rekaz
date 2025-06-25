import { useState, useEffect } from "react";

export type ScreenSize = "mobile" | "tablet" | "desktop";

interface ResponsiveState {
  screenSize: ScreenSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  isHydrated: boolean;
}

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => ({
    // Always start with desktop to match server render
    screenSize: "desktop" as ScreenSize,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1024,
    height: 768,
    isHydrated: false,
  }));

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const screenSize: ScreenSize =
        width < BREAKPOINTS.mobile
          ? "mobile"
          : width < BREAKPOINTS.tablet
          ? "tablet"
          : "desktop";

      setState({
        screenSize,
        isMobile: screenSize === "mobile",
        isTablet: screenSize === "tablet",
        isDesktop: screenSize === "desktop",
        width,
        height,
        isHydrated: true,
      });
    };

    // Set hydrated state and check screen size
    updateScreenSize();

    // Debounce resize events for better performance
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScreenSize, 150);
    };

    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return state;
};
