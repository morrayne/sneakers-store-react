import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface ColorOption {
  value: string;
  hex: string;
  label: string;
}

export interface FilterOptions {
  brands: string[];
  colors: ColorOption[];
  categories: { value: string; label: string }[];
}

export interface UseFilterOptionsResult extends FilterOptions {
  loading: boolean;
}

const CATEGORIES = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
];

const COLOR_LABELS: Record<string, string> = {
  black: "black",
  white: "white",
  grey: "grey",
  blue: "blue",
  red: "red",
  green: "green",
  brown: "brown",
  orange: "orange",
  pink: "pink",
  yellow: "yellow",
};

export function useFilterOptions(): UseFilterOptionsResult {
  const [brands, setBrands] = useState<string[]>([]);
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("brand, colors");

      if (error || !data) {
        setLoading(false);
        return;
      }

      const brandSet = new Set<string>();
      const colorMap = new Map<string, string>();

      for (const row of data as { brand: string; colors: any[] }[]) {
        if (row.brand) brandSet.add(row.brand);

        if (Array.isArray(row.colors)) {
          for (const c of row.colors) {
            if (c?.base_color && !colorMap.has(c.base_color)) {
              colorMap.set(c.base_color, c.color ?? "#888888");
            }
          }
        }
      }

      setBrands([...brandSet].sort());
      setColors(
        [...colorMap.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([value, hex]) => ({
            value, 
            hex,
            label: COLOR_LABELS[value] ?? value,
          })),
      );
      setLoading(false);
    }

    load();
  }, []);

  return {
    brands,
    colors,
    categories: CATEGORIES,
    loading,
  };
}
