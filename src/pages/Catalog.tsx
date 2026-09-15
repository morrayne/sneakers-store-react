import { useSearchParams } from "react-router-dom";
import { UseProductList, type SortOption } from "@/hooks/useProductList";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/catalog/Pagination";
import CatalogSearch from "@/components/catalog/CatalogSearch";
import CatalogSort from "@/components/catalog/CatalogSort";
import CatalogFilters from "@/components/catalog/CatalogFilters";

const SORT_OPTIONS: SortOption[] = ["newest", "name-asc", "name-desc", "price-asc", "price-desc", "rating-desc"];

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

export default function Catalog() {
  const [params, setParams] = useSearchParams();

  const q = params.get("q") ?? "";
  const brands = parseList(params.get("brands"));
  const categories = parseList(params.get("categories"));
  const colors = parseList(params.get("colors"));
  const sortParam = params.get("sort") as SortOption | null;
  const sort: SortOption = sortParam && SORT_OPTIONS.includes(sortParam) ? sortParam : "newest";
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);

  const { products, loading, error, total, totalPages } = UseProductList({
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

  return (
    <div className="mx-auto max-w-8xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text">Каталог</h1>
        <p className="mt-1 text-sm text-text-secondary">{loading ? "Загрузка…" : `Найдено: ${total}`}</p>
      </header>

      <div className="grid grid-cols-[260px_1fr] gap-8">
        <aside>
          <div className="sticky top-24 space-y-6">
            <CatalogSearch value={q} onChange={(v) => setParam("q", v)} />

            <CatalogSort value={sort} onChange={(v) => setParam("sort", v)} />

            <div className="border-t border-border pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-text">Фильтры</h2>
                {hasActiveFilters && (
                  <button onClick={resetAll} className="text-xs text-text-tertiary hover:text-text">
                    Сбросить
                  </button>
                )}
              </div>

              <CatalogFilters
                options={{
                  brands: filterOptions.brands,
                  categories: filterOptions.categories,
                  colors: filterOptions.colors,
                }}
                selected={{ brands, categories, colors }}
                onToggle={toggleListValue}
              />
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          {error ? (
            <EmptyState title="Не удалось загрузить товары" description={error} />
          ) : !loading && products.length === 0 ? (
            <EmptyState title="Ничего не найдено" description="Попробуй изменить фильтры или запрос" />
          ) : (
            <>
              <ProductGrid products={products} loading={loading} />
              <div className="mt-12">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
