import { useContext, useSyncExternalStore } from 'react';
import { ViewportHintContext } from './ViewportHintContext';
import { ViewportHintProvider } from './ViewportHintProvider';

const MOBILE_BREAKPOINT = 768;

interface Store {
  subscribe: (onChange: () => void) => () => void;
  getSnapshot: () => boolean;
}

const stores = new Map<number, Store>();

function getStore(breakpoint: number): Store | null {
  const existing = stores.get(breakpoint);
  if (existing) return existing;

  if (typeof window === 'undefined' || !window.matchMedia) {
    return null;
  }

  const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((l) => l());

  const store: Store = {
    subscribe(onChange: () => void) {
      if (listeners.size === 0) mq.addEventListener('change', notify);
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
        if (listeners.size === 0) mq.removeEventListener('change', notify);
      };
    },
    getSnapshot: () => mq.matches,
  };
  stores.set(breakpoint, store);
  return store;
}

const noopSubscribe = () => () => {};

export { ViewportHintProvider, ViewportHintContext };

export function useIsMobileViewport(breakpoint: number = MOBILE_BREAKPOINT): boolean | null {
  const hint = useContext(ViewportHintContext);
  const store = typeof window === 'undefined' ? null : getStore(breakpoint);

  return useSyncExternalStore(
    store?.subscribe ?? noopSubscribe,
    () => store?.getSnapshot() ?? null,
    () => hint
  );
}

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  return useIsMobileViewport(breakpoint) === true;
}

export const useMobile = useIsMobile;
export default useIsMobile;
