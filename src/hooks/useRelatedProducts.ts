import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types";

const RELATED_LIMIT = 4;

export function useRelatedProducts(currentProduct: Product | null): Product[] {
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    if (!currentProduct) {
      setRelated([]);
      return;
    }

    let cancelled = false;

    async function load() {
      const { data, error } = await supabase.from("products").select("*").neq("id", currentProduct!.id).or(`brand.eq.${currentProduct!.brand},category.eq.${currentProduct!.category}`).order("rating", { ascending: false }).limit(RELATED_LIMIT);

      if (cancelled) return;

      if (error || !data) {
        setRelated([]);
      } else {
        setRelated(data as Product[]);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [currentProduct]);

  return related;
}
