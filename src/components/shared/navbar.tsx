import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui";

export function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>BidHub</span>
            <Badge variant="outline">Coleccionables</Badge>
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">
            Explorar
          </Link>
          <Link href="/api/categories" className="hover:text-white transition-colors">
            Categorías
          </Link>
        </nav>
      </div>
    </header>
  );
}
