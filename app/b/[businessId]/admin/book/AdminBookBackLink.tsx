"use client";

import Link from "next/link";

import { useLocale } from "@/lib/i18n/LocaleContext";

export function AdminBookBackLink({ businessId }: { businessId: string }) {
  const { t } = useLocale();
  return (
    <Link
      href={`/b/${businessId}/admin`}
      className="inline-flex items-center gap-2 text-14-medium text-dark-600 hover:text-white"
    >
      ← {t("admin.backToDashboard")}
    </Link>
  );
}
