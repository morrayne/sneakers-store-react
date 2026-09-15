import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  mode: "login" | "signup";
  onSuccess: () => void;
}

export default function AuthForm({ mode, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLogin = mode === "login";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: supaError } = isLogin ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (supaError) {
      setError(translateError(supaError.message));
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text placeholder:text-text-tertiary focus:border-border-strong focus:outline-none"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">Пароль</label>
        <input
          type="password"
          required
          minLength={6}
          autoComplete={isLogin ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text placeholder:text-text-tertiary focus:border-border-strong focus:outline-none"
          placeholder="Минимум 6 символов"
        />
      </div>

      {error && <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-2.5 text-xs text-error">{error}</div>}

      <button type="submit" disabled={loading} className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? "Загрузка…" : isLogin ? "Войти" : "Зарегистрироваться"}
      </button>
    </form>
  );
}

function translateError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Неверный email или пароль";
  }
  if (message.includes("User already registered")) {
    return "Пользователь с таким email уже зарегистрирован";
  }
  if (message.includes("Password should be at least")) {
    return "Пароль должен быть не короче 6 символов";
  }
  if (message.includes("Unable to validate email address")) {
    return "Некорректный email";
  }
  return message;
}
