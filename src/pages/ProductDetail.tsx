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

  // при смене товара сбрасываем выбор
  useEffect(() => {
    setColorIndex(0);
    setSelectedSize(null);
  }, [productId]);

  // ─── состояния загрузки / ошибки ───
  if (loading) {
    return (
      <div className="mx-auto max-w-8xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-12">
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

  if (error || !product) {
    return (
      <div className="mx-auto max-w-8xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title={error ?? "Товар не найден"}
          description="Возможно, он был удалён или ссылка неверна"
          action={
            <Link to="/catalog" className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
              В каталог
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
      image: getImageUrl(product.images?.[0]),
      color: activeColor,
      size: selectedSize,
      quantity: 1,
    });
  };

  return (
    <div className="mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Хлебные крошки */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-text-secondary">
        <Link to="/catalog" className="flex items-center gap-1 hover:text-text">
          <ChevronLeft size={12} />
          Каталог
        </Link>
        <span>/</span>
        <span className="text-text-tertiary">{product.brand}</span>
        <span>/</span>
        <span className="text-text">{product.name}</span>
      </nav>

      {/* Двухколоночный layout */}
      <div className="grid grid-cols-2 gap-12">
        {/* Галерея */}
        <ProductGallery product={product} activeColorIndex={colorIndex} />

        {/* Информация */}
        <div className="flex flex-col gap-6">
          {/* Бренд + рейтинг */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-text-tertiary">{product.brand}</span>
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <Star size={12} className="fill-current" />
              {product.rating}
            </div>
          </div>

          {/* Название */}
          <h1 className="text-2xl font-bold text-text">{product.name}</h1>

          {/* Цена */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-text">{formatPrice(product.price)}</span>
            {product.old_price && (
              <>
                <span className="text-lg text-text-tertiary line-through">{formatPrice(product.old_price)}</span>
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

          {/* Кнопка */}
          <AddToCartButton disabled={!selectedSize} disabledReason="Выберите размер" onClick={handleAddToCart} />

          {/* Метаданные */}
          <div className="mt-2 space-y-1 border-t border-border pt-4 text-xs text-text-tertiary">
            <p>Категория: {product.category}</p>
            <p>
              В наличии: {product.colors.length} {product.colors.length === 1 ? "цвет" : "цвета"}
            </p>
          </div>
        </div>
      </div>

      {/* Похожие */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-xl font-bold text-text">Похожие товары</h2>
          <ProductGrid products={related} skeletonCount={4} />
        </section>
      )}
    </div>
  );
}
