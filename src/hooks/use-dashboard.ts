import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { useAuthStore } from "@/stores/use-auth-store";

export const useDashboard = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: dashboardService.getSummary,
    enabled: isAuthenticated,
  });
};
