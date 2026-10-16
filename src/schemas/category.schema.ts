import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name cannot exceed 50 characters").trim(),
  type: z.enum(["income", "expense"], {
    message: "Type must be either 'income' or 'expense'",
  }),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please select a valid hex color code"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
