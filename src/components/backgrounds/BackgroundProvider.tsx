'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WebGLManager } from './LiquidEtherEngine';

interface BackgroundContextType {
  webglManager: WebGLManager | null;
  isInitialized: boolean;
  registerManager: (manager: WebGLManager) => void;
  unregisterManager: () => void;
  isLiquidEtherEnabled: boolean;
  setIsLiquidEtherEnabled: (enabled: boolean) => void;
}

const BackgroundContext = createContext<BackgroundContextType | null>(null);

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [webglManager, setWebglManager] = useState<WebGLManager | null>(null);
  const [isLiquidEtherEnabled, setIsLiquidEtherEnabled] = useState(false);

  const registerManager = useCallback((manager: WebGLManager) => {
    setWebglManager(manager);
  }, []);

  const unregisterManager = useCallback(() => {
    setWebglManager(null);
  }, []);

  // Clean up WebGLManager on unmount
  useEffect(() => {
    return () => {
      if (webglManager) {
        webglManager.dispose();
      }
    };
  }, [webglManager]);

  return (
    <BackgroundContext.Provider
      value={{
        webglManager,
        isInitialized: webglManager !== null,
        registerManager,
        unregisterManager,
        isLiquidEtherEnabled,
        setIsLiquidEtherEnabled
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}
