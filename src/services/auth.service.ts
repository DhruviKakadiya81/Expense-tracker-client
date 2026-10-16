import api from "@/lib/axios";
import { AuthResponse, UserProfile } from "@/types/auth.types";

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", userData);
    return response.data.data;
  },

  getMe: async (): Promise<UserProfile> => {
    const response = await api.get("/auth/me");
    return response.data.data;
  },
};
