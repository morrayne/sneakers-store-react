import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Order, OrderItem } from "@/types";

export interface OrderWithItems extends Order {
  items: (OrderItem & { product_name: string | null })[];
}

interface UseOrdersResult {
  orders: OrderWithItems[];
  loading: boolean;
  error: string | null;
}

export function useOrders(): UseOrdersResult {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      // 1. Заказы пользователя
      const { data: ordersData, error: ordersError } = await supabase.from("orders").select("*").order("created_at", { ascending: false });

      if (cancelled) return;

      if (ordersError || !ordersData) {
        setError(ordersError?.message ?? "Не удалось загрузить заказы");
        setLoading(false);
        return;
      }

      if (ordersData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // 2. Позиции всех заказов одним запросом
      const orderIds = ordersData.map((o) => o.id);
      const { data: itemsData, error: itemsError } = await supabase.from("order_items").select("*").in("order_id", orderIds);

      if (cancelled) return;

      if (itemsError || !itemsData) {
        setError(itemsError?.message ?? "Не удалось загрузить позиции");
        setLoading(false);
        return;
      }

      // 3. Названия товаров — отдельным запросом
      const productIds = [...new Set(itemsData.map((i) => i.product_id))];
      const { data: productsData } = await supabase.from("products").select("id, name").in("id", productIds);

      if (cancelled) return;

      const productMap = new Map<number, string>();
      for (const p of productsData ?? []) {
        productMap.set(p.id, p.name);
      }

      // 4. Собираем заказы с позициями
      const result: OrderWithItems[] = ordersData.map((order) => ({
        ...(order as Order),
        items: itemsData
          .filter((i) => i.order_id === order.id)
          .map((i) => ({
            ...(i as OrderItem),
            product_name: productMap.get(i.product_id) ?? null,
          })),
      }));

      setOrders(result);
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { orders, loading, error };
}
