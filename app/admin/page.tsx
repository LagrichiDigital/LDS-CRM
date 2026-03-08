import Link from "next/link";

import { AdminLoginForm } from "./AdminLoginForm";

/**
 * Multi-tenant admin entry. Each business has its own dashboard at
 * /b/[businessId]/admin (e.g. /b/abc123/admin).
 */
const AdminPage = async ({
  searchParams,
}: {
  searchParams?: { error?: string };
}) => {
  const errorFromUrl = searchParams?.error;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 px-4 py-20">
      <h1 className="header">Admin</h1>
      <p className="text-dark-700 text-center">
        Sign in to access your business dashboard.
      </p>

      <AdminLoginForm errorFromUrl={errorFromUrl} />

      <Link
        href="/"
        className="mt-4 inline-block rounded-lg border border-dark-500 bg-dark-400 px-4 py-2.5 text-14-medium text-dark-700 transition hover:bg-dark-500"
      >
        ← Back to home
      </Link>
    </div>
  );
};

export default AdminPage;
