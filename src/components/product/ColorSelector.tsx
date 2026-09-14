import type { ProductColor } from "@/types";
import { cn } from "@/utils/cn";

interface Props {
  colors: ProductColor[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export default function ColorSelector({ colors, activeIndex, onChange }: Props) {
  if (colors.length === 0) return null;

  const active = colors[activeIndex];

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Цвет</h3>
        <span className="text-xs text-text-secondary">{active?.name}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {colors.map((c, i) => (
          <button
            key={c.folder_name}
            onClick={() => onChange(i)}
            title={c.name}
            aria-label={c.name}
            className={cn("h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-bg transition-all", i === activeIndex ? "ring-text" : "ring-transparent hover:ring-border-strong")}
            style={{ backgroundColor: c.color }}
          />
        ))}
      </div>
    </div>
  );
}
