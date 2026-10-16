import { Metadata } from "next";
import { Suspense } from "react";
import { TransactionsView } from "@/components/transactions/transactions-view";
import { Skeleton } from "@/components/ui/skeleton";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Transactions | Expense Tracker",
    description: "Filter, search, view receipts, and manage all your income and expenses.",
  };
}

export default function TransactionsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <TransactionsView />
    </Suspense>
  );
}
