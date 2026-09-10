import { createFileRoute } from "@tanstack/react-router";
import LearningPaths from "@/pages/LearningPaths";

export const Route = createFileRoute("/paths")({
  component: LearningPaths,
});
