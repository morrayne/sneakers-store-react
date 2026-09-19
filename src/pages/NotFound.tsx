import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-8xl relative overflow-hidden flex flex-col items-center justify-center lg:h-[calc(100dvh-96px)]">
      <h1 className="text-5xl font-bold text-text">404 not found</h1> 
      <Link to="/" className="mt-8 rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
        Return to home page
      </Link>
    </div>
  );
}
