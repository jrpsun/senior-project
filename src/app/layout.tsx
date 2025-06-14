import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../hooks/LanguageContext"; // นำเข้า LanguageProvider

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kanit.variable} antialiased`}>
        <LanguageProvider> {/* ครอบ LanguageProvider รอบ children */}
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
