"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Transaction } from "@/types/transaction.types";
import { useFilterStore } from "@/stores/use-filter-store";
import { useTransactions } from "@/hooks/use-transactions";
import { transactionService } from "@/services/transaction.service";
import { queryClient } from "@/lib/query-client";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { TransactionModal } from "@/components/transactions/transaction-modal";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { MediaPreviewModal } from "@/components/shared/media-preview-modal";
import { Button } from "@/components/ui/button";

export function TransactionsView() {
  const searchParams = useSearchParams();
  const filters = useFilterStore();
  const { data, isLoading } = useTransactions(filters);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Delete states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Media preview modal
  const [mediaPreview, setMediaPreview] = useState<{
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

  // Check if URL contains action=new
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setEditingTransaction(null);
      setModalOpen(true);
    }
  }, [searchParams]);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setModalOpen(true);
  };

  const handleOpenDelete = (tx: Transaction) => {
    setTransactionToDelete(tx);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;
    try {
      setIsDeleting(true);
      await transactionService.delete(transactionToDelete._id);
      toast.success(`Transaction "${transactionToDelete.title}" deleted.`);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      setDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete transaction.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreviewMedia = (type: "image" | "video", url: string, title: string) => {
    setMediaPreview({
      open: true,
      type,
      url,
      title,
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Transactions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Search, filter, view receipts, and manage all your income & expenses.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-md shadow-indigo-600/20">
          <PlusCircle className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Filters Bar */}
      <TransactionFilters />

      {/* Table */}
      <TransactionTable
        transactions={data?.transactions}
        pagination={data?.pagination}
        isLoading={isLoading}
        onPageChange={filters.setPage}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onPreviewMedia={handlePreviewMedia}
      />

      {/* Add / Edit Modal */}
      <TransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        transactionToEdit={editingTransaction}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Transaction"
        description={`Are you sure you want to delete "${transactionToDelete?.title}"? Any uploaded receipts or videos will also be permanently removed.`}
        confirmText="Delete Transaction"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      {/* Receipt / Video Viewer Modal */}
      <MediaPreviewModal
        open={mediaPreview.open}
        onOpenChange={(open) => setMediaPreview((prev) => ({ ...prev, open }))}
        mediaType={mediaPreview.type}
        mediaUrl={mediaPreview.url}
        title={mediaPreview.title}
      />
    </div>
  );
}
