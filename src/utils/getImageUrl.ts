const BUCKET = "sneakers";

export function getImageUrl(productSlug: string | null | undefined, colorSlug: string | null | undefined): string | null {
  if (!productSlug || !colorSlug) return null;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) return null;

  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${productSlug}/${colorSlug}.jpg`;
}
