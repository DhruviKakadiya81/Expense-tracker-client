import { Metadata } from "next";
import { LoginView } from "@/components/auth/login-view";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sign In | Expense Tracker",
    description: "Access your personal expense dashboard, transactions, and financial analytics.",
  };
}

export default function LoginPage() {
  return <LoginView />;
}
