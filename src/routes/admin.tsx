import { createFileRoute } from "@tanstack/react-router";
import AdminDashboard from "@/pages/AdminDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/admin")({
  component: () => (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  ),
});
