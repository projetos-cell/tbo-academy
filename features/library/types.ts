export type ResourceType = "template" | "guia" | "video" | "checklist" | "apresentacao" | "imagem";

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: string;
  fileUrl?: string;
  externalUrl?: string;
  thumbnailUrl?: string;
  downloadsCount: number;
  isFeatured: boolean;
  createdAt: string;
}
