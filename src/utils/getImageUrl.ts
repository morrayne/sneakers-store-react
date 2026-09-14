const SUPABASE_STORAGE_BUCKET = "sneakers"; // название бакета сюда подставить

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) return null;

  // Публичный бакет — прямой URL
  return `${supabaseUrl}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${path}`;
}
