import api from "@/lib/axios";
import { Transaction, TransactionFilters, TransactionListResponse } from "@/types/transaction.types";

export const transactionService = {
  getAll: async (filters: TransactionFilters = {}): Promise<TransactionListResponse> => {
    const params: any = {
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    if (filters.search && filters.search.trim()) {
      params.search = filters.search.trim();
    }
    if (filters.category && filters.category !== "all") {
      params.category = filters.category;
    }
    if (filters.type && filters.type !== "all") {
      params.type = filters.type;
    }
    if (filters.startDate) {
      params.startDate = filters.startDate;
    }
    if (filters.endDate) {
      params.endDate = filters.endDate;
    }

    const response = await api.get("/transactions", { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data.data;
  },

  create: async (formData: FormData): Promise<Transaction> => {
    const response = await api.post("/transactions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  update: async (id: string, formData: FormData): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  delete: async (id: string): Promise<{ id: string }> => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data.data;
  },
};
