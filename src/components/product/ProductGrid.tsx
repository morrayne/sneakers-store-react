import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import Skeleton from "@/components/ui/Skeleton";

interface Props {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
}

export default function ProductGrid({ products, loading = false, skeletonCount = 16 }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {" "}
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-secondary">
            <Skeleton className="aspect-square rounded-none" />
            <div className="flex flex-col gap-2 p-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-5 w-20 pt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {" "}
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
