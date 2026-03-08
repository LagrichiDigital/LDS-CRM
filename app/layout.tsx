import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Plus_Jakarta_Sans as FontSans } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { GlobalControls } from "@/components/GlobalControls";
import { LenisProvider } from "@/components/LenisProvider";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import type { Locale } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Lagrichi Digital Solutions",
  description:
    "Booking and appointment management for salons and businesses. Let your clients book online and manage everything in one place.",
  icons: {
    icon: "/assets/icons/logo-icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("lds-locale")?.value;
  const initialLocale: Locale =
    localeCookie === "fr" || localeCookie === "ar" ? localeCookie : "en";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-dark-300 font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LocaleProvider initialLocale={initialLocale}>
            <LenisProvider>
              {children}
              <GlobalControls />
            </LenisProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
