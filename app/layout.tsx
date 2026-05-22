import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { APP_DESCRIPTION, APP_NAME, APP_SLOGAN } from '@/lib/constants'
import ClientProviders from "@/create components/shared/client-providers";
import ThemeProvider from "@/components/shared/theme-provider";

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME}. ${APP_SLOGAN}`,
  },
  description: APP_DESCRIPTION,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const cookieTheme = cookieStore.get("theme")?.value
  const themeClass = cookieTheme === "dark" ? "dark" : "light"

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${themeClass} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <ClientProviders>{children}</ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
