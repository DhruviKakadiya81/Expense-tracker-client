import { create } from "zustand";

interface FilterState {
  search: string;
  category: string;
  type: "all" | "income" | "expense";
  startDate: string;
  endDate: string;
  page: number;
  limit: number;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setType: (type: "all" | "income" | "expense") => void;
  setDateRange: (startDate: string, endDate: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: "",
  category: "all",
  type: "all",
  startDate: "",
  endDate: "",
  page: 1,
  limit: 10,
  setSearch: (search) => set({ search, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setType: (type) => set({ type, page: 1 }),
  setDateRange: (startDate, endDate) => set({ startDate, endDate, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      search: "",
      category: "all",
      type: "all",
      startDate: "",
      endDate: "",
      page: 1,
    }),
}));
