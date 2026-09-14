import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types";

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export function useProduct(id: number | null): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null || Number.isNaN(id)) {
      setProduct(null);
      setLoading(false);
      setError("Некорректный id товара");
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: supaError } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

      if (cancelled) return;

      if (supaError) {
        setError(supaError.message);
        setProduct(null);
      } else if (!data) {
        setError("Товар не найден");
        setProduct(null);
      } else {
        setProduct(data as Product);
      }
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, loading, error };
}
