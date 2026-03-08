import type { Metadata } from "next";
import Link from "next/link";

import { ChezRimLanding } from "@/app/b/[businessId]/landings/ChezRimLanding";
import { ClassicLanding } from "@/app/b/[businessId]/landings/ClassicLanding";
import { PalmariaLanding } from "@/app/b/[businessId]/landings/PalmariaLanding";
import { getBusinessBySlugOrId } from "@/lib/actions/business.actions";

type Props = SearchParamProps;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const business = await getBusinessBySlugOrId(params.businessId);
  const title = business?.landingTitle || business?.name || "Book online";
  const description =
    business?.landingDescription ||
    "Book your appointment online. Quick, easy, and hassle-free.";
  return { title: `${title} | Book online`, description };
}

export default async function BusinessLandingPage({
  params: { businessId },
}: SearchParamProps) {
  let business: Awaited<ReturnType<typeof getBusinessBySlugOrId>> = null;
  let loadError: string | null = null;

  try {
    business = await getBusinessBySlugOrId(businessId);
  } catch (err) {
    console.error("Landing page load error:", err);
    loadError = "We couldn't load this page. Please try again.";
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 bg-[#0f0f0f]">
        <p className="text-dark-700 text-center">{loadError}</p>
        <Link
          href={`/b/${businessId}`}
          className="text-16-semibold text-green-500 hover:underline"
        >
          Try again
        </Link>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-[#0f0f0f]">
        <p className="text-dark-700">Business not found.</p>
      </div>
    );
  }

  if (business.slug === "chez-rim") {
    return <ChezRimLanding business={business} businessId={businessId} />;
  }

  if (business.slug === "atelier-9") {
    return <PalmariaLanding business={business} businessId={businessId} />;
  }

  return <ClassicLanding business={business} businessId={businessId} />;
}
