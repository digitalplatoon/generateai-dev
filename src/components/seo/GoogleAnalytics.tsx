import React from 'react';
import { Helmet } from 'react-helmet-async';

// Updated with your actual Google Analytics Measurement ID
const GA_TRACKING_ID = 'G-68VLBBRJS1';

const GoogleAnalytics: React.FC = () => {
  // Only add the script in production and if a valid ID is provided.
  if (process.env.NODE_ENV !== 'production' || !GA_TRACKING_ID.startsWith('G-')) {
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
