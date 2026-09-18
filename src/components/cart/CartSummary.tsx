import { formatPrice } from "@/utils/formatPrice";

interface Props {
  subtotal: number;
  itemCount: number;
}

export default function CartSummary({ subtotal, itemCount }: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-bg-secondary p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-text">Summary</h2>

      <div className="space-y-2 border-b border-border pb-4 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Items ({itemCount})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Shipping</span> 
          <span>Free</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-text">Total</span>
        <span className="text-2xl font-semibold text-text">{formatPrice(subtotal)}</span>
      </div>

      <p className="text-xs text-text-tertiary">No real payment — this is a demo project</p>
    </div>
  );
}
