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
  loading: boolean;
}

// категории фиксированы — это enum в БД, не данные
const CATEGORIES = [
  { value: "men", label: "Мужские" },
  { value: "women", label: "Женские" },
  { value: "unisex", label: "Унисекс" },
];

// читаемые названия для цветов
// добавляй сюда новое, если появится новый folder_name в БД
const COLOR_LABELS: Record<string, string> = {
  black: "Чёрный",
  white: "Белый",
  grey: "Серый",
  blue: "Синий",
  red: "Красный",
  green: "Зелёный",
  brown: "Коричневый",
  orange: "Оранжевый",
  pink: "Розовый",
  yellow: "Жёлтый",
};

export function useFilterOptions(): FilterOptions {
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

      // уникальные бренды
      const brandSet = new Set<string>();
      // уникальные цвета по folder_name, первый встреченный hex выигрывает
      const colorMap = new Map<string, string>();

      for (const row of data as { brand: string; colors: any[] }[]) {
        if (row.brand) brandSet.add(row.brand);

        if (Array.isArray(row.colors)) {
          for (const c of row.colors) {
            if (c?.folder_name && !colorMap.has(c.folder_name)) {
              colorMap.set(c.folder_name, c.color ?? "#888888");
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
