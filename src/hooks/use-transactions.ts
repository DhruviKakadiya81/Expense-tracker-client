import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transaction.service";
import { useAuthStore } from "@/stores/use-auth-store";
import { TransactionFilters } from "@/types/transaction.types";

export const useTransactions = (filters: TransactionFilters) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { search, category, type, startDate, endDate, page, limit } = filters;

  return useQuery({
    queryKey: ["transactions", { search, category, type, startDate, endDate, page, limit }],
    queryFn: () =>
      transactionService.getAll({
        search,
        category,
        type,
        startDate,
        endDate,
        page,
        limit,
      }),
    enabled: isAuthenticated,
  });
};
