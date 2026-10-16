"use client";

import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DashboardSummaryMetrics } from "@/types/dashboard.types";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
  summary?: DashboardSummaryMetrics;
  isLoading: boolean;
}

export function StatsCards({ summary, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    );
  }

  const currentBalance = summary?.currentBalance ?? 0;
  const totalIncome = summary?.totalIncome ?? 0;
  const totalExpense = summary?.totalExpense ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Current Balance */}
      <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/30 dark:from-indigo-950/20 dark:via-zinc-900 dark:to-zinc-900 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Current Balance
            </p>
            <h4
              className={`text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight ${
                currentBalance >= 0 ? "text-zinc-900 dark:text-white" : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {formatCurrency(currentBalance)}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 flex items-center gap-1 font-medium">
          Net savings & cashflow
        </p>
      </div>

      {/* Total Income */}
      <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-emerald-950/20 dark:via-zinc-900 dark:to-zinc-900 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Income
            </p>
            <h4 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalIncome)}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 font-medium">
          {summary?.incomeCount ?? 0} income entries recorded
        </p>
      </div>

      {/* Total Expenses */}
      <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-gradient-to-br from-rose-50/50 via-white to-orange-50/30 dark:from-rose-950/20 dark:via-zinc-900 dark:to-zinc-900 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Expenses
            </p>
            <h4 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight text-rose-600 dark:text-rose-400">
              {formatCurrency(totalExpense)}
            </h4>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500 text-white shadow-md shadow-rose-500/20">
            <TrendingDown className="h-5 w-5" />
          </div>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 font-medium">
          {summary?.expenseCount ?? 0} expense entries recorded
        </p>
      </div>
    </div>
  );
}
