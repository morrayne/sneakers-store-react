import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import type { CartItem } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";

interface Props {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartItemRow({ item, onQuantityChange, onRemove }: Props) {
  return (
    <div className="flex gap-4 border-b border-border py-6 last:border-b-0">
      {/* Картинка / заглушка */}
      <Link to={`/product/${item.productId}`} className="block h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border">
        {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <ProductPlaceholder colors={[item.color]} name={item.name} className="h-full w-full" />}
      </Link>

      {/* Информация */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-text-tertiary">{item.brand}</p>
            <Link to={`/product/${item.productId}`} className="mt-0.5 block truncate text-sm font-medium text-text hover:underline">
              {item.name}
            </Link>
            <p className="mt-1 text-xs text-text-secondary">
              {item.color.name} · Размер {item.size}
            </p>
          </div>

          <button onClick={onRemove} aria-label="Удалить" className="shrink-0 rounded-full p-1.5 text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text">
            <X size={16} />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          {/* Количество */}
          <div className="flex items-center rounded-full border border-border">
            <button onClick={() => onQuantityChange(item.quantity - 1)} aria-label="Уменьшить" className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:text-text">
              <Minus size={14} />
            </button>
            <span className="min-w-8 text-center text-sm font-medium text-text">{item.quantity}</span>
            <button onClick={() => onQuantityChange(item.quantity + 1)} aria-label="Увеличить" className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:text-text">
              <Plus size={14} />
            </button>
          </div>

          {/* Цена */}
          <span className="text-base font-semibold text-text">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>
    </div>
  );
}
