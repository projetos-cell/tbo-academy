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
      <div className="bg-paper-off flex items-center gap-3 rounded-2xl border border-black/[0.06] p-3">
        <IconVideo className="text-forest-500 size-5 shrink-0" />
        <span className="flex-1 truncate text-xs text-[var(--tbo-gray-600)]">{value}</span>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="hover:text-destructive shrink-0 text-[var(--tbo-gray-500)] transition-colors"
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
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-colors",
          isDragActive ? "border-volt bg-volt/10" : "hover:border-forest-500/50 hover:bg-paper-off border-black/10",
          uploading && "cursor-not-allowed opacity-60",
        )}
      >
        <input {...getInputProps()} />
        <IconUpload className="size-7 text-[var(--tbo-gray-500)]" />
        <div>
          <p className="text-sm font-semibold">
            {isDragActive ? "Solte o vídeo aqui" : "Arraste um vídeo ou clique para selecionar"}
          </p>
          <p className="mt-0.5 text-xs text-[var(--tbo-gray-500)]">MP4, MOV, WebM</p>
        </div>
      </div>

      {uploading && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-[var(--tbo-gray-500)]">
            <span>Enviando...</span>
            <span className="font-display font-semibold tracking-tight">{progress}%</span>
          </div>
          <div className="pbar">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
