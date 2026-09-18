import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { useProductList, PAGE_SIZE, type SortOption } from "@/hooks/useProductList";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/catalog/Pagination";
import CatalogSearch from "@/components/catalog/CatalogSearch";
import CatalogSort from "@/components/catalog/CatalogSort";
import CatalogFilters from "@/components/catalog/CatalogFilters";
import CatalogFiltersDrawer from "@/components/catalog/CatalogFiltersDrawer";

const SORT_OPTIONS: SortOption[] = ["newest", "name-asc", "name-desc", "price-asc", "price-desc", "rating-desc"];

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const q = params.get("q") ?? "";
  const brands = parseList(params.get("brands"));
  const categories = parseList(params.get("categories"));
  const colors = parseList(params.get("colors"));
  const sortParam = params.get("sort") as SortOption | null;
  const sort: SortOption = sortParam && SORT_OPTIONS.includes(sortParam) ? sortParam : "newest";
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);

  const { products, loading, error, total, totalPages } = useProductList({
    q,
    brands,
    categories,
    colors,
    sort,
    page,
  });

  const filterOptions = useFilterOptions();

  const setParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(params);
    if (value === undefined || value === "") next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.delete("page");
    setParams(next);
  };

  const toggleListValue = (key: "brands" | "categories" | "colors", value: string) => {
    const next = new URLSearchParams(params);
    const current = parseList(params.get(key));
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

    if (updated.length === 0) next.delete(key);
    else next.set(key, updated.join(","));

    next.delete("page");
    setParams(next);
  };

  const setPage = (p: number) => {
    const next = new URLSearchParams(params);
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    setParams(next);
  };

  const resetAll = () => setParams(new URLSearchParams());

  const hasActiveFilters = !!q || brands.length > 0 || categories.length > 0 || colors.length > 0;

  const filterOptionsProp = {
    brands: filterOptions.brands,
    categories: filterOptions.categories,
    colors: filterOptions.colors,
  };

  return (
    <div className="mx-auto max-w-8xl p-4 sm:p-6 lg:p-8">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-text sm:text-3xl">Catalog</h1>
        <p className="mt-1 text-sm text-text-secondary">{loading ? "Loading…" : `Found: ${total}`}</p>
      </header>

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
        {/* Сайдбар фильтров — только на десктопе */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <CatalogSearch value={q} onChange={(v) => setParam("q", v)} />

            <CatalogSort value={sort} onChange={(v) => setParam("sort", v)} />

            <div className="border-t border-border pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-text">Filters</h2>
                {hasActiveFilters && (
                  <button onClick={resetAll} className="text-xs text-text-tertiary hover:text-text">
                    Reset
                  </button>
                )}
              </div>

              <CatalogFilters options={filterOptionsProp} selected={{ brands, categories, colors }} onToggle={toggleListValue} />
            </div>
          </div>
        </aside>

        {/* Контент */}
        <div className="min-w-0">
          {/* Мобильная панель: кнопка Filters + поиск */}
          <div className="mb-4 flex items-center gap-2 lg:hidden">
            <button onClick={() => setDrawerOpen(true)} className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-bg-secondary px-4 py-2 text-sm font-medium text-text transition-colors hover:border-border-strong">
              <SlidersHorizontal size={14} />
              Filters
              {hasActiveFilters && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-text px-1 text-[10px] font-bold text-bg">{(brands.length > 0 ? 1 : 0) + (categories.length > 0 ? 1 : 0) + (colors.length > 0 ? 1 : 0)}</span>}
            </button>

            <div className="min-w-0 flex-1">
              <CatalogSearch value={q} onChange={(v) => setParam("q", v)} />
            </div>
          </div>

          {/* Сортировка — отдельной строкой на мобиле */}
          <div className="mb-6 lg:hidden">
            <CatalogSort value={sort} onChange={(v) => setParam("sort", v)} />
          </div>

          {/* Товары */}
          {error ? (
            <EmptyState title="Failed to load products" description={error} />
          ) : !loading && products.length === 0 ? (
            <EmptyState title="Nothing found" description="Try changing filters or search query" />
          ) : (
            <>
              <ProductGrid products={products} loading={loading} skeletonCount={PAGE_SIZE} />
              <div className="mt-8 sm:mt-12">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Drawer для мобильных */}
      <CatalogFiltersDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} options={filterOptionsProp} selected={{ brands, categories, colors }} onToggle={toggleListValue} onReset={resetAll} hasActiveFilters={hasActiveFilters} />
    </div>
  );
}
