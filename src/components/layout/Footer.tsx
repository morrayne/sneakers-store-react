export default function Footer() {
  return (
    <footer className="mx-auto flex h-12 max-w-8xl w-full items-center justify-between px-4 text-xs text-text-secondary sm:px-6 lg:px-8">
      <p>© {new Date().getFullYear()} Sneakers Store</p>
      <p className="hidden sm:block">demo project · no real purchase is possible</p>
    </footer>
  );
}
