import type { Metadata } from "next";
import Link from "next/link";

import { ServicesPageContent } from "@/components/ServicesPageContent";
import { getBusinessBySlugOrId } from "@/lib/actions/business.actions";
import { getServicesByBusiness } from "@/lib/actions/service.actions";

type Props = SearchParamProps;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const business = await getBusinessBySlugOrId(params.businessId);
  const name = business?.name || "Business";
  return {
    title: `Services | ${name}`,
    description: `Choose a service to book with ${name}. Cuts, color, styling, and more.`,
  };
}

export default async function ServicesPage({
  params: { businessId },
}: SearchParamProps) {
  let business: Awaited<ReturnType<typeof getBusinessBySlugOrId>> = null;
  let services: Awaited<ReturnType<typeof getServicesByBusiness>> = [];
  let loadError: string | null = null;

  try {
    const b = await getBusinessBySlugOrId(businessId);
    business = b;
    if (b) {
      services = await getServicesByBusiness(b.$id);
    }
  } catch (err) {
    console.error("Services page load error:", err);
    loadError = "We couldn't load services. Please try again.";
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-dark-700 text-center">{loadError}</p>
        <Link
          href={`/b/${businessId}/services`}
          className="text-16-semibold text-green-500 hover:underline"
        >
          Try again
        </Link>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-dark-700">Business not found.</p>
      </div>
    );
  }

  return (
    <ServicesPageContent
      business={business}
      services={services}
      businessId={businessId}
    />
  );
}
