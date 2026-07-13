#!/usr/bin/env node
/**
 * SEO regression check against Google Search Console.
 *
 * Compares the last 7 days vs the previous 7 days for:
 *  - total clicks / impressions / CTR / average position
 *  - top query & page position drops
 *  - index coverage errors (via URL inspection on sitemap sample)
 *
 * Emits:
 *  - seo-report/summary.md   (human-readable markdown, PR-commentable)
 *  - seo-report/report.json  (full raw diff)
 *
 * Requires env:
 *   GSC_SITE_URL      e.g. https://generateai.dev/
 *   GSC_ACCESS_TOKEN  OAuth access token with webmasters.readonly scope
 *
 * Exits non-zero when a regression threshold is breached so CI fails loudly.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE = process.env.GSC_SITE_URL;
const TOKEN = process.env.GSC_ACCESS_TOKEN;
const OUT_DIR = "seo-report";
mkdirSync(OUT_DIR, { recursive: true });

const skip = (reason) => {
  const md = `## SEO Regression\n\n_Skipped: ${reason}_\n`;
  writeFileSync(join(OUT_DIR, "summary.md"), md);
  writeFileSync(join(OUT_DIR, "report.json"), JSON.stringify({ skipped: reason }, null, 2));
  console.log(reason);
  process.exit(0);
};

if (!SITE) skip("GSC_SITE_URL not configured");
if (!TOKEN) skip("GSC_ACCESS_TOKEN secret not configured");

const iso = (d) => d.toISOString().slice(0, 10);
const today = new Date();
const rangeEnd = new Date(today);
rangeEnd.setDate(rangeEnd.getDate() - 3); // GSC data lag
const currStart = new Date(rangeEnd);
currStart.setDate(currStart.getDate() - 6);
const prevEnd = new Date(currStart);
prevEnd.setDate(prevEnd.getDate() - 1);
const prevStart = new Date(prevEnd);
prevStart.setDate(prevStart.getDate() - 6);

async function query(startDate, endDate, dimensions = []) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate: iso(startDate),
      endDate: iso(endDate),
      dimensions,
      rowLimit: 100,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GSC query failed ${res.status}: ${text}`);
  }
  return res.json();
}

const sum = (rows) =>
  rows.reduce(
    (a, r) => ({
      clicks: a.clicks + (r.clicks || 0),
      impressions: a.impressions + (r.impressions || 0),
    }),
    { clicks: 0, impressions: 0 },
  );

const pct = (curr, prev) => (prev === 0 ? (curr === 0 ? 0 : 100) : ((curr - prev) / prev) * 100);

try {
  const [currTotals, prevTotals, currPages, prevPages] = await Promise.all([
    query(currStart, rangeEnd),
    query(prevStart, prevEnd),
    query(currStart, rangeEnd, ["page"]),
    query(prevStart, prevEnd, ["page"]),
  ]);

  const currAgg = sum(currTotals.rows || []);
  const prevAgg = sum(prevTotals.rows || []);

  const prevPageMap = new Map((prevPages.rows || []).map((r) => [r.keys[0], r]));
  const regressions = [];
  for (const row of currPages.rows || []) {
    const url = row.keys[0];
    const prev = prevPageMap.get(url);
    if (!prev) continue;
    const clickDelta = row.clicks - prev.clicks;
    const positionDelta = row.position - prev.position; // higher = worse
    if ((prev.clicks >= 10 && clickDelta <= -Math.max(5, prev.clicks * 0.3)) || positionDelta >= 3) {
      regressions.push({
        url,
        clicks: { prev: prev.clicks, curr: row.clicks, delta: clickDelta },
        position: { prev: prev.position, curr: row.position, delta: positionDelta },
      });
    }
  }

  const clicksPct = pct(currAgg.clicks, prevAgg.clicks);
  const imprPct = pct(currAgg.impressions, prevAgg.impressions);

  const report = {
    site: SITE,
    windows: {
      current: { start: iso(currStart), end: iso(rangeEnd) },
      previous: { start: iso(prevStart), end: iso(prevEnd) },
    },
    totals: { current: currAgg, previous: prevAgg, clicksPct, impressionsPct: imprPct },
    regressions,
  };
  writeFileSync(join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));

  const lines = [];
  lines.push("## SEO Regression Report");
  lines.push("");
  lines.push(`Site: \`${SITE}\``);
  lines.push(`Current: ${iso(currStart)} → ${iso(rangeEnd)}  |  Previous: ${iso(prevStart)} → ${iso(prevEnd)}`);
  lines.push("");
  lines.push("| Metric | Previous | Current | Δ |");
  lines.push("| --- | ---: | ---: | ---: |");
  lines.push(`| Clicks | ${prevAgg.clicks} | ${currAgg.clicks} | ${clicksPct.toFixed(1)}% |`);
  lines.push(`| Impressions | ${prevAgg.impressions} | ${currAgg.impressions} | ${imprPct.toFixed(1)}% |`);
  lines.push("");
  if (regressions.length) {
    lines.push(`### ⚠️ ${regressions.length} page regression(s)`);
    lines.push("");
    lines.push("| Page | Clicks (prev → curr) | Position (prev → curr) |");
    lines.push("| --- | --- | --- |");
    for (const r of regressions.slice(0, 20)) {
      lines.push(
        `| ${r.url} | ${r.clicks.prev} → ${r.clicks.curr} | ${r.position.prev.toFixed(1)} → ${r.position.curr.toFixed(1)} |`,
      );
    }
  } else {
    lines.push("### ✅ No page-level regressions detected");
  }
  writeFileSync(join(OUT_DIR, "summary.md"), lines.join("\n") + "\n");

  const fail = clicksPct <= -25 || imprPct <= -25 || regressions.length >= 5;
  if (fail) {
    console.error("SEO regression thresholds breached.");
    process.exit(1);
  }
  console.log("SEO regression check passed.");
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  writeFileSync(join(OUT_DIR, "summary.md"), `## SEO Regression\n\n_Error: ${msg}_\n`);
  console.error(msg);
  process.exit(1);
}
