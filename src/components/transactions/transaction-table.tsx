"use client";

import { Edit2, Trash2, Image, Video, ChevronLeft, ChevronRight } from "lucide-react";
import { Transaction, TransactionPagination } from "@/types/transaction.types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface TransactionTableProps {
  transactions?: Transaction[];
  pagination?: TransactionPagination;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onPreviewMedia: (type: "image" | "video", url: string, title: string) => void;
}

export function TransactionTable({
  transactions = [],
  pagination,
  isLoading,
  onPageChange,
  onEdit,
  onDelete,
  onPreviewMedia,
}: TransactionTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex justify-between items-center py-2.5">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center bg-white dark:bg-zinc-900">
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">No transactions match your filters.</p>
        <p className="text-xs text-zinc-400 mt-1">Try adjusting your search criteria, category filters, or date range.</p>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-950/40 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4 sm:px-6">Title / Notes</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-center">Media</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {transactions.map((tx) => {
                const isIncome = tx.type === "income";

                return (
                  <tr key={tx._id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                    {/* Title */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{tx.title}</div>
                      {tx.description && (
                        <div className="text-xs text-zinc-400 truncate max-w-xs">{tx.description}</div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      {tx.category ? (
                        <Badge
                          variant="outline"
                          className="font-medium text-xs"
                          style={{
                            borderColor: tx.category.color ? `${tx.category.color}40` : undefined,
                            color: tx.category.color,
                          }}
                        >
                          {tx.category.name}
                        </Badge>
                      ) : (
                        <span className="text-xs text-zinc-400">-</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs text-zinc-500 whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`font-bold text-sm ${
                          isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Attachments */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {tx.receiptUrl ? (
                          <button
                            type="button"
                            onClick={() =>
                              onPreviewMedia("image", tx.receiptUrl || "", `Receipt for ${tx.title}`)
                            }
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                            title="View receipt"
                          >
                            <Image className="h-4 w-4" />
                          </button>
                        ) : null}

                        {tx.videoUrl ? (
                          <button
                            type="button"
                            onClick={() =>
                              onPreviewMedia("video", tx.videoUrl || "", `Video for ${tx.title}`)
                            }
                            className="p-1.5 rounded-lg text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-colors cursor-pointer"
                            title="Play video"
                          >
                            <Video className="h-4 w-4" />
                          </button>
                        ) : null}

                        {!tx.receiptUrl && !tx.videoUrl && (
                          <span className="text-xs text-zinc-400">-</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(tx)}
                          className="h-8 w-8 text-zinc-500 hover:text-indigo-600"
                          title="Edit transaction"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(tx)}
                          className="h-8 w-8 text-zinc-500 hover:text-rose-600"
                          title="Delete transaction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-xs text-zinc-500">
            <div>
              Showing {transactions.length} of {pagination.total} transactions
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}
                className="h-8 gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </Button>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
                className="h-8 gap-1"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
