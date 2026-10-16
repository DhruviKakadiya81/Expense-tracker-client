"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Category } from "@/types/category.types";
import { categoryFormSchema, CategoryFormValues } from "@/schemas/category.schema";
import { categoryService } from "@/services/category.service";
import { queryClient } from "@/lib/query-client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryToEdit: Category | null;
}

const PRESET_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#ef4444", // Red
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#14b8a6", // Teal
];

export function CategoryModal({ open, onOpenChange, categoryToEdit }: CategoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      type: "expense",
      color: "#6366f1",
    },
  });

  const selectedColor = watch("color");
  const selectedType = watch("type");

  useEffect(() => {
    if (categoryToEdit) {
      reset({
        name: categoryToEdit.name,
        type: categoryToEdit.type,
        color: categoryToEdit.color || "#6366f1",
      });
    } else {
      reset({
        name: "",
        type: "expense",
        color: "#6366f1",
      });
    }
  }, [categoryToEdit, reset, open]);

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setIsLoading(true);
      if (categoryToEdit) {
        await categoryService.update(categoryToEdit._id, values);
        toast.success(`Category "${values.name}" updated successfully`);
      } else {
        await categoryService.create(values);
        toast.success(`Category "${values.name}" created successfully`);
      }

      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{categoryToEdit ? "Edit Category" : "New Category"}</DialogTitle>
          <DialogDescription>
            {categoryToEdit
              ? "Update this category's title, type, and badge color."
              : "Create a custom category to organize your income and expenses."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="cat-name"
            label="Category Name"
            placeholder="e.g. Groceries, Freelance, Utilities"
            error={errors.name?.message}
            {...register("name")}
          />

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Category Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue("type", "expense")}
                className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all cursor-pointer ${
                  selectedType === "expense"
                    ? "bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                Expense
              </button>

              <button
                type="button"
                onClick={() => setValue("type", "income")}
                className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all cursor-pointer ${
                  selectedType === "income"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                Income
              </button>
            </div>
            {errors.type?.message && (
              <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Color Tag
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("color", color)}
                  className={`h-7 w-7 rounded-full transition-transform cursor-pointer ${
                    selectedColor === color ? "scale-125 ring-2 ring-offset-2 ring-indigo-500" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                className="h-7 w-7 p-0 rounded-full border-0 cursor-pointer overflow-hidden"
                value={selectedColor || "#6366f1"}
                onChange={(e) => setValue("color", e.target.value)}
                title="Custom color"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {categoryToEdit ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
