"use client";

import { useState } from "react";

import { createChangeRequest } from "@/lib/actions/change-request.actions";
import { useLocale } from "@/lib/i18n/LocaleContext";

type ChangeRequestFormProps = {
  businessId: string;
  businessName: string;
};

export function ChangeRequestForm({
  businessId,
  businessName,
}: ChangeRequestFormProps) {
  const { t } = useLocale();
  const [changeType, setChangeType] = useState<"services" | "hours" | "pricing" | "other">(
    "services"
  );
  const [details, setDetails] = useState("");
  const [preferredContact, setPreferredContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!details.trim()) {
      setError(t("admin.changeRequestDetailsRequired"));
      return;
    }

    setIsSubmitting(true);
    const result = await createChangeRequest({
      businessId,
      businessName,
      changeType,
      details,
      preferredContact,
    });
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setDetails("");
    setPreferredContact("");
    setSuccess(t("admin.changeRequestSuccess"));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-dark-500 bg-dark-400/70 p-5 shadow-lg"
    >
      <h2 className="sub-header">{t("admin.changeRequestTitle")}</h2>
      <p className="text-dark-700 text-sm mb-2">
        {t("admin.changeRequestDescription")}
      </p>

      <div className="space-y-2">
        <label className="text-14-medium text-dark-700">
          {t("admin.changeType")}
        </label>
        <select
          value={changeType}
          onChange={(e) =>
            setChangeType(e.target.value as typeof changeType)
          }
          className="w-full rounded-md border border-dark-500 bg-dark-400 px-3 py-2 text-14-regular text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          <option value="services">{t("admin.changeType_services")}</option>
          <option value="hours">{t("admin.changeType_hours")}</option>
          <option value="pricing">{t("admin.changeType_pricing")}</option>
          <option value="other">{t("admin.changeType_other")}</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-14-medium text-dark-700">
          {t("admin.changeDetails")}
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          placeholder={t("admin.changeDetailsPlaceholder")}
          className="w-full rounded-md border border-dark-500 bg-dark-400 px-3 py-2 text-14-regular text-white placeholder:text-dark-600 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-14-medium text-dark-700">
          {t("admin.changePreferredContact")}
        </label>
        <input
          type="text"
          value={preferredContact}
          onChange={(e) => setPreferredContact(e.target.value)}
          placeholder={t("admin.changePreferredContactPlaceholder")}
          className="w-full rounded-md border border-dark-500 bg-dark-400 px-3 py-2 text-14-regular text-white placeholder:text-dark-600 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-500 text-sm" role="status">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="shad-primary-btn inline-flex min-h-[44px] items-center justify-center rounded-md px-6 py-3 text-14-semibold whitespace-nowrap disabled:opacity-70"
      >
        {isSubmitting ? t("common.loading") : t("admin.submitChangeRequest")}
      </button>
    </form>
  );
}

