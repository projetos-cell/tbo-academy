"use client";

import { useState, useCallback } from "react";

interface UploadState {
  uploading: boolean;
  progress: number;
  url: string | null;
  error: string | null;
}

export function useVideoUpload(bucket = "academy-videos") {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    url: null,
    error: null,
  });

  const upload = useCallback(
    (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        setState({ uploading: true, progress: 0, url: null, error: null });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", bucket);

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setState((prev) => ({ ...prev, progress }));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText) as { url: string };
            setState({ uploading: false, progress: 100, url: data.url, error: null });
            resolve(data.url);
          } else {
            const data = JSON.parse(xhr.responseText) as { error?: string };
            const error = data.error ?? "Erro ao fazer upload";
            setState({ uploading: false, progress: 0, url: null, error });
            reject(new Error(error));
          }
        });

        xhr.addEventListener("error", () => {
          const error = "Erro de rede ao fazer upload";
          setState({ uploading: false, progress: 0, url: null, error });
          reject(new Error(error));
        });

        xhr.open("POST", "/api/admin/upload");
        xhr.send(formData);
      });
    },
    [bucket],
  );

  const reset = useCallback(() => {
    setState({ uploading: false, progress: 0, url: null, error: null });
  }, []);

  return { ...state, upload, reset };
}
