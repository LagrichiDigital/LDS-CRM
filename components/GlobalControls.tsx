"use client";

import { usePathname } from "next/navigation";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

/** Hide on business landing pages (/b/atelier-9, /b/test-salon) — language and theme are for the software only. */
function isBusinessLanding(pathname: string | null): boolean {
  if (!pathname) return false;
  const parts = pathname.split("/").filter(Boolean);
  return parts.length === 2 && parts[0] === "b";
}

export function GlobalControls({ inline }: { inline?: boolean } = {}) {
  const pathname = usePathname();
  if (!inline && pathname?.includes("/admin")) return null;
  if (!inline && isBusinessLanding(pathname)) return null;
  return (
    <div
      className={
        inline
          ? "flex items-center gap-2"
          : "fixed top-4 right-4 z-50 flex items-center gap-2"
      }
    >
      <ThemeToggle />
      <LanguageSwitcher />
    </div>
  );
}
