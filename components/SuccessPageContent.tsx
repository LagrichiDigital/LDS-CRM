"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { Button } from "@/components/ui/button";
import type { Business } from "@/types/appwrite.types";

type SuccessPageContentProps = {
  business: Business | null;
  businessId: string;
  serviceName: string;
  scheduleDateTime: string;
};

export function SuccessPageContent({
  business,
  businessId,
  serviceName,
  scheduleDateTime,
}: SuccessPageContentProps) {
  const { t } = useLocale();
  const brandStyle = business?.primaryColor
    ? { backgroundColor: business.primaryColor, color: "#fff" }
    : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-dark-300">
      {business && (
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
      )}
      <div className="success-img m-auto flex max-w-lg flex-1 flex-col items-center justify-center gap-8 px-[5%] py-10">
        <Image
          src="/assets/gifs/success.gif"
          height={300}
          width={280}
          alt="Success"
        />
        <h2 className="header text-center text-white">
          {(() => {
            const title = t("success.title");
            const highlight = t("success.highlight");
            const parts = title.split(highlight);
            return (
              <>
                {parts[0]}
                <span className="text-green-500">{highlight}</span>
                {parts[1]}
              </>
            );
          })()}
        </h2>
        <p className="text-dark-700 text-center">
          {t("success.sms")}
        </p>
        <p className="text-dark-600 text-center text-sm">
          {t("success.whatNext")}
        </p>

        <section className="request-details w-full rounded-lg border border-dark-500 bg-dark-400/50 p-4">
          <p className="text-14-medium mb-2 text-white">{t("success.requestDetails")}</p>
          <p className="text-14-regular text-dark-700">
            {serviceName} • {scheduleDateTime}
          </p>
        </section>

        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" className="shad-primary-btn" asChild>
            <Link
              href={`/b/${businessId}/services`}
              style={brandStyle}
              className={!business?.primaryColor ? "" : "border-transparent"}
            >
              {t("success.bookAnother")}
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href={`/b/${businessId}`}>{t("success.backToHome")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
