import { createFileRoute } from "@tanstack/react-router";
import RagLabFunctional from "@/pages/RagLabFunctional";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/rag-lab")({
  component: () => (
    <ProtectedRoute>
      <RagLabFunctional />
    </ProtectedRoute>
  ),
});
