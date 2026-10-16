import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { useAuthStore } from "@/stores/use-auth-store";

export const useCategories = (type?: string) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["categories", type || "all"],
    queryFn: () => categoryService.getAll(type),
    enabled: isAuthenticated,
  });
};
