import { useEffect } from "react";
import { X } from "lucide-react";
import CatalogFilters from "@/components/catalog/CatalogFilters";
import type { FilterOptions } from "@/hooks/useFilterOptions";

interface Props {
  open: boolean;
  onClose: () => void;
  options: FilterOptions;
  selected: {
    brands: string[];
    categories: string[];
    colors: string[];
  };
  onToggle: (key: "brands" | "categories" | "colors", value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export default function CatalogFiltersDrawer({ open, onClose, options, selected, onToggle, onReset, hasActiveFilters }: Props) {
  // блокируем скролл body, когда открыт drawer
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // закрытие по Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* затемнение */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* панель */}
      <div className="absolute left-0 top-0 h-full w-[300px] max-w-[85vw] overflow-y-auto bg-bg p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">Filters</h2>
          <button onClick={onClose} aria-label="Close filters" className="rounded-full p-1.5 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text">
            <X size={18} />
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="mb-6 text-xs text-text-tertiary hover:text-text"
          >
            Reset all filters
          </button>
        )}

        <CatalogFilters options={options} selected={selected} onToggle={onToggle} />
      </div>
    </div>
  );
}
