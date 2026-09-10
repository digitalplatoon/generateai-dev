import { createFileRoute } from "@tanstack/react-router";
import SeoProjectDetail from "@/pages/SeoProjectDetail";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/seo-projects/$id")({
  component: () => (
    <ProtectedRoute>
      <SeoProjectDetail />
    </ProtectedRoute>
  ),
});
