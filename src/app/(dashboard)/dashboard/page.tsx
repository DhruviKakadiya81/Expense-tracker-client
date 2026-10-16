import { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Financial Dashboard | Expense Tracker",
    description: "Monitor your total income, expenses, current balance, and recent transaction history.",
  };
}

export default function DashboardPage() {
  return <DashboardView />;
}
