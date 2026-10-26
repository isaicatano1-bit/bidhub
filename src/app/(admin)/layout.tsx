import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administración | BidHub",
  description: "Panel de moderación y administración de BidHub",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
        Área de Administración de BidHub
      </div>
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
