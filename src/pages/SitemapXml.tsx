
import React from 'react';
import { generateSitemap } from '@/utils/siteMap';
import { Helmet } from 'react-helmet-async';

const SitemapXml = () => {
  const sitemapContent = generateSitemap();

  return (
    <>
      <Helmet>
        <title>Sitemap</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <pre className="bg-white text-black p-4 font-mono text-sm whitespace-pre overflow-x-auto h-screen">
        {sitemapContent}
      </pre>
    </>
  );
};

export default SitemapXml;
