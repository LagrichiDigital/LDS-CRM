"use client";

import Link from "next/link";

import { usePalmariaSidebar } from "@/app/b/[businessId]/landings/PalmariaShell";

type Props = {
  businessId: string;
  businessName: string;
  logoUrl?: string | null;
};

export function HeroTopBar({ businessId, businessName, logoUrl }: Props) {
  const sidebar = usePalmariaSidebar();

  return (
    <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-[10%] py-4">
      <div className="flex items-center gap-2">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={businessName}
            className="h-7 w-auto object-contain"
          />
        ) : (
          <div className="flex gap-0.5" aria-hidden>
            <span className="block h-2 w-2 rounded-full bg-neutral-400" />
            <span className="block h-2.5 w-2.5 rounded-full bg-neutral-800" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/b/${businessId}/services`}
          className="rounded-full border border-neutral-300 bg-white/95 px-5 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-white"
        >
          Réserver
        </Link>
        <button
          type="button"
          onClick={() => sidebar?.openSidebar()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-white transition hover:bg-white/10"
          aria-label="Open menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
