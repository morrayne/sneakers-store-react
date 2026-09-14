import { useState } from "react";
import type { Product } from "@/types";
import { getImageUrl } from "@/utils/getImageUrl";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";
import { cn } from "@/utils/cn";

interface Props {
  product: Product;
  activeColorIndex: number;
}

export default function ProductGallery({ product, activeColorIndex }: Props) {
  // пока картинок нет — заглушки по цветам
  // когда images появятся, переделаем на реальные фото + превью
  const hasImages = product.images && product.images.length > 0;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!hasImages) {
    const color = product.colors[activeColorIndex] ?? product.colors[0];
    return (
      <div className="aspect-square w-full overflow-hidden rounded-2xl border border-border">
        <ProductPlaceholder colors={color ? [color] : []} name={product.name} className="h-full w-full" />
      </div>
    );
  }

  const images = product.images!;
  const activeUrl = getImageUrl(images[activeImageIndex]);

  return (
    <div className="flex flex-col gap-4">
      {/* Главная картинка */}
      <div className="aspect-square w-full overflow-hidden rounded-2xl border border-border bg-bg-tertiary">{activeUrl && <img src={activeUrl} alt={product.name} className="h-full w-full object-cover" />}</div>

      {/* Превью */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => {
            const url = getImageUrl(img);
            return (
              <button key={img} onClick={() => setActiveImageIndex(i)} className={cn("aspect-square w-20 overflow-hidden rounded-lg border transition-colors", i === activeImageIndex ? "border-text" : "border-border hover:border-border-strong")}>
                {url && <img src={url} alt="" className="h-full w-full object-cover" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
