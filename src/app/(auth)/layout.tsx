import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autenticación | BidHub",
  description: "Acceso y registro a la plataforma BidHub",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {children}
    </div>
  );
}
