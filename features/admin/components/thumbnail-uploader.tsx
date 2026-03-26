"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useVideoUpload } from "@/features/admin/hooks/use-video-upload";

interface ThumbnailUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  onClear?: () => void;
}

export function ThumbnailUploader({ value, onChange, onClear }: ThumbnailUploaderProps) {
  const { uploading, progress, error, upload } = useVideoUpload("academy-thumbnails");

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      try {
        const url = await upload(file);
        onChange(url);
      } catch {
        // error surfaced via state
      }
    },
    [upload, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    disabled: uploading,
  });

  if (value) {
    return (
      <div className="bg-muted relative aspect-video overflow-hidden rounded-lg border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="Thumbnail" className="h-full w-full object-cover" />
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
          >
            <IconX className="size-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40",
          uploading && "cursor-not-allowed opacity-60",
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="w-full space-y-2 px-4">
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>Enviando...</span>
              <span>{progress}%</span>
            </div>
            <div className="bg-muted h-1.5 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            {isDragActive ? (
              <IconPhoto className="text-primary size-7" />
            ) : (
              <IconUpload className="text-muted-foreground size-7" />
            )}
            <div>
              <p className="text-sm font-medium">
                {isDragActive ? "Solte a imagem aqui" : "Arraste uma imagem ou clique"}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">JPG, PNG, WebP</p>
            </div>
          </>
        )}
      </div>

      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
