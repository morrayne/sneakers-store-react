import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import EmptyState from "@/components/ui/EmptyState";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = useCartStore((s) => s.total());
  const count = useCartStore((s) => s.count());
 
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-8xl p-4 sm:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-bold text-text sm:mb-8 sm:text-3xl">Cart</h1>
        <EmptyState
          icon={<ShoppingBag size={48} strokeWidth={1.5} />}
          title="Your cart is empty"
          description="Add something from the catalog"
          action={
            <Link to="/catalog" className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
              Go to catalog
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-8xl p-4 sm:p-6 lg:p-8">
      <header className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text sm:text-3xl">Cart</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {count} {count === 1 ? "item now" : "items now"}
          </p>
        </div>

        <button onClick={clearCart} className="text-xs text-text-tertiary transition-colors hover:text-text">
          Clear cart
        </button>
      </header> 

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
        {/* Список позиций */}
        <div className="h-fit rounded-2xl border border-border bg-bg-secondary px-4 sm:px-6">
          {items.map((item) => (
            <CartItemRow
              key={`${item.productId}-${item.size}-${item.color.slug}`}
              item={item}
              onQuantityChange={(q) => updateQuantity(item.productId, item.size, item.color.slug, q)}
              onRemove={() => removeItem(item.productId, item.size, item.color.slug)}
            />
          ))}
        </div>

        {/* Итог + кнопка */}
        <aside>
          <div className="space-y-4 lg:sticky lg:top-24">
            <CartSummary subtotal={total} itemCount={count} />

            <Link to="/checkout" className="block w-full rounded-full bg-accent py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-hover">
              Checkout
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
