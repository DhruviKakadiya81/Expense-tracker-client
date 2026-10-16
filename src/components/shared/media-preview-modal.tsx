"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MediaPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaType: "image" | "video" | null;
  mediaUrl: string | null;
  title?: string;
}

export function MediaPreviewModal({
  open,
  onOpenChange,
  mediaType,
  mediaUrl,
  title = "Attachment Preview",
}: MediaPreviewModalProps) {
  if (!mediaUrl) return null;

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
  const fullUrl = mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://")
    ? mediaUrl
    : `${serverUrl}${mediaUrl}`;

  const isYouTube = fullUrl.includes("youtube.com") || fullUrl.includes("youtu.be");

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      const urlObj = new URL(url);
      const v = urlObj.searchParams.get("v");
      return v ? `https://www.youtube.com/embed/${v}` : url;
    } catch {
      return url;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center p-2 rounded-xl bg-zinc-950/5 dark:bg-zinc-950/50 overflow-hidden">
          {mediaType === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fullUrl}
              alt="Receipt Preview"
              className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-sm"
            />
          )}

          {mediaType === "video" && isYouTube && (
            <div className="w-full aspect-video">
              <iframe
                src={getYouTubeEmbedUrl(fullUrl)}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          )}

          {mediaType === "video" && !isYouTube && (
            <video
              src={fullUrl}
              controls
              autoPlay
              className="max-h-[70vh] w-full rounded-lg shadow-sm"
            >
              Your browser does not support playing this video.
            </video>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
