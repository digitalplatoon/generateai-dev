import { createFileRoute } from "@tanstack/react-router";
import SeoAuditReport from "@/pages/SeoAuditReport";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/seo-audit/$scanRunId")({
  component: () => (
    <ProtectedRoute>
      <SeoAuditReport />
    </ProtectedRoute>
  ),
});
