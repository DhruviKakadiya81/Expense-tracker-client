"use client";

import { Search, RotateCcw } from "lucide-react";
import { useFilterStore } from "@/stores/use-filter-store";
import { useCategories } from "@/hooks/use-categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TransactionFilters() {
  const {
    search,
    category,
    type,
    startDate,
    endDate,
    setSearch,
    setCategory,
    setType,
    setDateRange,
    resetFilters,
  } = useFilterStore();

  const { data: categories } = useCategories();

  return (
    <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-sm space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search by title */}
        <div className="relative lg:col-span-2">
          <Input
            id="search"
            placeholder="Search transactions by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
        </div>

        {/* Dynamic Category Selector */}
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name} ({cat.type})
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "all" | "income" | "expense")}
            className="h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            className="w-full h-10 gap-2 text-zinc-600 dark:text-zinc-300"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Date Range Row */}
      <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-500">
        <span className="font-semibold">Filter Date:</span>
        <div className="flex items-center gap-2">
          <span>From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setDateRange(e.target.value, endDate)}
            className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <span>To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setDateRange(startDate, e.target.value)}
            className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
