import { redirect } from "next/navigation";
import { getBusinessBySlugOrId } from "@/lib/actions/business.actions";
import { hasBusinessAdminAccess } from "@/lib/actions/admin-auth.actions";

export default async function BusinessAdminLayout({
  children,
  params: { businessId },
}: {
  children: React.ReactNode;
  params: { businessId: string };
}) {
  const business = await getBusinessBySlugOrId(businessId);

  if (!business) {
    redirect("/");
  }

  const authorized = await hasBusinessAdminAccess(businessId);

  if (!authorized) {
    // Redirect to login with a return URL
    redirect(`/admin?error=${encodeURIComponent("Please log in to access the dashboard.")}`);
  }

  return (
    <div className="min-h-screen bg-dark-300">
      {children}
    </div>
  );
}
