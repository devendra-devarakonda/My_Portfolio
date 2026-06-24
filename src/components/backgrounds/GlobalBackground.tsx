'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useBackground } from './BackgroundProvider';
import { WebGLManager } from './LiquidEtherEngine';

interface GlobalBackgroundProps {
  colors?: string[];
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

export default function GlobalBackground({
  colors = ['#FF284D', '#FF6885', '#D61616', '#F20000'],
  mouseForce = 20,
  cursorSize = 90,
  isViscous = true,
  viscous = 20,
  iterationsViscous = 4,
  iterationsPoisson = 8,
  dt = 0.014,
  BFECC = false,
  resolution = 0.35,
  isBounce = false,
  autoDemo = true,
  autoSpeed = 0.3,
  autoIntensity = 1.8,
  takeoverDuration = 0.25,
  autoResumeDelay = 2500,
  autoRampDuration = 0.8
}: GlobalBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const webglRef = useRef<WebGLManager | null>(null);
  const { registerManager, unregisterManager, isLiquidEtherEnabled } = useBackground();
  const [opacity] = useState(1);
  const [hasFailed, setHasFailed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      // Disable LiquidEther on mobile devices to prevent performance stutter
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobileDevice) return true;

      const canvas = document.createElement('canvas');
      return !(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return true;
    }
  });

  // WebGL Initialization (runs once on mount)
  useEffect(() => {
    if (hasFailed || !mountRef.current) return;

    let webgl: WebGLManager | null = null;

    try {
      webgl = new WebGLManager({
        $wrapper: mountRef.current,
        autoDemo,
        autoSpeed,
        autoIntensity,
        takeoverDuration,
        autoResumeDelay,
        autoRampDuration,
        colors,
        mouseForce,
        cursorSize,
        isViscous,
        viscous,
        iterationsViscous,
        iterationsPoisson,
        dt,
        BFECC,
        resolution,
        isBounce
      });

      registerManager(webgl);
      webglRef.current = webgl;
      if (isLiquidEtherEnabled) {
        webgl.start();
      }
    } catch (error) {
      console.warn('WebGL Fluid Simulation failed to initialize. Falling back to CSS gradients.', error);
      setHasFailed(true);
      if (webgl) {
        webgl.dispose();
      }
    }

    return () => {
      if (webglRef.current) {
        webglRef.current.dispose();
        webglRef.current = null;
      }
      unregisterManager();
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFailed, registerManager, unregisterManager]);

  // Start/Pause simulation based on scroll-gated state
  useEffect(() => {
    const webgl = webglRef.current;
    if (!webgl) return;

    if (isLiquidEtherEnabled) {
      webgl.start();
    } else {
      webgl.pause();
    }
  }, [isLiquidEtherEnabled]);

  // Dynamic Property Updates
  useEffect(() => {
    const webgl = webglRef.current;
    if (!webgl) return;

    if (webgl.output?.simulation) {
      const sim = webgl.output.simulation;
      const prevRes = sim.options.resolution;
      Object.assign(sim.options, {
        mouse_force: mouseForce,
        cursor_size: cursorSize,
        isViscous,
        viscous,
        iterations_viscous: iterationsViscous,
        iterations_poisson: iterationsPoisson,
        dt,
        BFECC,
        resolution,
        isBounce
      });
      if (resolution !== prevRes) {
        sim.resize();
      }
    }

    if (webgl.autoDriver) {
      webgl.autoDriver.enabled = autoDemo;
      webgl.autoDriver.speed = autoSpeed;
      webgl.autoDriver.resumeDelay = autoResumeDelay;
      webgl.autoDriver.rampDurationMs = autoRampDuration * 1000;
      if (webgl.mouse) {
        webgl.mouse.autoIntensity = autoIntensity;
        webgl.mouse.takeoverDuration = takeoverDuration;
      }
    }
  }, [
    mouseForce,
    cursorSize,
    isViscous,
    viscous,
    iterationsViscous,
    iterationsPoisson,
    dt,
    BFECC,
    resolution,
    isBounce,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration
  ]);

  // Color Palette Updates (dynamic rebuild of texture)
  useEffect(() => {
    const webgl = webglRef.current;
    if (!webgl) return;

    webgl.props.colors = colors;
    webgl.initPalette();
    if (webgl.output?.material && webgl.paletteTex) {
      webgl.output.material.uniforms.palette.value = webgl.paletteTex;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(colors)]);

  return (
    <>
      {/* Shared Canvas Layer wrapper with Pointer Gating */}
      <div
        ref={mountRef}
        className="fixed inset-0 z-[-1] transition-opacity duration-500 ease-in-out select-none pointer-events-none"
        style={{
          opacity: isLiquidEtherEnabled ? opacity : 0,
          visibility: isLiquidEtherEnabled && opacity > 0.01 ? 'visible' : 'hidden'
        }}
      />

      {/* Safety Fallback Premium CSS Gradient Background */}
      {hasFailed && (
        <div
          className="fixed inset-0 z-[-2] transition-opacity duration-500 ease-in-out bg-gradient-to-b from-[#050B17] via-[#070E20] to-[#0A1128] select-none pointer-events-none"
          style={{
            opacity: opacity,
            visibility: opacity > 0.01 ? 'visible' : 'hidden'
          }}
        />
      )}
    </>
  );
}
