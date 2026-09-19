import type { Product } from "@/types";
import { getImageUrl } from "@/utils/getImageUrl";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";

interface Props {
  product: Product;
  activeColorIndex: number;
}

export default function ProductGallery({ product, activeColorIndex }: Props) {
  const activeColor = product.colors[activeColorIndex] ?? product.colors[0];
  const imageUrl = getImageUrl(product.slug, activeColor?.slug);

  if (!imageUrl) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-2xl border border-border">
        <ProductPlaceholder colors={activeColor ? [activeColor] : []} name={product.name} className="h-full w-full" />
      </div> 
    );
  }

  return (
    <div className="aspect-square w-full overflow-hidden rounded-2xl border border-border bg-bg-tertiary">
      <img src={imageUrl} alt={`${product.name} — ${activeColor?.name ?? ""}`} className="h-full w-full object-cover" />
    </div> 
  );
}
