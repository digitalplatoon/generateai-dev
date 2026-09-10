import { createFileRoute } from "@tanstack/react-router";
import SitemapXml from "@/pages/SitemapXml";

export const Route = createFileRoute("/sitemap.xml")({
  component: SitemapXml,
});
