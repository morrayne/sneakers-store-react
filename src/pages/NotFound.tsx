import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-8xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-5xl font-bold text-text">404</h1>
      <p className="mt-4 text-text-secondary">Страница не найдена</p>
      <Link to="/" className="mt-8 rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
        На главную
      </Link>
    </div>
  );
}
