import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthSessionProvider } from "@/modules/auth";
import { ActiveProjectProvider } from "./context/ActiveProjectContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeScript } from "./context/ThemeScript";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mytsyy — De idea a validación en 30 días",
  description:
    "Sistema de ejecución empresarial con IA. Transforma tu idea en validación real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeScript />
        <ThemeProvider>
          <AuthSessionProvider>
            <ActiveProjectProvider>{children}</ActiveProjectProvider>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
