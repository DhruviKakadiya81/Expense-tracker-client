"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Category } from "@/types/category.types";
import { useCategories } from "@/hooks/use-categories";
import { categoryService } from "@/services/category.service";
import { queryClient } from "@/lib/query-client";
import { CategoryList } from "@/components/categories/category-list";
import { CategoryModal } from "@/components/categories/category-modal";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { Button } from "@/components/ui/button";

export function CategoriesView() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const { data: categories, isLoading } = useCategories(selectedType);

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Delete Confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleOpenDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setIsDeleting(true);
      await categoryService.delete(categoryToDelete._id);
      toast.success(`Category "${categoryToDelete.name}" deleted successfully.`);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to delete category."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Create, customize, and manage spending & earning categories.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-md shadow-indigo-600/20">
          <PlusCircle className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 w-fit">
        {["all", "expense", "income"].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
              selectedType === t
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <CategoryList
        categories={categories}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Add / Edit Modal */}
      <CategoryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        categoryToEdit={editingCategory}
      />

      {/* Delete Integrity Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? You will only be allowed to delete it if no existing transactions are currently using it.`}
        confirmText="Delete Category"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
