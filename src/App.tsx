import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function App() {
  useEffect(() => {
    supabase.from("products").select("*").limit(1).then(console.log);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <h1 className="text-4xl font-bold">Sneakers Store</h1>
    </div>
  );
}
