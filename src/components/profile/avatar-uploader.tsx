"use client";

import { useRef, useState } from "react";
import { Camera, User } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";
import { userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";

export function AvatarUploader() {
  const { user, setUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
  const avatarSrc = user?.avatarUrl ? `${serverUrl}${user.avatarUrl}` : "";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await userService.uploadAvatar(formData);
      setUser(res.user);
      toast.success("Profile photo updated successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload profile picture.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="relative group">
        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-indigo-500/30 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shadow-md">
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarSrc} alt={user?.name || "Profile"} className="h-full w-full object-cover" />
          ) : (
            <User className="h-10 w-10 text-zinc-400" />
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
          title="Change Photo"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      <div className="text-center sm:text-left space-y-1">
        <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">{user?.name}</h4>
        <p className="text-xs text-zinc-400">{user?.email}</p>
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
            className="text-xs h-8"
          >
            Upload New Photo
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
