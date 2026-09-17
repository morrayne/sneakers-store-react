import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types";

const LIMIT = 4;

export function useNewArrivals(): { products: Product[]; loading: boolean } {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false }).limit(LIMIT);

      if (cancelled) return;

      if (error || !data) setProducts([]);
      else setProducts(data as Product[]);

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading };
}
