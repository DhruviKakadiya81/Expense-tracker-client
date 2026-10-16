import { z } from "zod";

export const transactionFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters").trim(),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  type: z.enum(["income", "expense"], {
    message: "Type must be either 'income' or 'expense'",
  }),
  category: z.string().min(1, "Please select a category"),
  date: z.string().min(1, "Date is required"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  videoUrl: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
