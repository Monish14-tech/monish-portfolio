import React, { createContext, useContext, useMemo } from 'react';

const PerformanceContext = createContext(null);

function detectTier() {
  if (typeof window === 'undefined') return 'medium';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return 'low';

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = navigator.deviceMemory ?? 4;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry/i.test(navigator.userAgent);
  const isTouch = 'ontouchstart' in window && window.innerWidth < 1024;
  const smallScreen = window.innerWidth < 768;
  const saveData =
    typeof navigator.connection?.saveData === 'boolean' && navigator.connection.saveData;
  const slowNetwork =
    typeof navigator.connection?.effectiveType === 'string' &&
    /(?:^2g$|^slow-2g$|^3g$)/.test(navigator.connection.effectiveType);

  if (saveData || slowNetwork) return 'low';
  if (cores <= 2 || (memory <= 2 && isMobile)) return 'low';
  if (cores <= 4 && (isMobile || isTouch || memory <= 4 || smallScreen)) return 'low';
  if (isMobile || smallScreen || memory <= 4) return 'medium';
  if (cores <= 6) return 'medium';

  return 'high';
}

const TIER_SETTINGS = {
  low: {
    dpr: [1, 1],
    antialias: false,
    enableProject3D: false,
    enableEnvironment: false,
    enableHeroEnvironment: true,
    transmissionSamples: 2,
    enableFloat: true,
    enableParallax: false,
    enableCustomCursor: false,
    enableHeavyBackground: false,
    stars: 120,
    particles: 42,
    dustLayers: 2,
    satellites: 0,
    sphereSegments: 28,
    torusSegments: [6, 40],
    starsSaturation: 0,
  },
  medium: {
    dpr: [1, 1.2],
    antialias: true,
    enableProject3D: true,
    enableEnvironment: true,
    enableHeroEnvironment: true,
    transmissionSamples: 4,
    enableFloat: true,
    enableParallax: true,
    enableCustomCursor: true,
    enableHeavyBackground: false,
    stars: 700,
    particles: 85,
    dustLayers: 3,
    satellites: 2,
    sphereSegments: 56,
    torusSegments: [10, 72],
    starsSaturation: 0,
  },
  high: {
    dpr: [1, 1.5],
    antialias: true,
    enableProject3D: true,
    enableEnvironment: true,
    enableHeroEnvironment: true,
    transmissionSamples: 6,
    enableFloat: true,
    enableParallax: true,
    enableCustomCursor: true,
    enableHeavyBackground: true,
    stars: 1800,
    particles: 160,
    dustLayers: 5,
    satellites: 3,
    sphereSegments: 88,
    torusSegments: [14, 112],
    starsSaturation: 0,
  },
};

function applyMobileOverrides(settings, tier) {
  if (typeof window === 'undefined') return settings;

  const isMobile =
    /Android|iPhone|iPad|iPod|Mobile|webOS/i.test(navigator.userAgent) ||
    window.innerWidth < 768;

  if (!isMobile) return settings;

  return {
    ...settings,
    enableProject3D: false,
    enableCustomCursor: false,
    enableHeavyBackground: false,
    dpr: [1, 1],
    dustLayers: Math.min(settings.dustLayers, tier === 'low' ? 2 : 3),
    particles: Math.min(settings.particles, tier === 'low' ? 40 : 70),
    stars: Math.min(settings.stars, tier === 'low' ? 100 : 500),
    satellites: Math.min(settings.satellites, 1),
    transmissionSamples: Math.min(settings.transmissionSamples, 3),
  };
}

export function PerformanceProvider({ children }) {
  const value = useMemo(() => {
    const tier = detectTier();
    const settings = applyMobileOverrides(TIER_SETTINGS[tier], tier);
    return { tier, ...settings };
  }, []);

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const ctx = useContext(PerformanceContext);
  if (!ctx) {
    return { tier: 'medium', ...TIER_SETTINGS.medium };
  }
  return ctx;
}
