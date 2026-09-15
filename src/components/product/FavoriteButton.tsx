import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/favoritesStore";
import { cn } from "@/utils/cn";

interface Props {
  productId: number;
  size?: number;
  variant?: "overlay" | "inline";
}

export default function FavoriteButton({ productId, size = 18, variant = "overlay" }: Props) {
  const ids = useFavoritesStore((s) => s.ids);
  const toggle = useFavoritesStore((s) => s.toggle);

  const active = ids.includes(productId);

  const handleClick = (e: React.MouseEvent) => {
    // не даём клику уйти в <Link> родителя
    e.preventDefault();
    e.stopPropagation();
    toggle(productId);
  };

  if (variant === "inline") {
    return (
      <button
        onClick={handleClick}
        aria-label={active ? "Убрать из избранного" : "В избранное"}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-secondary text-text transition-colors hover:border-border-strong"
      >
        <Heart size={size} className={cn("transition-colors", active ? "fill-error text-error" : "text-text-secondary")} />
      </button>
    );
  }

  // variant === 'overlay' — на картинке
  return (
    <button
      onClick={handleClick}
      aria-label={active ? "Убрать из избранного" : "В избранное"}
      className={cn("absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:scale-110", "dark:bg-black/60")}
    >
      <Heart size={size} className={cn("transition-colors", active ? "fill-error text-error" : "text-zinc-500")} />
    </button>
  );
}
