import type { OrderWithItems } from "@/hooks/useOrders";
import { formatPrice } from "@/utils/formatPrice";
import { cn } from "@/utils/cn";
import OrderItemRow from "./OrderItemRow";

interface Props {
  order: OrderWithItems;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: {
    label: "В обработке",
    className: "bg-warning/15 text-warning",
  },
  processing: {
    label: "Собирается",
    className: "bg-accent/15 text-accent",
  },
  done: {
    label: "Доставлен",
    className: "bg-success/15 text-success",
  },
};

const DELIVERY_MIN_DAYS = 3;
const DELIVERY_MAX_DAYS = 7;

export default function OrderCard({ order }: Props) {
  const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;

  const createdAt = new Date(order.created_at);
  const deliveryDate = new Date(createdAt);
  // псевдо-случайное число от 3 до 7 на основе id, чтобы дата не прыгала при перерендере
  const deliveryDays = DELIVERY_MIN_DAYS + (order.id % (DELIVERY_MAX_DAYS - DELIVERY_MIN_DAYS + 1));
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

  const dateFormat = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-border bg-bg-secondary p-6">
      {/* Шапка */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-tertiary">Заказ №{order.id}</p>
          <p className="mt-1 text-sm text-text-secondary">{dateFormat.format(createdAt)}</p>
        </div>

        <span className={cn("rounded-full px-3 py-1 text-xs font-medium", status.className)}>{status.label}</span>
      </div>

      {/* Позиции */}
      <div className="py-4">
        {order.items.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </div>

      {/* Итог */}
      <div className="flex items-baseline justify-between border-t border-border pt-4">
        <div className="text-xs text-text-tertiary">{order.status === "done" ? <span>Доставлено</span> : <span>Ожидаемая доставка: {dateFormat.format(deliveryDate)}</span>}</div>
        <span className="text-lg font-semibold text-text">{formatPrice(order.total)}</span>
      </div>
    </div>
  );
}
