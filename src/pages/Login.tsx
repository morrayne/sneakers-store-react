import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/profile";

  return (
    <div className="mx-auto max-w-8xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-text">Sign in</h1>
      <p className="mt-2 text-sm text-text-secondary">Sign in to place orders and view your history</p>

      <div className="mt-8">
        <AuthForm mode="login" onSuccess={() => navigate(from, { replace: true })} />
      </div>

      <p className="mx-auto mt-6 max-w-1/2 text-center text-sm text-text-secondary">
        Don't have an account?{" "}
        <Link to="/signup" className="text-link hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
