"use client";

import { MonthlyChartData } from "@/types/dashboard.types";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface IncomeExpenseChartProps {
  data?: MonthlyChartData[];
  isLoading: boolean;
}

export function IncomeExpenseChart({ data = [], isLoading }: IncomeExpenseChartProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-64" />
        </CardHeader>
        <CardContent className="h-64 flex items-end gap-6 pt-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-1 flex gap-2 items-end h-full">
              <Skeleton className="w-1/2 h-[40%]" />
              <Skeleton className="w-1/2 h-[70%]" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Calculate highest value for relative bar heights
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.income, d.expense)),
    100
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle>Income vs. Expenses</CardTitle>
          <CardDescription>Monthly comparison over the last 6 months</CardDescription>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-emerald-500 inline-block" />
            <span className="text-zinc-600 dark:text-zinc-400">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-rose-500 inline-block" />
            <span className="text-zinc-600 dark:text-zinc-400">Expenses</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-zinc-500">
            No transaction records available to plot yet.
          </div>
        ) : (
          <div className="h-64 flex items-end gap-3 sm:gap-6 pt-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            {data.map((item, idx) => {
              const incomeHeight = Math.max(4, Math.round((item.income / maxVal) * 100));
              const expenseHeight = Math.max(4, Math.round((item.expense / maxVal) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full pb-2">
                    {/* Income Bar */}
                    <div
                      style={{ height: `${incomeHeight}%` }}
                      className="w-1/2 max-w-[28px] bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all relative group/bar"
                    >
                      <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                        {formatCurrency(item.income)}
                      </div>
                    </div>

                    {/* Expense Bar */}
                    <div
                      style={{ height: `${expenseHeight}%` }}
                      className="w-1/2 max-w-[28px] bg-rose-500 rounded-t-md hover:bg-rose-600 transition-all relative group/bar"
                    >
                      <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                        {formatCurrency(item.expense)}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-2 truncate max-w-full">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
