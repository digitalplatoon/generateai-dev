import { useState, useEffect, useCallback } from 'react';

interface ABTestVariant {
  id: string;
  name: string;
  weight?: number; // 0-100, defaults to equal distribution
}

interface ABTestConfig {
  testId: string;
  variants: ABTestVariant[];
}

interface ABTestResult {
  variant: string;
  trackConversion: (eventName?: string) => void;
  isLoading: boolean;
}

const STORAGE_PREFIX = 'ab_test_';
const CONVERSION_PREFIX = 'ab_conversion_';

const getStoredVariant = (testId: string): string | null => {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${testId}`);
  } catch {
    return null;
  }
};

const storeVariant = (testId: string, variant: string): void => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${testId}`, variant);
  } catch {
    // localStorage not available
  }
};

const selectVariant = (variants: ABTestVariant[]): string => {
  const totalWeight = variants.reduce((sum, v) => sum + (v.weight ?? 100 / variants.length), 0);
  const random = Math.random() * totalWeight;
  
  let cumulative = 0;
  for (const variant of variants) {
    cumulative += variant.weight ?? 100 / variants.length;
    if (random <= cumulative) {
      return variant.id;
    }
  }
  
  return variants[0].id;
};

export const useABTest = ({ testId, variants }: ABTestConfig): ABTestResult => {
  const [variant, setVariant] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing assignment
    const storedVariant = getStoredVariant(testId);
    
    if (storedVariant && variants.some(v => v.id === storedVariant)) {
      setVariant(storedVariant);
    } else {
      // Assign new variant
      const newVariant = selectVariant(variants);
      storeVariant(testId, newVariant);
      setVariant(newVariant);
      
      // Log assignment
      if (import.meta.env.DEV) {
        console.log(`[A/B Test] ${testId}: Assigned to variant "${newVariant}"`);
      }
    }
    
    setIsLoading(false);
  }, [testId, variants]);

  const trackConversion = useCallback((eventName: string = 'conversion') => {
    const conversionKey = `${CONVERSION_PREFIX}${testId}_${eventName}`;
    
    // Prevent duplicate conversions in same session
    if (sessionStorage.getItem(conversionKey)) {
      return;
    }
    
    sessionStorage.setItem(conversionKey, 'true');
    
    const conversionData = {
      testId,
      variant,
      eventName,
      timestamp: Date.now(),
      url: window.location.href,
    };
    
    if (import.meta.env.DEV) {
      console.log(`[A/B Test] Conversion tracked:`, conversionData);
    }
    
    // Send to analytics
    // navigator.sendBeacon('/api/analytics/ab-conversion', JSON.stringify(conversionData));
  }, [testId, variant]);

  return { variant, trackConversion, isLoading };
};

// Pre-defined test configurations
export const HERO_CTA_TEST: ABTestConfig = {
  testId: 'hero_cta_2024',
  variants: [
    { id: 'control', name: 'Start Building Free', weight: 50 },
    { id: 'variant_a', name: 'Get Started Now', weight: 25 },
    { id: 'variant_b', name: 'Try Free Today', weight: 25 },
  ],
};

export default useABTest;
