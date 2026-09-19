import { Link, useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-8xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-text">Sign up</h1>
      <p className="mt-2 text-sm text-text-secondary">Create an account to place orders</p>

      <div className="mt-8">
        <AuthForm mode="signup" onSuccess={() => navigate("/profile", { replace: true })} />
      </div>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link to="/login" className="text-link hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
