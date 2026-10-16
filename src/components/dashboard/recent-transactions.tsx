"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Image, Video, ArrowRight } from "lucide-react";
import { Transaction } from "@/types/transaction.types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaPreviewModal } from "@/components/shared/media-preview-modal";

interface RecentTransactionsProps {
  transactions?: Transaction[];
  isLoading: boolean;
}

export function RecentTransactions({ transactions = [], isLoading }: RecentTransactionsProps) {
  const [previewMedia, setPreviewMedia] = useState<{
    open: boolean;
    type: "image" | "video" | null;
    url: string | null;
    title: string;
  }>({
    open: false,
    type: null,
    url: null,
    title: "",
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activities</CardDescription>
          </div>
          <Link
            href="/transactions"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400 flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>

        <CardContent>
          {transactions.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              No transactions recorded yet. Click &quot;Add Transaction&quot; to get started.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {transactions.map((tx) => {
                const isIncome = tx.type === "income";

                return (
                  <div key={tx._id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isIncome
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                        }`}
                      >
                        {isIncome ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[180px] sm:max-w-xs">
                            {tx.title}
                          </p>
                          {tx.receiptUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewMedia({
                                  open: true,
                                  type: "image",
                                  url: tx.receiptUrl || "",
                                  title: `Receipt for ${tx.title}`,
                                })
                              }
                              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                              title="View Receipt"
                            >
                              <Image className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {tx.videoUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewMedia({
                                  open: true,
                                  type: "video",
                                  url: tx.videoUrl || "",
                                  title: `Video for ${tx.title}`,
                                })
                              }
                              className="text-violet-600 hover:text-violet-700 dark:text-violet-400"
                              title="Play Video"
                            >
                              <Video className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-zinc-400">{formatDate(tx.date)}</span>
                          {tx.category && (
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0 px-2 font-normal"
                              style={{
                                borderColor: tx.category.color ? `${tx.category.color}40` : undefined,
                                color: tx.category.color,
                              }}
                            >
                              {tx.category.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p
                        className={`text-sm font-bold tracking-tight ${
                          isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <MediaPreviewModal
        open={previewMedia.open}
        onOpenChange={(open) => setPreviewMedia((prev) => ({ ...prev, open }))}
        mediaType={previewMedia.type}
        mediaUrl={previewMedia.url}
        title={previewMedia.title}
      />
    </>
  );
}
