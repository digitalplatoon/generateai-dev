// Auto-generates public/sitemap.xml and public/sitemap-index.xml from
// src/utils/siteMap.ts route list. Runs via predev/prebuild hooks so any new
// public route added to siteMapRoutes appears in the sitemap without manual edits.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { siteMapRoutes } from "../src/utils/siteMap";

const BASE_URL = "https://generateai.dev";
const today = new Date().toISOString().split("T")[0];

function generateSitemap() {
  const urls = siteMapRoutes.map((r) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${r.path === "/" ? "/" : r.path}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      r.changefreq ? `    <changefreq>${r.changefreq}</changefreq>` : null,
      r.priority !== undefined ? `    <priority>${r.priority.toFixed(1)}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
    ``,
  ].join("\n");
}

function generateSitemapIndex() {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    `  <sitemap>`,
    `    <loc>${BASE_URL}/sitemap.xml</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `  </sitemap>`,
    `</sitemapindex>`,
    ``,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap());
writeFileSync(resolve("public/sitemap-index.xml"), generateSitemapIndex());
console.log(`sitemap.xml + sitemap-index.xml generated (${siteMapRoutes.length} routes)`);
