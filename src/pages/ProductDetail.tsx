import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ChevronLeft } from "lucide-react";
import { useProduct } from "@/hooks/useProduct";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/formatPrice";
import { getDiscount } from "@/utils/getDiscount";
import { getSizesForCategory } from "@/utils/getSizesForCategory";
import { getImageUrl } from "@/utils/getImageUrl";
import ProductGallery from "@/components/product/ProductGallery";
import ColorSelector from "@/components/product/ColorSelector";
import SizeSelector from "@/components/product/SizeSelector";
import AddToCartButton from "@/components/product/AddToCartButton";
import FavoriteButton from "@/components/product/FavoriteButton";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : null;

  const { product, loading, error } = useProduct(productId);
  const related = useRelatedProducts(product);
  const addItem = useCartStore((s) => s.addItem);

  const [colorIndex, setColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    setColorIndex(0);
    setSelectedSize(null);
  }, [productId]);

  // ─── Skeleton ───
  if (loading) {
    return (
      <div className="mx-auto max-w-8xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ─── Ошибка ───
  if (error || !product) {
    return (
      <div className="mx-auto max-w-8xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <EmptyState
          title={error ?? "Product not found"}
          description="It may have been removed or the link is incorrect"
          action={
            <Link to="/catalog" className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
              Back to catalog
            </Link>
          }
        />
      </div>
    );
  }

  const discount = getDiscount(product.price, product.old_price);
  const sizes = getSizesForCategory(product.category);
  const activeColor = product.colors[colorIndex] ?? product.colors[0];

  const handleAddToCart = () => {
    if (!selectedSize || !activeColor) return;

    addItem({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: getImageUrl(product.slug, activeColor.slug),
      color: activeColor,
      size: selectedSize,
      quantity: 1,
    });
  };

  return (
    <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Хлебные крошки */}
      <nav className="mb-6 flex items-center gap-2 overflow-hidden text-xs text-text-secondary">
        <Link to="/catalog" className="flex shrink-0 items-center gap-1 hover:text-text">
          <ChevronLeft size={12} />
          Catalog
        </Link>
        <span className="shrink-0">/</span>
        <span className="shrink-0 truncate capitalize">{product.brand}</span>
        <span className="shrink-0">/</span>
        <span className="truncate text-text">{product.name}</span>
      </nav>

      {/* Основная секция */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Галерея */}
        <ProductGallery product={product} activeColorIndex={colorIndex} />

        {/* Информация */}
        <div className="flex flex-col gap-5 sm:gap-6">
          {/* Бренд + рейтинг */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-text-tertiary">{product.brand}</span>
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <Star size={12} className="fill-current" />
              {product.rating}
            </div>
          </div>

          {/* Название */}
          <h1 className="text-xl font-bold text-text sm:text-2xl">{product.name}</h1>

          {/* Цена */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-2xl font-semibold text-text sm:text-3xl">{formatPrice(product.price)}</span>
            {product.old_price && (
              <>
                <span className="text-base text-text-tertiary line-through sm:text-lg">{formatPrice(product.old_price)}</span>
                {discount && <span className="rounded-full bg-error px-2 py-0.5 text-xs font-bold text-white">−{discount}%</span>}
              </>
            )}
          </div>

          {/* Цвета */}
          <ColorSelector
            colors={product.colors}
            activeIndex={colorIndex}
            onChange={(i) => {
              setColorIndex(i);
              setSelectedSize(null);
            }}
          />

          {/* Размеры */}
          <SizeSelector sizes={sizes} value={selectedSize} onChange={setSelectedSize} />

          {/* Кнопка + сердце */}
          <div className="flex gap-3">
            <div className="flex-1">
              <AddToCartButton disabled={!selectedSize} disabledReason="Select a size" onClick={handleAddToCart} />
            </div>
            <FavoriteButton productId={product.id} variant="inline" size={20} />
          </div>

          {/* Метаданные */}
          <div className="mt-2 space-y-1 border-t border-border pt-4 text-xs text-text-tertiary">
            <p>Category: {product.category}</p>
            <p>
              Available: {product.colors.length} {product.colors.length === 1 ? "color" : "colors"}
            </p>
          </div>
        </div>
      </div>

      {/* Похожие */}
      {related.length > 0 && (
        <section className="mt-12 sm:mt-16 lg:mt-20">
          <h2 className="mb-4 text-lg font-bold text-text sm:mb-6 sm:text-xl">You may also like</h2>
          <ProductGrid products={related} skeletonCount={4} />
        </section>
      )}
    </div>
  );
}
