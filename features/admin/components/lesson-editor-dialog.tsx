"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoUploader } from "@/features/admin/components/video-uploader";
import { RichTextEditor } from "@/features/admin/components/rich-text-editor";
import { useCreateLesson, useUpdateLesson } from "@/features/admin/hooks/use-admin-lessons";
import type { AdminLesson } from "@/features/admin/types";

interface LessonEditorDialogProps {
  open: boolean;
  onClose: () => void;
  moduleId: string;
  courseId: string;
  lesson?: AdminLesson | null;
}

export function LessonEditorDialog({ open, onClose, moduleId, courseId, lesson }: LessonEditorDialogProps) {
  const isEditing = !!lesson;

  const [title, setTitle] = useState(lesson?.title ?? "");
  const [videoUrl, setVideoUrl] = useState(lesson?.video_url ?? "");
  const [description, setDescription] = useState<unknown>(lesson?.description ?? null);
  const [isFree, setIsFree] = useState(lesson?.is_free ?? false);
  const [videoTab, setVideoTab] = useState<"url" | "upload">("url");

  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const isPending = createLesson.isPending || updateLesson.isPending;

  useEffect(() => {
    setTitle(lesson?.title ?? "");
    setVideoUrl(lesson?.video_url ?? "");
    setDescription(lesson?.description ?? null);
    setIsFree(lesson?.is_free ?? false);
    setVideoTab("url");
  }, [lesson]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      video_url: videoUrl.trim() || null,
      description: description ?? null,
      is_free: isFree,
    };

    if (isEditing && lesson) {
      toast.promise(updateLesson.mutateAsync({ id: lesson.id, courseId, ...payload }), {
        loading: "Salvando aula...",
        success: "Aula atualizada!",
        error: (err) => err.message,
      });
    } else {
      toast.promise(createLesson.mutateAsync({ module_id: moduleId, courseId, ...payload }), {
        loading: "Criando aula...",
        success: "Aula criada!",
        error: (err) => err.message,
      });
    }

    onClose();
  }

  function handleClose() {
    setTitle(lesson?.title ?? "");
    setVideoUrl(lesson?.video_url ?? "");
    setDescription(lesson?.description ?? null);
    setIsFree(lesson?.is_free ?? false);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Aula" : "Nova Aula"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados desta aula."
              : "Preencha os dados básicos. Você pode adicionar vídeo depois."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="lesson-title">Título</Label>
            <Input
              id="lesson-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Introdução ao módulo"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <RichTextEditor
              key={lesson?.id ?? "new"}
              value={description}
              onChange={setDescription}
              placeholder="Descreva o conteúdo desta aula..."
            />
          </div>

          {/* Video */}
          <div className="space-y-1.5">
            <Label>Vídeo</Label>
            <Tabs value={videoTab} onValueChange={(v) => setVideoTab(v as "url" | "upload")}>
              <TabsList className="h-8 text-xs">
                <TabsTrigger value="url" className="text-xs">
                  URL
                </TabsTrigger>
                <TabsTrigger value="upload" className="text-xs">
                  Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="mt-2">
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://vimeo.com/... ou YouTube..."
                  type="url"
                />
                <p className="text-muted-foreground mt-1 text-xs">Cole o link do Vimeo, YouTube ou URL direta.</p>
              </TabsContent>

              <TabsContent value="upload" className="mt-2">
                <VideoUploader
                  value={videoUrl || null}
                  onChange={(url) => setVideoUrl(url)}
                  onClear={() => setVideoUrl("")}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Free toggle */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Aula gratuita</p>
              <p className="text-muted-foreground text-xs">Alunos sem matrícula podem assistir esta aula.</p>
            </div>
            <Switch checked={isFree} onCheckedChange={setIsFree} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim() || isPending}>
              {isPending && <IconLoader2 className="mr-1.5 size-3.5 animate-spin" />}
              {isEditing ? "Salvar" : "Criar Aula"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
