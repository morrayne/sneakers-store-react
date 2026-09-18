import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useHomeProducts, type HomeCategory } from "@/hooks/useHomeProducts";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import ProductFan from "@/components/home/ProductFan";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

const CATEGORIES: { value: HomeCategory; label: string }[] = [
  { value: "sale", label: "On sale" },
  { value: "new", label: "New" },
  { value: "rating", label: "Best rating" },
];

export default function Home() {
  const [category, setCategory] = useState<HomeCategory>("sale");
  const { products, loading } = useHomeProducts(category);
  const filterOptions = useFilterOptions();

  return (
    <div>
      {/* ─── Hero + Fan ─── */}
      <section className="relative overflow-hidden border-b border-border lg:h-[calc(100dvh-96px)]">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />

        <div className="relative flex h-full items-center mx-auto max-w-8xl p-4 sm:p-6 lg:p-8">
          <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8 lg:items-center">
            {/* Левая колонка: текст */}
            <div className="max-w-xl">
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent sm:mb-4">Collection 2026</p>
              <h1 className="text-3xl font-bold leading-tight text-text sm:text-4xl lg:text-5xl">
                Find your
                <br />
                perfect sneakers
              </h1>
              <p className="mt-4 text-sm text-text-secondary sm:mt-6 sm:text-base">
                Over 25 models from worldknown brands.
                <br /> Fast delivery, fair prices, clean purchases.
              </p>
              <Link to="/catalog" className="mt-8 group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover sm:px-6 sm:py-3">
                Browse catalog
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <h1 className="mt-8 text-2xl font-bold leading-tight text-text sm:text-3xl lg:text-4xl">
                Or follow
                <br />
                the brand you know
              </h1>

              {/* ─── Бренды ─── */}
              <div className="mt-8 flex flex-wrap gap-3">
                {filterOptions.brands.map((brand) => (
                  <Link
                    key={brand}
                    to={`/catalog?brands=${brand}`}
                    className="rounded-full border border-border bg-bg-secondary px-4 py-1.5 sm:px-6 sm:py-3 text-sm font-medium capitalize text-text transition-colors hover:border-border-strong hover:bg-bg-tertiary"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>

            {/* Правая колонка: веер + пилюли */}
            <div className="flex flex-col items-center gap-6 sm:gap-8">
              {/* Веер с масштабированием по breakpoints */}
              {loading ? (
                <div className="flex h-[260px] w-full items-center justify-center sm:h-[345px] lg:h-[460px]">
                  <Skeleton className="h-[190px] w-[135px] rounded-2xl sm:h-[255px] sm:w-[180px] lg:h-[340px] lg:w-[240px]" />
                </div>
              ) : (
                <div className="flex w-full overflow-visible">
                  <div className="relative flex items-center justify-center origin-top [width:352px] [height:253px] sm:[width:480px] sm:[height:345px] lg:[width:640px] lg:[height:460px]">
                    <ProductFan products={products} />
                  </div>
                </div>
              )}

              {/* Пилюли категорий */}
              <div className="flex flex-wrap justify-center gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors",
                      category === c.value ? "border-text bg-text text-bg" : "border-border bg-bg-secondary text-text-secondary hover:border-border-strong hover:text-text",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
