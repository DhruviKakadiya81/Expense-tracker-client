"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { Transaction } from "@/types/transaction.types";
import { transactionFormSchema, TransactionFormValues } from "@/schemas/transaction.schema";
import { transactionService } from "@/services/transaction.service";
import { useCategories } from "@/hooks/use-categories";
import { queryClient } from "@/lib/query-client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionToEdit: Transaction | null;
}

export function TransactionModal({ open, onOpenChange, transactionToEdit }: TransactionModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Media states
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>("");
  const [removeExistingReceipt, setRemoveExistingReceipt] = useState(false);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [removeExistingVideo, setRemoveExistingVideo] = useState(false);
  const [videoMode, setVideoMode] = useState<"url" | "file">("url");

  const receiptInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      title: "",
      amount: 0,
      type: "expense",
      category: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      videoUrl: "",
    },
  });

  const selectedType = watch("type");
  const videoUrlValue = watch("videoUrl");

  // Fetch categories dynamically
  const { data: categories } = useCategories(selectedType);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // Reset form when modal opens or edit target changes
  useEffect(() => {
    if (transactionToEdit) {
      reset({
        title: transactionToEdit.title,
        amount: transactionToEdit.amount,
        type: transactionToEdit.type,
        category: (transactionToEdit.category?._id || transactionToEdit.category) as string,
        date: transactionToEdit.date ? new Date(transactionToEdit.date).toISOString().split("T")[0] : "",
        description: transactionToEdit.description || "",
        videoUrl: transactionToEdit.videoUrl?.startsWith("/uploads/") ? "" : transactionToEdit.videoUrl || "",
      });

      if (transactionToEdit.receiptUrl) {
        setReceiptPreview(`${serverUrl}${transactionToEdit.receiptUrl}`);
      } else {
        setReceiptPreview("");
      }

      if (transactionToEdit.videoUrl) {
        if (transactionToEdit.videoUrl.startsWith("/uploads/")) {
          setVideoPreview(`${serverUrl}${transactionToEdit.videoUrl}`);
          setVideoMode("file");
        } else {
          setVideoPreview(transactionToEdit.videoUrl);
          setVideoMode("url");
        }
      } else {
        setVideoPreview("");
      }
    } else {
      reset({
        title: "",
        amount: 0,
        type: "expense",
        category: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        videoUrl: "",
      });
      setReceiptPreview("");
      setVideoPreview("");
      setVideoMode("url");
    }

    setReceiptFile(null);
    setVideoFile(null);
    setRemoveExistingReceipt(false);
    setRemoveExistingVideo(false);
  }, [transactionToEdit, reset, open, serverUrl]);

  // Handle receipt selection with instant preview
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
      setRemoveExistingReceipt(false);
    }
  };

  const handleClearReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview("");
    setRemoveExistingReceipt(true);
    if (receiptInputRef.current) receiptInputRef.current.value = "";
  };

  // Handle video file selection with preview
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setRemoveExistingVideo(false);
      setValue("videoUrl", "");
    }
  };

  const handleClearVideo = () => {
    setVideoFile(null);
    setVideoPreview("");
    setRemoveExistingVideo(true);
    setValue("videoUrl", "");
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const onSubmit = async (values: TransactionFormValues) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("amount", String(values.amount));
      formData.append("type", values.type);
      formData.append("category", values.category);
      formData.append("date", values.date);
      if (values.description) formData.append("description", values.description);

      // Receipts
      if (receiptFile) {
        formData.append("receipt", receiptFile);
      } else if (removeExistingReceipt) {
        formData.append("removeReceipt", "true");
      }

      // Videos
      if (videoMode === "file" && videoFile) {
        formData.append("video", videoFile);
      } else if (videoMode === "url" && values.videoUrl) {
        formData.append("videoUrl", values.videoUrl);
      } else if (removeExistingVideo) {
        formData.append("removeVideo", "true");
      }

      if (transactionToEdit) {
        await transactionService.update(transactionToEdit._id, formData);
        toast.success(`Transaction "${values.title}" updated successfully.`);
      } else {
        await transactionService.create(formData);
        toast.success(`Transaction "${values.title}" created successfully.`);
      }

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save transaction.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{transactionToEdit ? "Edit Transaction" : "New Transaction"}</DialogTitle>
          <DialogDescription>
            Enter the details, select a category, and optionally attach a receipt or video.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setValue("type", "expense");
                  setValue("category", "");
                }}
                className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all cursor-pointer ${
                  selectedType === "expense"
                    ? "bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50"
                }`}
              >
                Expense
              </button>

              <button
                type="button"
                onClick={() => {
                  setValue("type", "income");
                  setValue("category", "");
                }}
                className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all cursor-pointer ${
                  selectedType === "income"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Title and Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="tx-title"
              label="Title"
              placeholder="e.g. Starbucks Coffee, Salary"
              error={errors.title?.message}
              {...register("title")}
            />

            <Input
              id="tx-amount"
              type="number"
              step="0.01"
              label="Amount ($)"
              placeholder="0.00"
              error={errors.amount?.message}
              {...register("amount")}
            />
          </div>

          {/* Category (Dynamic from Category API) and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="tx-category" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Category
              </label>
              <select
                id="tx-category"
                className="h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                {...register("category")}
              >
                <option value="">Select a Category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category?.message && (
                <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
              )}
            </div>

            <Input
              id="tx-date"
              type="date"
              label="Date"
              error={errors.date?.message}
              {...register("date")}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="tx-desc" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              id="tx-desc"
              rows={2}
              placeholder="Add extra context or notes..."
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              {...register("description")}
            />
          </div>

          {/* Receipt Image Attachment Section */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-indigo-500" />
                Receipt Image
              </span>
              {receiptPreview && (
                <button
                  type="button"
                  onClick={handleClearReceipt}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <X className="h-3 w-3" /> Remove
                </button>
              )}
            </div>

            {receiptPreview ? (
              <div className="relative h-28 w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-950/10 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={receiptPreview} alt="Receipt preview" className="h-full w-auto object-contain" />
              </div>
            ) : (
              <div
                onClick={() => receiptInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-3 text-center cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <Upload className="h-5 w-5 mx-auto text-zinc-400 mb-1" />
                <p className="text-xs text-zinc-500">Click to upload receipt photo (JPEG, PNG, WEBP)</p>
              </div>
            )}
            <input
              ref={receiptInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleReceiptChange}
            />
          </div>

          {/* Video Attachment Section */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <VideoIcon className="h-4 w-4 text-violet-500" />
                Video Attachment
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVideoMode("url")}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer ${
                    videoMode === "url" ? "bg-indigo-600 text-white" : "text-zinc-500"
                  }`}
                >
                  Video URL
                </button>
                <button
                  type="button"
                  onClick={() => setVideoMode("file")}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer ${
                    videoMode === "file" ? "bg-indigo-600 text-white" : "text-zinc-500"
                  }`}
                >
                  Upload File
                </button>
                {(videoPreview || videoUrlValue) && (
                  <button
                    type="button"
                    onClick={handleClearVideo}
                    className="text-xs text-rose-500 hover:underline flex items-center gap-0.5 ml-1 cursor-pointer"
                  >
                    <X className="h-3 w-3" /> Remove
                  </button>
                )}
              </div>
            </div>

            {videoMode === "url" ? (
              <Input
                id="tx-videoUrl"
                placeholder="https://youtube.com/watch?v=... or direct MP4 link"
                {...register("videoUrl")}
              />
            ) : videoPreview ? (
              <div className="relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-black flex items-center justify-center">
                <video src={videoPreview} controls className="max-h-28 w-full" />
              </div>
            ) : (
              <div
                onClick={() => videoInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-3 text-center cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <Upload className="h-5 w-5 mx-auto text-zinc-400 mb-1" />
                <p className="text-xs text-zinc-500">Click to upload video (MP4, WebM, max 50MB)</p>
              </div>
            )}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoFileChange}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {transactionToEdit ? "Save Changes" : "Create Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
