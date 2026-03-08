"use client";

import Link from "next/link";

import { logoutBusinessAdmin } from "@/lib/actions/admin-auth.actions";
import { GlobalControls } from "@/components/GlobalControls";
import { useLocale } from "@/lib/i18n/LocaleContext";

export function AdminPageHeader({
  businessId,
  businessName,
  children,
  pageTitle,
  pageSubtitle,
}: {
  businessId: string;
  businessName: string;
  children: React.ReactNode;
  /** When set, shown instead of the default welcome heading. */
  /** Translation key for optional custom heading (e.g. "admin.bookAppointmentTitle"). */
  pageTitle?: string;
  /** Translation key for optional custom subtitle (e.g. "admin.bookAppointmentSubtitle"). */
  pageSubtitle?: string;
}) {
  const { t } = useLocale();
  const dashboardHref = `/b/${businessId}/admin`;

  return (
    <>
      <div className="admin-header-bar w-full border-b-2 border-b-green-500 bg-dark-200 shadow-sm">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 xl:px-8">
          <Link
            href={`/b/${businessId}`}
            className="min-w-0 cursor-pointer truncate text-16-semibold hover:underline"
            title={businessName}
          >
            {businessName}
          </Link>
          <a
            href={dashboardHref}
            className="hidden cursor-pointer text-16-semibold hover:underline sm:block"
          >
            {t("admin.dashboard")}
          </a>
          <div className="flex shrink-0 items-center gap-2">
            <GlobalControls inline />
            <form action={logoutBusinessAdmin}>
              <button
                type="submit"
                className="rounded-md border border-dark-500 bg-dark-400 px-3 py-1.5 text-14-medium text-dark-700 transition hover:bg-dark-500"
              >
                Log out
              </button>
            </form>
          </div>
        </header>
      </div>

      <main className="admin-main mx-auto w-full max-w-7xl space-y-14 pt-8 xl:pt-10">
        <section className="w-full space-y-4">
          <h1 className="header">{pageTitle ? t(pageTitle) : t("admin.welcome")}</h1>
          <p className="text-dark-700">
            {pageSubtitle ? t(pageSubtitle) : t("admin.manage", { name: businessName })}
          </p>
        </section>
        {children}
      </main>
    </>
  );
}
