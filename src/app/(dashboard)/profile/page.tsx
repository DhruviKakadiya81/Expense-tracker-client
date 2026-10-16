import { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "My Profile | Expense Tracker",
    description: "Manage your personal profile information, contact details, and avatar image.",
  };
}

export default function ProfilePage() {
  return <ProfileView />;
}
