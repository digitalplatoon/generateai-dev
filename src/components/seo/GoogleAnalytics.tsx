import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

// Updated with your actual Google Analytics Measurement ID
const GA_TRACKING_ID = 'G-68VLBBRJS1';

const GoogleAnalytics: React.FC = () => {
  const [shouldLoadGA, setShouldLoadGA] = useState(false);

  useEffect(() => {
    // Only add the script in production and if a valid ID is provided.
    if (process.env.NODE_ENV !== 'production' || !GA_TRACKING_ID.startsWith('G-')) {
      return;
    }

    // Defer GA loading until user interaction or after 3 seconds
    const loadGA = () => setShouldLoadGA(true);
    
    // Load on user interaction
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, loadGA, { once: true, passive: true });
    });

    // Fallback: load after 3 seconds if no interaction
    const timer = setTimeout(loadGA, 3000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, loadGA);
      });
      clearTimeout(timer);
    };
  }, []);

  // Only add the script in production and if a valid ID is provided.
  if (process.env.NODE_ENV !== 'production' || !GA_TRACKING_ID.startsWith('G-') || !shouldLoadGA) {
    return null;
  }

  return (
    <Helmet>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
        `}
      </script>
    </Helmet>
  );
};

export default GoogleAnalytics;
