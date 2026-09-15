import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-sm text-text-secondary">Загрузка…</span>
      </div>
    );
  }

  if (!user) {
    // запоминаем, откуда пришли — вернёмся сюда после логина
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
