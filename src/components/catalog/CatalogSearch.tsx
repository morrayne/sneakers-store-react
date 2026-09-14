import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CatalogSearch({ value, onChange }: Props) {
  const [local, setLocal] = useState(value);
  const debounced = useDebounce(local, 300);

  // синхронизируем debounced-значение наверх
  useEffect(() => {
    if (debounced !== value) {
      onChange(debounced);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // синхронизируем внешнее значение вниз (например, при сбросе через URL)
  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <div className="relative">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Поиск по названию, бренду..."
        className="w-full rounded-full border border-border bg-bg-secondary py-2 pl-9 pr-9 text-sm text-text placeholder:text-text-tertiary focus:border-border-strong focus:outline-none"
      />
      {local && (
        <button onClick={() => setLocal("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
