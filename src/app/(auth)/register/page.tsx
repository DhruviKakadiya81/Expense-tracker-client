import { Metadata } from "next";
import { RegisterView } from "@/components/auth/register-view";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Create Account | Expense Tracker",
    description: "Sign up to track your expenses, manage categories, and visualize spending.",
  };
}

export default function RegisterPage() {
  return <RegisterView />;
}
