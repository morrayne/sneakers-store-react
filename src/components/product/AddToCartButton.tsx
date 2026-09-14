import { useEffect, useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { cn } from "@/utils/cn";

interface Props {
  disabled: boolean;
  disabledReason?: string;
  onClick: () => void;
}

export default function AddToCartButton({ disabled, disabledReason, onClick }: Props) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [added]);

  const handleClick = () => {
    onClick();
    setAdded(true);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      title={disabled ? disabledReason : undefined}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-colors",
        disabled ? "cursor-not-allowed bg-bg-tertiary text-text-tertiary" : added ? "bg-success text-white" : "bg-accent text-white hover:bg-accent-hover",
      )}
    >
      {added ? (
        <>
          <Check size={16} />
          Добавлено
        </>
      ) : (
        <>
          <ShoppingBag size={16} />В корзину
        </>
      )}
    </button>
  );
}
