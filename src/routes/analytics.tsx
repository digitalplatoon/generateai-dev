import { createFileRoute } from "@tanstack/react-router";
import Analytics from "@/pages/Analytics";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/analytics")({
  component: () => (
    <ProtectedRoute>
      <Analytics />
    </ProtectedRoute>
  ),
});
