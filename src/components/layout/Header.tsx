import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, User, Monitor, Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/utils/cn";
import type { Theme } from "@/types";

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function Header() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const count = useCartStore((s) => s.count());

  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) => cn("text-sm font-medium transition-colors hover:text-text", isActive ? "text-text" : "text-text-secondary");

  const CurrentIcon = themeOptions.find((o) => o.value === theme)?.icon ?? Monitor;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-nav-bg backdrop-blur-md transition-colors">
      {" "}
      <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-bold tracking-tight text-text">
          Sneakers
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/catalog" className={linkClass}>
            Catalog
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {/* Переключатель темы */}
          <div className="relative">
            <button onClick={() => setThemeMenuOpen((v) => !v)} aria-label="Toggle theme" className="rounded-full p-2 text-text transition-colors hover:bg-bg-tertiary">
              <CurrentIcon size={18} />
            </button>

            {themeMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setThemeMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-bg-secondary shadow-lg">
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setTheme(opt.value);
                          setThemeMenuOpen(false);
                        }}
                        className={cn("flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-bg-tertiary", theme === opt.value ? "text-text" : "text-text-secondary")}
                      >
                        <Icon size={14} />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Профиль */}
          <Link to="/login" aria-label="Profile" className="rounded-full p-2 text-text transition-colors hover:bg-bg-tertiary">
            <User size={18} />
          </Link>

          {/* Корзина со счётчиком */}
          <Link to="/cart" aria-label="Cart" className="relative rounded-full p-2 text-text transition-colors hover:bg-bg-tertiary">
            <ShoppingBag size={18} />
            {count > 0 && <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-text px-1 text-[10px] font-bold text-bg">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
