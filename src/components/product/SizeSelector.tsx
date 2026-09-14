import { cn } from "@/utils/cn";

interface Props {
  sizes: number[];
  value: string | null;
  onChange: (size: string) => void;
}

export default function SizeSelector({ sizes, value, onChange }: Props) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Размер (EU)</h3>
        {value && <span className="text-xs text-text-secondary">{value}</span>}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => {
          const sizeStr = String(size);
          const active = value === sizeStr;
          return (
            <button
              key={size}
              onClick={() => onChange(sizeStr)}
              className={cn("rounded-lg border py-2 text-sm font-medium transition-colors", active ? "border-text bg-text text-bg" : "border-border bg-bg-secondary text-text-secondary hover:border-border-strong")}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
