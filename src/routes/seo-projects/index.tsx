import { createFileRoute } from "@tanstack/react-router";
import SeoProjects from "@/pages/SeoProjects";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/seo-projects")({
  component: () => (
    <ProtectedRoute>
      <SeoProjects />
    </ProtectedRoute>
  ),
});
