import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types";

export const PAGE_SIZE = 16;

export type SortOption = "newest" | "name-asc" | "name-desc" | "price-asc" | "price-desc" | "rating-desc";

export interface ProductFilters {
  q?: string;
  brands?: string[];
  categories?: string[];
  colors?: string[];
  sort?: SortOption;
  page?: number;
}

interface UseProductListResult {
  products: Product[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export function useProductList(filters: ProductFilters): UseProductListResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { q, brands, categories, colors, sort = "newest", page = 1 } = filters;

  // сериализуем массивы в строку, чтобы использовать в deps useCallback
  const brandsKey = brands?.join(",") ?? "";
  const categoriesKey = categories?.join(",") ?? "";
  const colorsKey = colors?.join(",") ?? "";

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from("products").select("*", { count: "exact" });

      // ─── Поиск по триграммам ───
      if (q && q.trim().length > 0) {
        const term = q.trim();
        query = query.or(`name.ilike.%${term}%,brand.ilike.%${term}%,category.ilike.%${term}%`);
      }

      // ─── Фильтр по брендам (мультивыбор) ───
      if (brandsKey) {
        query = query.in("brand", brandsKey.split(","));
      }

      // ─── Фильтр по полу (мультивыбор) ───
      if (categoriesKey) {
        query = query.in("category", categoriesKey.split(","));
      }

      // ─── Фильтр по цветам (мультивыбор через jsonb) ───
      if (colorsKey) {
        const colorList = colorsKey.split(",");
        const orExpr = colorList.map((c) => `colors.cs.${JSON.stringify([{ base_color: c }])}`).join(",");
        query = query.or(orExpr);
      }

      // ─── Сортировка ───
      switch (sort) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "name-asc":
          query = query.order("name", { ascending: true });
          break;
        case "name-desc":
          query = query.order("name", { ascending: false });
          break;
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "rating-desc":
          query = query.order("rating", { ascending: false });
          break;
      }

      // ─── Пагинация ───
      const from = (page - 1) * PAGE_SIZE;
      const to = page * PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, error: supaError, count } = await query;

      if (supaError) throw supaError;

      setProducts((data as Product[]) ?? []);
      setTotal(count ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить товары");
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [q, brandsKey, categoriesKey, colorsKey, sort, page]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return { products, total, totalPages, loading, error };
}
