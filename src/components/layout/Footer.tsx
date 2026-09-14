export default function Footer() {
  return (
    <footer className="border-t border-border transition-colors">
      {" "}
      <div className="mx-auto flex max-w-8xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-text-secondary sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Sneakers Store</p>
        <p>Pet project · не настоящий магазин</p>
      </div>
    </footer>
  );
}
