"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Button } from "@/components/ui/button";

export function DashboardView() {
  const { data, isLoading } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Financial Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time balance, income, expenses, and cashflow analytics.
          </p>
        </div>

        <Link href="/transactions?action=new">
          <Button className="gap-2 shadow-md shadow-indigo-600/20">
            <PlusCircle className="h-4 w-4" />
            Add Transaction
          </Button>
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <StatsCards summary={data?.summary} isLoading={isLoading} />

      {/* Chart & Recent Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart data={data?.chartData} isLoading={isLoading} />
        </div>
        <div>
          <RecentTransactions transactions={data?.recentTransactions} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
