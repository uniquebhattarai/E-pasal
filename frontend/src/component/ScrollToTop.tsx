import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Automatically scrolls the window back to the top whenever the route changes.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
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

    resetScroll();

    const rafId = requestAnimationFrame(resetScroll);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [pathname, search]);

  return null;
}
