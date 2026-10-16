import api from "@/lib/axios";
import { DashboardSummaryResponse } from "@/types/dashboard.types";

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummaryResponse> => {
    const response = await api.get("/dashboard/summary");
    return response.data.data;
  },
};
