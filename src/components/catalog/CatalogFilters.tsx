import type { FilterOptions } from "@/hooks/useFilterOptions";
import { cn } from "@/utils/cn";

interface Props {
  options: FilterOptions;
  selected: {
    brands: string[];
    categories: string[];
    colors: string[];
  };
  onToggle: (key: "brands" | "categories" | "colors", value: string) => void;
}
 
export default function CatalogFilters({ options, selected, onToggle }: Props) {
  return (
    <div className="space-y-6">
      {/* Пол */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Gender</h3>
        <div className="flex flex-wrap gap-2">
          {options.categories.map((c) => {
            const active = selected.categories.includes(c.value);
            return (
              <button
                key={c.value}
                onClick={() => onToggle("categories", c.value)}
                className={cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors", active ? "border-text bg-text text-bg" : "border-border bg-bg-secondary text-text-secondary hover:border-border-strong")}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Бренд */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Brand</h3>
        <div className="flex flex-wrap gap-2">
          {options.brands.map((b) => {
            const active = selected.brands.includes(b);
            return (
              <button
                key={b}
                onClick={() => onToggle("brands", b)}
                className={cn("rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors", active ? "border-text bg-text text-bg" : "border-border bg-bg-secondary text-text-secondary hover:border-border-strong")}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* Цвет */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Primary color</h3>
        <div className="flex flex-wrap gap-2">
          {options.colors.map((c) => {
            const active = selected.colors.includes(c.value);
            return (
              <button
                key={c.value}
                onClick={() => onToggle("colors", c.value)}
                title={c.label}
                className={cn("h-7 w-7 rounded-full ring-2 ring-offset-2 ring-offset-bg transition-all", active ? "ring-text" : "ring-transparent hover:ring-border-strong")}
                style={{ backgroundColor: c.hex }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
