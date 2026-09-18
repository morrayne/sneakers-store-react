import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types";

export type HomeCategory = "sale" | "new" | "rating";

const LIMIT = 4;

export function useHomeProducts(category: HomeCategory): {
  products: Product[];
  loading: boolean;
} {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      let query = supabase.from("products").select("*").limit(LIMIT);

      if (category === "sale") {
        query = query.not("old_price", "is", null).order("rating", { ascending: false });
      } else if (category === "new") {
        query = query.order("created_at", { ascending: false });
      } else {
        query = query.order("rating", { ascending: false });
      }

      const { data, error } = await query;

      if (cancelled) return;

      if (error || !data) setProducts([]);
      else setProducts(data as Product[]);

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [category]);

  return { products, loading };
}
