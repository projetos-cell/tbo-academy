import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/types"

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
const MAX_AVATAR_SIZE = 5 * 1024 * 1024 // 5 MB

export async function uploadAvatar(
  supabase: SupabaseClient<Database>,
  userId: string,
  file: File,
): Promise<string> {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    throw new Error("Formato não suportado. Use JPG, PNG, GIF ou WebP.")
  }

  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error("Arquivo muito grande. Máximo 5 MB.")
  }

  const ext = file.name.split(".").pop() ?? "png"
  const path = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from("avatars").getPublicUrl(path)
  return `${data.publicUrl}?t=${Date.now()}`
}
