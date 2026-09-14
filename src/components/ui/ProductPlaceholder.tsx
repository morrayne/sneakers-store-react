import type { ProductColor } from "@/types";

interface Props {
  colors: ProductColor[];
  name: string;
  className?: string;
}

export default function ProductPlaceholder({ colors, name, className }: Props) {
  const primary = colors[0];

  return (
    <div
      className={"flex items-center justify-center overflow-hidden bg-bg-tertiary " + (className ?? "")}
      style={
        primary
          ? {
              background: `linear-gradient(135deg, ${primary.color}33 0%, ${primary.color}11 100%)`,
            }
          : undefined
      }
    >
      <span className="px-4 text-center text-xs font-medium text-text-tertiary">{name}</span>
    </div>
  );
}
