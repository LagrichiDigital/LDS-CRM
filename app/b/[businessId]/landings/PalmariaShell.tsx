"use client";

import Link from "next/link";
import { createContext, useContext, useState } from "react";

type SidebarContextValue = { openSidebar: () => void };
const SidebarContext = createContext<SidebarContextValue | null>(null);

export function usePalmariaSidebar() {
  const ctx = useContext(SidebarContext);
  return ctx;
}

type Props = {
  businessName: string;
  businessId: string;
  logoUrl?: string | null;
  children: React.ReactNode;
};

export function PalmariaShell({
  businessName,
  businessId,
  logoUrl,
  children,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const openSidebar = () => setSidebarOpen(true);

  return (
    <SidebarContext.Provider value={{ openSidebar }}>
      <div className="min-h-screen bg-[#faf9f7] text-neutral-800">
        <div className="flex">

        {/* Overlay when sidebar is open */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar drawer — only visible when open */}
        <aside
          className={`fixed left-0 top-0 z-50 flex h-full w-[280px] max-w-[85vw] flex-col border-r border-neutral-200 bg-[#f5f5f5] shadow-xl transition-transform duration-300 ease-out lg:w-[320px] ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!sidebarOpen}
        >
          <div className="flex flex-1 flex-col p-6 pt-8">
            <div className="mb-10 flex items-center justify-between">
              {logoUrl ? (
                <Link
                  href="#"
                  onClick={() => setSidebarOpen(false)}
                  className="block w-10"
                >
                  <img
                    src={logoUrl}
                    alt={businessName}
                    className="h-8 w-auto object-contain"
                  />
                </Link>
              ) : (
                <div className="flex gap-0.5" aria-hidden>
                  <span className="h-0.5 w-6 bg-neutral-800" />
                  <span className="h-0.5 w-8 bg-neutral-800" />
                  <span className="h-0.5 w-5 bg-neutral-800" />
                </div>
              )}
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {[
                { href: "#explore", label: "Explore" },
                { href: "#services", label: "Services" },
                { href: "#experience", label: "Facilities" },
                { href: "#contact", label: "Contact us" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-md py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-200/80 hover:text-neutral-900"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-neutral-200 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Get in touch
            </p>
            <p className="mt-3 text-sm text-neutral-700">—</p>
            <p className="mt-1 text-sm text-neutral-600">
              Phone / Email / Address
            </p>
          </div>
        </aside>

        {/* Main: full width (no reserved space for sidebar) */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
    </SidebarContext.Provider>
  );
}
