import { Category, CategoryType } from "./category.types";

export interface Transaction {
  _id: string;
  user: string;
  title: string;
  amount: number;
  type: CategoryType;
  category: Category;
  date: string;
  description?: string;
  receiptUrl?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  pagination: TransactionPagination;
}

export interface TransactionFilters {
  search?: string;
  category?: string;
  type?: "all" | "income" | "expense";
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
