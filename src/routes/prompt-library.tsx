import { createFileRoute } from "@tanstack/react-router";
import PromptLibrary from "@/pages/PromptLibrary";

export const Route = createFileRoute("/prompt-library")({
  component: PromptLibrary,
});
