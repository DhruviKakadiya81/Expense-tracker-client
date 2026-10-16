import { Transaction } from "./transaction.types";

export interface DashboardSummaryMetrics {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  incomeCount: number;
  expenseCount: number;
  totalTransactions: number;
}

export interface MonthlyChartData {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryExpenseData {
  _id: string;
  name: string;
  color: string;
  total: number;
  count: number;
}

export interface DashboardSummaryResponse {
  summary: DashboardSummaryMetrics;
  recentTransactions: Transaction[];
  chartData: MonthlyChartData[];
  categoryExpenses: CategoryExpenseData[];
}
