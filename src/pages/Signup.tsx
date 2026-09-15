import { Link, useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-text">Регистрация</h1>
      <p className="mt-2 text-sm text-text-secondary">Создайте аккаунт, чтобы оформлять заказы</p>

      <div className="mt-8">
        <AuthForm mode="signup" onSuccess={() => navigate("/profile", { replace: true })} />
      </div>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Уже есть аккаунт?{" "}
        <Link to="/login" className="text-link hover:underline">
          Войти
        </Link>
      </p>
    </div>
  );
}
