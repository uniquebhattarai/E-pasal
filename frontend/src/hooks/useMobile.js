import { useContext, useSyncExternalStore } from 'react';
import { ViewportHintContext } from './ViewportHintContext';
import { ViewportHintProvider } from './ViewportHintProvider';

const MOBILE_BREAKPOINT = 768;

// One MediaQueryList and one listener set per breakpoint, shared by every consumer. The app
// renders these hooks 40+ times across a single page tree; without the shared store each of
// those registered its own `matchMedia` listener and held its own copy of the same boolean.
const stores = new Map();

function getStore(breakpoint) {
  const existing = stores.get(breakpoint);
  if (existing) return existing;

  if (typeof window === 'undefined' || !window.matchMedia) {
    return null;
  }

  const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
  const listeners = new Set();
  const notify = () => listeners.forEach((l) => l());

  const store = {
    subscribe(onChange) {
      if (listeners.size === 0) mq.addEventListener('change', notify);
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
        if (listeners.size === 0) mq.removeEventListener('change', notify);
      };
    },
    // Read straight off the MediaQueryList: it is always current, so no state copy can drift.
    getSnapshot: () => mq.matches,
  };
  stores.set(breakpoint, store);
  return store;
}

const noopSubscribe = () => () => {};

export { ViewportHintProvider, ViewportHintContext };

/**
 * Tri-state viewport check: `null` until the viewport is known, then `true`/`false`.
 *
 * `null` is only ever returned on the server (and for the matching hydration render), where
 * no viewport exists - callers render nothing rather than guessing and flashing the wrong
 * layout. On the client the very first render already has the real value, because the
 * snapshot is read synchronously from `matchMedia` instead of being filled in by an effect.
 */
export function useIsMobileViewport(breakpoint = MOBILE_BREAKPOINT) {
  const hint = useContext(ViewportHintContext);
  const store = typeof window === 'undefined' ? null : getStore(breakpoint);

  return useSyncExternalStore(
    store?.subscribe ?? noopSubscribe,
    () => store?.getSnapshot() ?? null,
    // The server has no viewport - only the UA-based hint (null when unknown).
    () => hint
  );
}

/** Boolean form for callers that render a desktop layout on the server. */
export function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  return useIsMobileViewport(breakpoint) === true;
}

export const useMobile = useIsMobile;
export default useIsMobile;
