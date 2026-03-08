"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

import { OnboardingSlideshow } from "./OnboardingSlideshow";

const ONBOARDING_IMAGES = [
  { src: "/assets/images/onboarding-img.png", alt: "Booking" },
  { src: "/assets/images/onboarding-img-2.png", alt: "Salon & spa" },
];

export function HomeContent({ searchParams }: { searchParams?: { admin?: string } }) {
  const { t } = useLocale();

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto px-6 py-10 md:px-10 md:py-14">
        <div className="sub-container max-w-[496px]">
          <h1 className="mb-10 text-2xl font-bold tracking-tight text-white md:mb-12 md:text-3xl">
            {t("home.title")}
          </h1>

          <h2 className="header mb-5">{t("home.tagline")}</h2>
          <p className="text-dark-700 mb-8 text-16-regular leading-relaxed">
            {t("home.description")}
          </p>
          <p className="text-14-regular text-dark-600 mb-10 leading-relaxed">
            {t("home.builtFor")}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/admin"
              className="inline-flex w-full items-center justify-center rounded-lg bg-green-500 px-6 py-4 text-16-semibold text-white transition hover:brightness-110 sm:w-auto"
            >
              {t("home.adminLogin")}
            </Link>
            <a
              href="mailto:support@lagrichidigital.com"
              className="inline-flex w-full items-center justify-center rounded-lg border border-dark-500 bg-transparent px-6 py-4 text-16-semibold text-white transition hover:bg-dark-400 sm:w-auto"
            >
              {t("home.getInTouch")}
            </a>
          </div>

          <p className="mt-8 text-14-regular text-dark-600">
            {t("home.help")}{" "}
            <a
              href="mailto:support@lagrichidigital.com"
              className="text-green-500 hover:underline"
            >
              support@lagrichidigital.com
            </a>
          </p>

          <div className="text-14-regular mt-16 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <p className="text-dark-600">
              {t("home.copyright", { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </section>

      <div className="side-img relative max-w-[50%] flex-1">
        <OnboardingSlideshow images={ONBOARDING_IMAGES} className="h-full" />
      </div>
    </div>
  );
}
