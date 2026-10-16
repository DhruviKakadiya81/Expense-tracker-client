import { Metadata } from "next";
import { CategoriesView } from "@/components/categories/categories-view";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Categories | Expense Tracker",
    description: "Manage your expense and income categories with integrity and safe deletion checks.",
  };
}

export default function CategoriesPage() {
  return <CategoriesView />;
}
