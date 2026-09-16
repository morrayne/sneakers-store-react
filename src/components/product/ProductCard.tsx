import { Link } from "react-router-dom";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { getImageUrl } from "@/utils/getImageUrl";
import { getDiscount } from "@/utils/getDiscount";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";
import FavoriteButton from "./FavoriteButton";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const primaryColor = product.colors[0];
  const imageUrl = getImageUrl(product.slug, primaryColor?.slug);
  const discount = getDiscount(product.price, product.old_price);

  return (
    <Link to={`/product/${product.id}`} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-secondary transition-colors hover:border-border-strong">
      {/* Картинка / заглушка */}
      <div className="relative aspect-square overflow-hidden bg-bg-tertiary">
        {discount && <span className="absolute left-3 top-3 z-10 rounded-full bg-error px-2 py-0.5 text-[10px] font-bold text-white">−{discount}%</span>}

        <FavoriteButton productId={product.id} />

        {imageUrl ? (
          <img src={imageUrl} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <ProductPlaceholder colors={product.colors} name={product.name} className="h-full w-full" />
        )}
      </div>

      {/* Информация */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-wide text-text-tertiary">{product.brand}</p>
        <h3 className="line-clamp-2 text-sm font-medium text-text">{product.name}</h3>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-text">{formatPrice(product.price)}</span>
            {product.old_price && <span className="text-xs text-text-tertiary line-through">{formatPrice(product.old_price)}</span>}
          </div>

          {/* Цвета — кружки */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((c) => (
                <span key={c.slug} className="h-3 w-3 rounded-full ring-1 ring-border" style={{ backgroundColor: c.color }} title={c.name} />
              ))}
              {product.colors.length > 3 && <span className="text-[10px] text-text-tertiary">+{product.colors.length - 3}</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
