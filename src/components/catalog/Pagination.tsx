import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`dots-${i}`} className="px-1 text-text-tertiary sm:px-2">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              "flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-xs font-medium transition-colors sm:h-9 sm:min-w-9 sm:px-3 sm:text-sm",
              p === page ? "border-text bg-text text-bg" : "border-border text-text-secondary hover:border-border-strong",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function buildPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) pages.push("…");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("…");
  pages.push(total);

  return pages;
}
 