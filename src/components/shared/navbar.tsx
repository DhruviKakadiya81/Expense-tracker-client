"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { LogOut, User as UserIcon, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
  const avatarSrc = user?.avatarUrl ? `${serverUrl}${user.avatarUrl}` : "";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
            ExpenseTracker
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <Link
            href="/profile"
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
          >
            <div className="relative h-8 w-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarSrc} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-4 w-4 text-zinc-500" />
              )}
            </div>
            <span className="hidden sm:inline-block text-xs font-medium text-zinc-700 dark:text-zinc-300 max-w-[120px] truncate">
              {user.name}
            </span>
          </Link>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1.5"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
