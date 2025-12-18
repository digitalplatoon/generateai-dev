import { useEffect } from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const thresholds: Record<string, [number, number]> = {
    CLS: [0.1, 0.25],
    INP: [200, 500],
    LCP: [2500, 4000],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
  };

  const [good, poor] = thresholds[name] || [0, 0];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
};

const sendToAnalytics = (metric: WebVitalsMetric) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    const color = metric.rating === 'good' ? '#22c55e' : metric.rating === 'needs-improvement' ? '#f59e0b' : '#ef4444';
    console.log(
      `%c[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`,
      `color: ${color}; font-weight: bold;`
    );
  }

  // Send to your analytics endpoint
  if (typeof navigator.sendBeacon === 'function') {
    const body = JSON.stringify({
      ...metric,
      url: window.location.href,
      timestamp: Date.now(),
    });
    
    // Uncomment when you have an analytics endpoint
    // navigator.sendBeacon('/api/analytics/web-vitals', body);
  }
};

const handleMetric = (metric: Metric) => {
  const webVitalsMetric: WebVitalsMetric = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType || 'unknown',
  };
  
  sendToAnalytics(webVitalsMetric);
};

export const useWebVitals = () => {
  useEffect(() => {
    // Core Web Vitals
    onCLS(handleMetric);
    onINP(handleMetric);
    onLCP(handleMetric);
    
    // Additional metrics
    onFCP(handleMetric);
    onTTFB(handleMetric);
  }, []);
};

export default useWebVitals;
