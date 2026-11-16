import React from 'react';
import { ViewportHintContext } from './ViewportHintContext';

export function ViewportHintProvider({ isMobile = null, children }) {
  return <ViewportHintContext.Provider value={isMobile}>{children}</ViewportHintContext.Provider>;
}

export default ViewportHintProvider;
