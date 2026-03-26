"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { IconUpload, IconVideo, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useVideoUpload } from "@/features/admin/hooks/use-video-upload";

interface VideoUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  onClear?: () => void;
}

export function VideoUploader({ value, onChange, onClear }: VideoUploaderProps) {
  const { uploading, progress, error, upload } = useVideoUpload("academy-videos");

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
    accept: { "video/*": [] },
    maxFiles: 1,
    disabled: uploading,
  });

  if (value) {
    return (
      <div className="bg-muted/40 flex items-center gap-3 rounded-lg border p-3">
        <IconVideo className="text-muted-foreground size-5 shrink-0" />
        <span className="text-muted-foreground flex-1 truncate text-xs">{value}</span>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-muted-foreground hover:text-destructive shrink-0 transition-colors"
          >
            <IconX className="size-4" />
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
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40",
          uploading && "cursor-not-allowed opacity-60",
        )}
      >
        <input {...getInputProps()} />
        <IconUpload className="text-muted-foreground size-7" />
        <div>
          <p className="text-sm font-medium">
            {isDragActive ? "Solte o vídeo aqui" : "Arraste um vídeo ou clique para selecionar"}
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs">MP4, MOV, WebM</p>
        </div>
      </div>

      {uploading && (
        <div className="space-y-1">
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
      )}

      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
