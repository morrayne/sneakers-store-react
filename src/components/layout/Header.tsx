import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, UserRound, Home as HomeIcon, LayoutGrid, Heart, Sun, Moon, Monitor } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useCartStore } from "@/store/cartStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import type { Theme } from "@/types";

const REPO_URL = "https://github.com/morrayne/sneakers-store-react";

const THEME_CYCLE: Theme[] = ["light", "dark", "system"];
const THEME_ICONS: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const NAV_LINKS = [
  { to: "/", label: "Home", icon: HomeIcon, end: true },
  { to: "/catalog", label: "Catalog", icon: LayoutGrid, end: false },
  { to: "/cart", label: "Cart", icon: ShoppingBag, end: false },
  { to: "/favorites", label: "Favorites", icon: Heart, end: false },
];

export default function Header() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const cartCount = useCartStore((s) => s.count());
  const favCount = useFavoritesStore((s) => s.ids.length);
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cycleTheme = () => {
    const idx = THEME_CYCLE.indexOf(theme);
    const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
    setTheme(next);
  };

  const ThemeIcon = THEME_ICONS[theme];

  const getBadge = (label: string) => {
    if (label === "Cart") return cartCount;
    if (label === "Favorites") return favCount;
    return 0;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-nav-bg backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-8xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Логотип — GitHub */}
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className="flex h-full items-center text-text transition-colors hover:text-accent">
          <ShoppingBag size={20} />
        </a>

        {/* Навигация — ПК */}
        <nav className="hidden h-full items-stretch gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const badge = getBadge(link.label);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => cn("relative flex items-center gap-2 px-5 text-xs font-medium uppercase tracking-[0.15em] transition-colors", isActive ? "bg-border text-text" : "text-text-secondary hover:text-text")}
              >
                {link.label}
                {badge > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-text px-1 text-[10px] font-bold text-bg">{badge}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Навигация — мобильный */}
        <nav className="flex h-full items-stretch gap-1 lg:hidden">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const badge = getBadge(link.label);
            return (
              <NavLink key={link.to} to={link.to} end={link.end} aria-label={link.label} className={({ isActive }) => cn("relative flex items-center px-3 transition-colors", isActive ? "text-text" : "text-text-secondary hover:text-text")}>
                <Icon size={18} />
                {badge > 0 && <span className="absolute right-1 top-3 flex h-3 min-w-3 items-center justify-center rounded-full bg-text px-0.5 text-[8px] font-bold text-bg">{badge}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Правый блок */}
        <div className="flex items-center gap-1">
          {/* Кнопка темы */}
          <button onClick={cycleTheme} aria-label={`Theme: ${theme}`} title={`Theme: ${theme}`} className="flex h-9 w-9 items-center justify-center rounded-full text-text transition-colors hover:bg-bg-tertiary">
            <ThemeIcon size={18} />
          </button>

          {/* Профиль */}
          <Link
            to={user ? "/profile" : "/login"}
            aria-label={user ? "Profile" : "Login"}
            className={cn("flex h-9 w-9 items-center justify-center rounded-full transition-colors", user ? "bg-accent text-white hover:bg-accent-hover" : "text-text hover:bg-bg-tertiary")}
          >
            <UserRound size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
