import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevJobs.uz — IT vakansiyalar",
  description:
    "O‘zbekiston IT hamjamiyati uchun vakansiyalar va ish qidirish platformasi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
