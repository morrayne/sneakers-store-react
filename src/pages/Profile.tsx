import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-8xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-text">Профиль</h1>
      <p className="mt-2 text-sm text-text-secondary">Вы вошли как: {user?.email}</p>
    </div>
  );
}
