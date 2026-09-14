import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-8xl flex-col items-center px-4 py-32 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-bold text-text">404</h1>
      <p className="mt-4 text-text-secondary">Страница не найдена</p>
      <Link to="/" className="mt-8 rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
        На главную
      </Link>
    </div>
  );
}
