import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Badminton Club Manager",
  description: "Badminton club management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="h-full bg-[#0d1117] text-white">{children}</body>
    </html>
  );
}
