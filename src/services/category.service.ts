import api from "@/lib/axios";
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from "@/types/category.types";

export const categoryService = {
  getAll: async (type?: string): Promise<Category[]> => {
    const params = type && type !== "all" ? { type } : {};
    const response = await api.get("/categories", { params });
    return response.data.data;
  },

  create: async (data: CreateCategoryDTO): Promise<Category> => {
    const response = await api.post("/categories", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateCategoryDTO): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<{ id: string }> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data.data;
  },
};
