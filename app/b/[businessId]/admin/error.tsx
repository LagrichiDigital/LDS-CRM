"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-dark-300 px-4">
      <h1 className="text-18-bold text-white">Something went wrong</h1>
      <p className="text-dark-700 text-center max-w-md">
        The dashboard hit an error. You can try again or go back to admin login.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="shad-primary-btn rounded-lg px-5 py-2.5 text-14-semibold"
        >
          Try again
        </button>
        <Link
          href="/admin"
          className="rounded-lg border border-dark-500 bg-dark-400 px-5 py-2.5 text-14-semibold text-white transition hover:bg-dark-500"
        >
          Admin login
        </Link>
      </div>
    </div>
  );
}
