import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useFavoritesStore } from "@/store/favoritesStore";
import type { Product } from "@/types";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";

export default function Favorites() {
  const ids = useFavoritesStore((s) => s.ids);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*").in("id", ids);

      if (cancelled) return;

      if (error || !data) {
        setProducts([]);
      } else {
        // сохраняем порядок лайков — новые сверху
        const ordered = ids.map((id) => (data as Product[]).find((p) => p.id === id)).filter((p): p is Product => Boolean(p));
        setProducts(ordered);
      }
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [ids]);

  if (ids.length === 0) {
    return (
    <div className="mx-auto max-w-8xl p-4 sm:p-6 lg:p-8">
        <h1 className="mb-8 text-3xl font-bold text-text">Избранное</h1>
        <EmptyState
          icon={<Heart size={48} strokeWidth={1.5} />}
          title="Пока пусто"
          description="Добавляй товары в избранное, кликая на сердечко"
          action={
            <Link to="/catalog" className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
              В каталог
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-8xl p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text">Избранное</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {ids.length} {ids.length === 1 ? "товар" : ids.length < 5 ? "товара" : "товаров"}
        </p>
      </header>

      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
