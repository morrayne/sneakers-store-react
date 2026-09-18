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
    <div className="mx-auto max-w-8xl p-4 sm:p-6 lg:p-8">
      {justOrderedId && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-4 sm:mb-8">
          <CheckCircle size={20} className="mt-0.5 shrink-0 text-success" />
          <div>
            <p className="text-sm font-medium text-text">Order #{justOrderedId} placed</p>
            <p className="mt-0.5 text-xs text-text-secondary">We'll contact you to confirm</p>
          </div>
        </div>
      )}

      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-12">
        <div>
          <h1 className="text-2xl font-bold text-text sm:text-3xl">Profile</h1>
          <p className="mt-1 text-sm text-text-secondary">{user?.email}</p>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-text transition-colors hover:border-border-strong">
          <LogOut size={14} />
          Sign out
        </button>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-bold text-text sm:mb-6 sm:text-xl">Order history</h2>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        ) : error ? (
          <EmptyState title="Failed to load orders" description={error} />
        ) : orders.length === 0 ? (
          <EmptyState icon={<PackageOpen size={48} strokeWidth={1.5} />} title="No orders yet" description="Place your first order from the catalog" />
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
