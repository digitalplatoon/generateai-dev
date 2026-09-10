import { createFileRoute } from "@tanstack/react-router";
import AgentsFunctional from "@/pages/AgentsFunctional";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/agents")({
  component: () => (
    <ProtectedRoute>
      <AgentsFunctional />
    </ProtectedRoute>
  ),
});
