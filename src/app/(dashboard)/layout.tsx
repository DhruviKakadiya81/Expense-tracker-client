"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { Navbar } from "@/components/shared/navbar";
import { Sidebar } from "@/components/shared/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  // Auth checking skeleton view
  if (!mounted || isLoading || !isAuthenticated) {
    return (
      <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
        <header className="h-16 shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center animate-pulse">
              <Wallet className="h-4 w-4" />
            </div>
            <Skeleton className="h-5 w-28" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-4 space-y-3 hidden md:block">
            <Skeleton className="h-9 w-full rounded-xl" />
            <Skeleton className="h-9 w-full rounded-xl" />
            <Skeleton className="h-9 w-full rounded-xl" />
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-50/50 dark:bg-zinc-950 overflow-hidden">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
