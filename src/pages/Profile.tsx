import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, PackageOpen, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { supabase } from "@/lib/supabase";
import OrderCard from "@/components/profile/OrderCard";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

export default function Profile() {
  const { user } = useAuth();
  const { orders, loading, error } = useOrders();
  const navigate = useNavigate();
  const location = useLocation();

  const justOrderedId = (location.state as { orderId?: number } | null)?.orderId;

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="mx-auto max-w-8xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Уведомление об успешном заказе */}
      {justOrderedId && (
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-4">
          <CheckCircle size={20} className="mt-0.5 shrink-0 text-success" />
          <div>
            <p className="text-sm font-medium text-text">Заказ №{justOrderedId} оформлен</p>
            <p className="mt-0.5 text-xs text-text-secondary">Мы свяжемся с вами для подтверждения</p>
          </div>
        </div>
      )}

      {/* Шапка профиля */}
      <header className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Профиль</h1>
          <p className="mt-1 text-sm text-text-secondary">{user?.email}</p>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-text transition-colors hover:border-border-strong">
          <LogOut size={14} />
          Выйти
        </button>
      </header>

      {/* История заказов */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-text">История заказов</h2>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        ) : error ? (
          <EmptyState title="Не удалось загрузить заказы" description={error} />
        ) : orders.length === 0 ? (
          <EmptyState icon={<PackageOpen size={48} strokeWidth={1.5} />} title="Заказов пока нет" description="Оформи первый заказ в каталоге" />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
