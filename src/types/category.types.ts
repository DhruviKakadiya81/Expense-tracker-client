export type CategoryType = "income" | "expense";

export interface Category {
  _id: string;
  user: string;
  name: string;
  type: CategoryType;
  color?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCategoryDTO {
  name: string;
  type: CategoryType;
  color?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  type?: CategoryType;
  color?: string;
}
