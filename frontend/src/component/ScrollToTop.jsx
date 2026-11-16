import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Automatically scrolls the window back to the top whenever the route changes.
 * Handles:
 * 1. Disabling browser's native history scroll restoration.
 * 2. Overriding CSS `scroll-behavior: smooth` during route transitions so it snaps to (0, 0) instantly.
 * 3. Fallback on requestAnimationFrame so even if the new page fetches data or shifts layout, it stays at the top.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    // Disable native browser scroll restoration fighting against route transitions
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const resetScroll = () => {
      const html = document.documentElement;
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";

      window.scrollTo(0, 0);
      html.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;

      html.style.scrollBehavior = prevBehavior;
    };

    // 1. Instant sync reset before paint
    resetScroll();

    // 2. Next animation frame fallback for mobile browsers / async layout shifts
    const rafId = requestAnimationFrame(resetScroll);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [pathname, search]);

  return null;
}
