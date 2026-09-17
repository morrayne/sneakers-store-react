import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/formatPrice";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";

export default function CheckoutSummary() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const count = useCartStore((s) => s.count());

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-bg-secondary p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-text">Your order</h2>

      <ul className="max-h-80 space-y-3 overflow-y-auto">
        {items.map((item) => (
          <li key={`${item.productId}-${item.size}-${item.color.slug}`} className="flex gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border">
              {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <ProductPlaceholder colors={[item.color]} name={item.name} className="h-full w-full text-[8px]" />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">{item.name}</p>
              <p className="text-xs text-text-secondary">
                {item.color.name} · {item.size} · ×{item.quantity}
              </p>
            </div>

            <span className="shrink-0 text-sm font-medium text-text">{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Items ({count})</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between border-t border-border pt-4">
        <span className="text-sm font-medium text-text">Total</span>
        <span className="text-xl font-semibold text-text">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
