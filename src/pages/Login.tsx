import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/profile";

  return (
    <div className="mx-auto max-w-8xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-text">Вход</h1>
      <p className="mt-2 text-sm text-text-secondary">Войдите, чтобы оформлять заказы и видеть историю</p>

      <div className="mt-8">
        <AuthForm mode="login" onSuccess={() => navigate(from, { replace: true })} />
      </div>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Нет аккаунта?{" "}
        <Link to="/signup" className="text-link hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
