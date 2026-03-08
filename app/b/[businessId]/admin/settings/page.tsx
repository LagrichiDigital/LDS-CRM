import Link from "next/link";

import { AdminPageHeader } from "../AdminPageHeader";
import { getBusinessBySlugOrId } from "@/lib/actions/business.actions";
import { formatCurrency } from "@/lib/utils";
import { getBusinessHoursByBusiness } from "@/lib/actions/business-hours.actions";
import { getServicesByBusiness } from "@/lib/actions/service.actions";
import { ChangeRequestForm } from "./ChangeRequestForm";

export default async function AdminSettingsPage({
  params: { businessId },
}: SearchParamProps) {
  let business: Awaited<ReturnType<typeof getBusinessBySlugOrId>> = null;
  let services: Awaited<ReturnType<typeof getServicesByBusiness>> = [];
  let hours: Awaited<ReturnType<typeof getBusinessHoursByBusiness>> = [];
  let loadError: string | null = null;

  try {
    const b = await getBusinessBySlugOrId(businessId);
    business = b;
    if (b) {
      const [s, h] = await Promise.all([
        getServicesByBusiness(b.$id),
        getBusinessHoursByBusiness(b.$id),
      ]);
      services = s;
      hours = h;
    }
  } catch (err) {
    console.error("Admin settings load error:", err);
    loadError = "We couldn't load the settings. Please try again.";
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-dark-700 text-center">{loadError}</p>
        <Link
          href={`/b/${businessId}/admin/settings`}
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

  const timezone = business.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <AdminPageHeader
      businessId={businessId}
      businessName={business.name}
      pageTitle="admin.settingsTitle"
      pageSubtitle="admin.settingsSubtitle"
    >
      <section className="w-full space-y-10">
        <div className="space-y-3 rounded-2xl border border-dark-500 bg-dark-400/70 p-5 shadow-lg">
          <h2 className="sub-header">Business profile</h2>
          <dl className="grid gap-3 text-14-regular text-dark-700 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-white">Name</dt>
              <dd>{business.name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Slug</dt>
              <dd>{business.slug}</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Timezone</dt>
              <dd>{timezone}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-3 rounded-2xl border border-dark-500 bg-dark-400/70 p-5 shadow-lg">
          <h2 className="sub-header">Services</h2>
          {services.length === 0 ? (
            <p className="text-dark-700 text-sm">
              No services configured yet. Use the form below to request new services.
            </p>
          ) : (
            <ul className="space-y-2 text-14-regular text-dark-700">
              {services.map((s) => (
                <li
                  key={s.$id}
                  className="flex items-center justify-between rounded-md border border-dark-500 bg-dark-300 px-3 py-2"
                >
                  <div>
                    <p className="text-white text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-dark-600">
                      {s.durationMinutes ? `${s.durationMinutes} min` : "Duration not set"}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    {s.price != null ? (
                      <span>
                        {formatCurrency(s.price, business.currency)}
                      </span>
                    ) : (
                      <span className="text-dark-600">No price</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-dark-500 bg-dark-400/70 p-5 shadow-lg">
          <h2 className="sub-header">Business hours</h2>
          {hours.length === 0 ? (
            <p className="text-dark-700 text-sm">
              No opening hours configured yet. Use the form below to request changes.
            </p>
          ) : (
            <ul className="grid gap-2 text-14-regular text-dark-700 sm:grid-cols-2 md:grid-cols-3">
              {hours
                .slice()
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                .map((h) => (
                  <li key={`${h.businessId}-${h.dayOfWeek}`}>
                    <span className="font-semibold text-white">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][h.dayOfWeek]}:
                    </span>{" "}
                    {h.isClosed ? "Closed" : `${h.openTime} – ${h.closeTime}`}
                  </li>
                ))}
            </ul>
          )}
        </div>

        <ChangeRequestForm businessId={businessId} businessName={business.name} />
      </section>
    </AdminPageHeader>
  );
}

