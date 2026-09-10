import { createFileRoute } from "@tanstack/react-router";
import EnhancedAI from "@/pages/EnhancedAI";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/enhanced-ai")({
  component: () => (
    <ProtectedRoute>
      <EnhancedAI />
    </ProtectedRoute>
  ),
});
