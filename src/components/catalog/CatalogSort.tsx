import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import type { SortOption } from "@/hooks/useProducts";

interface Props {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const options: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Сначала новые" },
  { value: "name-asc", label: "Название А–Я" },
  { value: "name-desc", label: "Название Я–А" },
  { value: "price-asc", label: "Цена ↑" },
  { value: "price-desc", label: "Цена ↓" },
  { value: "rating-desc", label: "По рейтингу" },
];

export default function CatalogSort({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-4 py-2 text-sm text-text transition-colors hover:border-border-strong">
        {current?.label ?? "Сортировка"}
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-lg border border-border bg-bg-secondary shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn("flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-bg-tertiary", value === opt.value ? "text-text" : "text-text-secondary")}
            >
              {opt.label}
              {value === opt.value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
