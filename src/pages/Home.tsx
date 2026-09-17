import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import { useNewArrivals } from "@/hooks/useNewArrivals";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import ProductGrid from "@/components/product/ProductGrid";

export default function Home() {
  const featured = useFeaturedProducts();
  const newArrivals = useNewArrivals();
  const filterOptions = useFilterOptions();

  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-8xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent sm:mb-4">Collection 2026</p>
            <h1 className="text-3xl font-bold leading-tight text-text sm:text-4xl lg:text-6xl">
              Find your
              <br />
              perfect sneakers
            </h1>
            <p className="mt-4 max-w-lg text-sm text-text-secondary sm:mt-6 sm:text-base lg:text-lg">Over 25 models from Nike, Adidas, New Balance and more. Fast delivery, fair prices.</p>
            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
              <Link to="/catalog" className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover sm:px-6 sm:py-3">
                Browse catalog
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/catalog?sort=rating-desc" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:border-border-strong sm:px-6 sm:py-3">
                Top rated
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Хиты продаж ─── */}
      <Section title="Хиты продаж" subtitle="Самое популярное у наших покупателей" linkTo="/catalog?sort=rating-desc" linkLabel="Все хиты">
        <ProductGrid products={featured.products} loading={featured.loading} skeletonCount={4} />
      </Section>

      {/* ─── Новинки ─── */}
      <Section title="Новинки" subtitle="Только что появились в магазине" linkTo="/catalog?sort=newest" linkLabel="Все новинки">
        <ProductGrid products={newArrivals.products} loading={newArrivals.loading} skeletonCount={4} />
      </Section>

      {/* ─── Бренды ─── */}
      <Section title="Бренды" subtitle="Выбери любимый">
        <div className="flex flex-wrap gap-3">
          {filterOptions.brands.map((brand) => (
            <Link key={brand} to={`/catalog?brands=${brand}`} className="rounded-full border border-border bg-bg-secondary px-5 py-2.5 text-sm font-medium capitalize text-text transition-colors hover:border-border-strong hover:bg-bg-tertiary">
              {brand}
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── Вспомогательный компонент секции ───

interface SectionProps {
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkLabel?: string;
  children: React.ReactNode;
}

function Section({ title, subtitle, linkTo, linkLabel, children }: SectionProps) {
  return (
    <section className="border-b border-border last:border-b-0">
      <div className="mx-auto max-w-8xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8 sm:gap-4">
          <div>
            <h2 className="text-xl font-bold text-text sm:text-2xl lg:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
          </div>
          {linkTo && linkLabel && (
            <Link to={linkTo} className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover">
              {linkLabel}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
