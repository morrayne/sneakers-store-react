import { formatPrice } from "@/utils/formatPrice";

interface Props {
  subtotal: number;
  itemCount: number;
}

export default function CartSummary({ subtotal, itemCount }: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-bg-secondary p-6">
      <h2 className="text-lg font-semibold text-text">Итого</h2>

      <div className="space-y-2 border-b border-border pb-4 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Товары ({itemCount})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Доставка</span>
          <span>Бесплатно</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-text">К оплате</span>
        <span className="text-2xl font-semibold text-text">{formatPrice(subtotal)}</span>
      </div>

      <p className="text-xs text-text-tertiary">Оплата не производится — это демо-проект</p>
    </div>
  );
}
