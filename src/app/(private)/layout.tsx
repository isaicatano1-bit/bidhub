import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Cuenta | BidHub",
  description: "Panel privado del usuario en BidHub",
};

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
