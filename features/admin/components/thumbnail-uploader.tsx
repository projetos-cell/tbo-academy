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
      <div className="bg-muted relative aspect-video overflow-hidden rounded-2xl border border-black/[0.06]">
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
          "flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-center transition-colors",
          isDragActive ? "border-volt bg-volt/10" : "hover:border-forest-500/50 hover:bg-paper-off border-black/[0.12]",
          uploading && "cursor-not-allowed opacity-60",
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="w-full space-y-2 px-4">
            <div className="flex justify-between text-xs text-[var(--tbo-gray-500)]">
              <span>Enviando...</span>
              <span className="font-display font-bold tracking-tight">{progress}%</span>
            </div>
            <div className="pbar">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <>
            <span
              className={cn(
                "grid size-11 place-items-center rounded-full",
                isDragActive ? "bg-volt text-ink" : "bg-forest-900 text-volt",
              )}
            >
              {isDragActive ? (
                <IconPhoto className="size-5" strokeWidth={1.5} />
              ) : (
                <IconUpload className="size-5" strokeWidth={1.5} />
              )}
            </span>
            <div>
              <p className="text-sm font-medium">
                {isDragActive ? "Solte a imagem aqui" : "Arraste uma imagem ou clique"}
              </p>
              <p className="mt-0.5 text-xs text-[var(--tbo-gray-500)]">JPG, PNG, WebP</p>
            </div>
          </>
        )}
      </div>

      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
