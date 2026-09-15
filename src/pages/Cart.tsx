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

  // ─── пустая корзина ───
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-8xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-text">Корзина</h1>
        <EmptyState
          icon={<ShoppingBag size={48} strokeWidth={1.5} />}
          title="Корзина пуста"
          description="Добавь что-нибудь из каталога"
          action={
            <Link to="/catalog" className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
              В каталог
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-8xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Заголовок */}
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Корзина</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {count} {count === 1 ? "товар" : count < 5 ? "товара" : "товаров"}
          </p>
        </div>

        <button onClick={clearCart} className="text-xs text-text-tertiary transition-colors hover:text-text">
          Очистить корзину
        </button>
      </header>

      {/* Двухколоночный layout */}
      <div className="grid grid-cols-[1fr_360px] gap-8">
        {/* Список позиций */}
        <div className="rounded-2xl border border-border bg-bg-secondary px-6">
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
          <div className="sticky top-24 space-y-4">
            <CartSummary subtotal={total} itemCount={count} />

            <Link to="/checkout" className="block w-full rounded-full bg-accent py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-hover">
              Оформить заказ
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
