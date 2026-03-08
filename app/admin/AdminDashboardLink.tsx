"use client";

import { useRef, useState } from "react";

import { resolveAdminBusinessId } from "@/lib/actions/business.actions";
import { Input } from "@/components/ui/input";

export function AdminDashboardLink() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const raw = (inputRef.current?.value ?? value).trim().replace(/\s/g, "");
    if (!raw) {
      setError("Please enter your business slug or ID.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await resolveAdminBusinessId(raw);
      if ("businessId" in result) {
        window.location.href = `/b/${result.businessId}/admin`;
        return;
      }
      setError(result.error);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4 sm:flex-row sm:items-stretch">
      <div className="flex flex-1 flex-col gap-1">
        <Input
          ref={inputRef}
          placeholder="e.g. test-salon or your business ID"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          onPaste={() => {
            setTimeout(() => {
              setValue(inputRef.current?.value ?? "");
              setError("");
            }, 0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={loading}
          className="flex-1 bg-dark-400 border-dark-500 py-3 font-mono text-sm"
        />
        {error && (
          <p className="text-14-regular text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="shad-primary-btn inline-flex min-h-[44px] items-center justify-center rounded-md px-6 py-3 text-16-semibold whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-dark-300 disabled:opacity-70"
      >
        {loading ? "Opening…" : "Go to dashboard"}
      </button>
    </div>
  );
}
