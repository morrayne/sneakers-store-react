import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cartStore";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

interface FormState {
  name: string;
  phone: string;
  address: string;
}

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const clearCart = useCartStore((s) => s.clearCart);

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (items.length === 0 && !submitting) {
    return <Navigate to="/cart" replace />;
  }

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Enter your name";
    if (!form.phone.trim()) next.phone = "Enter your phone";
    if (!form.address.trim()) next.address = "Enter your address";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!validate() || !user) return;

    setSubmitting(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total,
          status: "pending",
        })
        .select()
        .single();

      if (orderError || !order) throw orderError ?? new Error("Failed to create order");

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        size: item.size,
        color: item.color.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      navigate("/profile", {
        replace: true,
        state: { orderId: order.id },
      });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Failed to place order");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-8xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-bold text-text sm:mb-8 sm:text-3xl">Checkout</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px] lg:gap-8">
        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-border bg-bg-secondary p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-text">Shipping</h2>

            <div className="space-y-4">
              <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} placeholder="John Doe" autoComplete="name" />

              <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} error={errors.phone} placeholder="+1 555 000-00-00" type="tel" autoComplete="tel" />

              <Field label="Delivery address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} error={errors.address} placeholder="City, street, building, apartment" autoComplete="street-address" />
            </div>

            <p className="mt-4 text-xs text-text-tertiary">Delivery takes 3–7 days. No real payment — this is a demo project.</p>
          </div>

          {serverError && <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{serverError}</div>}

          <button type="submit" disabled={submitting} className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </form>

        {/* Сводка */}
        <aside>
          <div className="lg:sticky lg:top-24">
            <CheckoutSummary />
          </div>
        </aside>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}

function Field({ label, value, onChange, error, placeholder, type = "text", autoComplete }: FieldProps) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-secondary">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={"w-full rounded-lg border bg-bg px-4 py-2.5 text-sm text-text placeholder:text-text-tertiary focus:outline-none " + (error ? "border-error focus:border-error" : "border-border focus:border-border-strong")}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
