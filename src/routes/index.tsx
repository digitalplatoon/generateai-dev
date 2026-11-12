import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "GenerateAI.dev - Build Production-Ready AI Agents in Minutes" },
      {
        name: "description",
        content:
          "Explore practical learning paths for large language models, retrieval-augmented generation, and AI agents, alongside developer tools and a prompt library.",
      },
      {
        property: "og:title",
        content: "GenerateAI.dev - Build Production-Ready AI Agents in Minutes",
      },
      {
        property: "og:description",
        content:
          "Explore practical learning paths for large language models, retrieval-augmented generation, and AI agents, alongside developer tools and a prompt library.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});
