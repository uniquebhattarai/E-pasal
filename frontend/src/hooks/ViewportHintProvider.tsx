import React, { ReactNode } from 'react';
import { ViewportHintContext } from './ViewportHintContext';

export interface ViewportHintProviderProps {
  isMobile?: boolean | null;
  children: ReactNode;
}

export function ViewportHintProvider({ isMobile = null, children }: ViewportHintProviderProps) {
  return <ViewportHintContext.Provider value={isMobile}>{children}</ViewportHintContext.Provider>;
}

export default ViewportHintProvider;
