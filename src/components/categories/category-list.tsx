"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Category } from "@/types/category.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryListProps {
  categories?: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryList({ categories = [], isLoading, onEdit, onDelete }: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-14 rounded-full" />
              </div>
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center">
        <p className="text-sm font-medium text-zinc-500">No categories found.</p>
        <p className="text-xs text-zinc-400 mt-1">Create your first category above to begin organizing transactions.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {categories.map((category) => {
        const isIncome = category.type === "income";

        return (
          <Card key={category._id} className="hover:shadow-md transition-shadow group">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="h-4 w-4 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: category.color || "#6366f1" }}
                />
                <div>
                  <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate max-w-[140px]">
                    {category.name}
                  </h4>
                  <Badge variant={isIncome ? "income" : "expense"} className="mt-1 text-[10px] uppercase font-bold tracking-wider">
                    {category.type}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(category)}
                  className="h-8 w-8 text-zinc-500 hover:text-indigo-600"
                  title="Edit category"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(category)}
                  className="h-8 w-8 text-zinc-500 hover:text-rose-600"
                  title="Delete category"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
