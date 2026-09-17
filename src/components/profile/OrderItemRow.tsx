import type { OrderItem } from "@/types";
import { formatPrice } from "@/utils/formatPrice";

interface Props {
  item: OrderItem & { product_name: string | null };
}

export default function OrderItemRow({ item }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-2 text-sm last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-text">{item.product_name ?? `Product #${item.product_id}`}</p>
        <p className="text-xs text-text-secondary">
          {item.color && `${item.color} · `}
          Size {item.size} · ×{item.quantity}
        </p>
      </div>
      <span className="shrink-0 font-medium text-text">{formatPrice(item.price * item.quantity)}</span>
    </div>
  );
}
