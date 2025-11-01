import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics 4 Configuration
// Replace with your actual Measurement ID when deploying
const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// Initialize gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const initGA4 = () => {
  if (typeof window === 'undefined') return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA4_MEASUREMENT_ID, {
    send_page_view: true,
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);
};

// Custom event tracking
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Track page views
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
    });
  }
};

// Common event trackers
export const trackSignUp = (method: string) => {
  trackEvent('sign_up', { method });
};

export const trackCTAClick = (buttonName: string, pageLocation: string) => {
  trackEvent('cta_click', {
    button_name: buttonName,
    page_location: pageLocation
  });
};

export const trackPromptUsed = (promptId: string, promptTitle: string, category: string) => {
  trackEvent('prompt_used', {
    prompt_id: promptId,
    prompt_title: promptTitle,
    category
  });
};

export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value,
    currency: 'USD',
    items
  });
};

// Hook to track page views on route change
export const useGA4PageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
};
