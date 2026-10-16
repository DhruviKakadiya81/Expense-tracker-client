import api from "@/lib/axios";
import { UserProfile } from "@/types/auth.types";

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get("/user/profile");
    return response.data.data;
  },

  updateProfile: async (data: { name?: string; email?: string; phone?: string }): Promise<UserProfile> => {
    const response = await api.put("/user/profile", data);
    return response.data.data;
  },

  uploadAvatar: async (formData: FormData): Promise<{ avatarUrl: string; user: UserProfile }> => {
    const response = await api.post("/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },
};
