"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { formatCurrency } from "@/lib/utils";
import type { Business } from "@/types/appwrite.types";
import type { Service } from "@/types/appwrite.types";

function DefaultServiceIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839v.10M9.384 9.137l2.077 3.72M9.384 9.137l-1.536.887M9.384 9.137l1.536-.887m-3.072 0a3 3 0 11-5.196 3 3 0 015.196 3zm0 0l-1.536.887m0 0l1.083 1.839M14.616 9.137l-2.077 3.72m2.077-3.72l1.536.887m-1.536-.887l-1.083 1.839"
      />
    </svg>
  );
}

export function ServicesPageContent({
  business,
  services,
  businessId,
}: {
  business: Business;
  services: Service[];
  businessId: string;
}) {
  const { t } = useLocale();

  return (
    <div className="min-h-screen flex flex-col bg-dark-300">
      <header className="border-b border-dark-500 px-[5%] py-4">
        <Link
          href={`/b/${businessId}`}
          className="flex items-center gap-3 text-16-semibold text-dark-300 hover:underline"
        >
          <span>←</span>
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt={business.name}
              className="h-8 w-auto max-w-[180px] object-contain object-left"
            />
          ) : (
            business.name
          )}
        </Link>
      </header>

      <main className="flex-1 px-[5%] py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="header mb-2 text-white">{t("services.title")}</h1>
          <p className="text-dark-700 mb-10">
            {t("services.description")}
          </p>

          {services.length === 0 ? (
            <div className="rounded-xl border border-dark-500 bg-dark-400/50 p-8 text-center">
              <p className="text-dark-600 text-16-regular">
                {t("services.noServices")}
              </p>
              <p className="mt-2 text-dark-600 text-14-regular">
                {t("services.noServicesContact")}
              </p>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2">
              {services.map((service) => (
                <li key={service.$id}>
                  <Link
                    href={`/b/${businessId}/book?serviceId=${service.$id}`}
                    className="flex rounded-xl border border-dark-500 bg-dark-400/80 p-6 transition hover:border-green-500/50 hover:bg-dark-400"
                  >
                    <div className="flex flex-1 flex-col text-left">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-dark-500 text-green-500">
                        {service.iconUrl ? (
                          <img
                            src={service.iconUrl}
                            alt=""
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          <DefaultServiceIcon className="h-6 w-6" />
                        )}
                      </div>
                      <h2 className="text-18-bold text-white">{service.name}</h2>
                      {service.description && (
                        <p className="mt-1 text-14-regular text-dark-600 line-clamp-2">
                          {service.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        {service.price != null && (
                          <span className="text-16-semibold text-white">
                            {formatCurrency(service.price, business.currency)}
                          </span>
                        )}
                        {service.durationMinutes > 0 && (
                          <span className="text-14-regular text-dark-600">
                            {service.durationMinutes} min
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="self-center text-dark-600">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
