import Link from "next/link";

import { AdminPageHeader } from "../AdminPageHeader";
import { getBusinessBySlugOrId } from "@/lib/actions/business.actions";
import { getClientsByBusiness } from "@/lib/actions/client.actions";
import { hasBusinessAdminAccess } from "@/lib/actions/admin-auth.actions";
import { canUseClientProfiles } from "@/lib/plan";

export default async function AdminClientsPage({
  params: { businessId },
}: SearchParamProps) {
  const business = await getBusinessBySlugOrId(businessId);
  if (!business) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-dark-700">Business not found.</p>
      </div>
    );
  }

  if (!canUseClientProfiles(business)) {
    return (
      <AdminPageHeader
        businessId={businessId}
        businessName={business.name}
        pageTitle="admin.clientsTitle"
        pageSubtitle="admin.clientsSubtitle"
      >
        <div className="rounded-2xl border border-dark-500 bg-dark-400/70 p-6">
          <p className="text-dark-700">
            Client profiles are available on the Business plan. Contact us to upgrade.
          </p>
          <Link
            href={`/b/${businessId}/admin`}
            className="mt-4 inline-block text-green-500 hover:underline"
          >
            Back to dashboard
          </Link>
        </div>
      </AdminPageHeader>
    );
  }

  const clients = await getClientsByBusiness(business.$id);

  return (
    <AdminPageHeader
      businessId={businessId}
      businessName={business.name}
      pageTitle="admin.clientsTitle"
      pageSubtitle="admin.clientsSubtitle"
    >
      <section className="w-full space-y-6">
        {clients.length === 0 ? (
          <div className="rounded-2xl border border-dark-500 bg-dark-400/70 p-8 text-center">
            <p className="text-dark-700">No client profiles yet.</p>
            <p className="mt-2 text-14-regular text-dark-600">
              Create a client profile from an appointment using &quot;Create client profile&quot; in the appointment actions.
            </p>
            <Link
              href={`/b/${businessId}/admin`}
              className="mt-4 inline-block text-green-500 hover:underline"
            >
              Back to dashboard
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {clients.map((client) => (
              <li key={client.$id}>
                <Link
                  href={`/b/${businessId}/admin/clients/${client.$id}`}
                  className="flex items-center justify-between rounded-xl border border-dark-500 bg-dark-400/70 p-4 transition hover:bg-dark-500"
                >
                  <div>
                    <p className="font-semibold text-white">{client.name}</p>
                    <p className="text-14-regular text-dark-600">{client.email}</p>
                  </div>
                  <span className="text-dark-600">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminPageHeader>
  );
}
