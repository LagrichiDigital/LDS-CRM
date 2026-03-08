"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { loginWithAppwriteAuth } from "@/lib/actions/admin-auth.actions";

export function AdminLoginForm({ errorFromUrl }: { errorFromUrl?: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const displayError = errorFromUrl ? decodeURIComponent(errorFromUrl) : error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await loginWithAppwriteAuth(username, password);
    if (result && "error" in result) {
      setError(result.error);
      setLoading(false);
    } else if (result && "redirectTo" in result) {
      window.location.href = result.redirectTo;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <label className="text-14-medium text-dark-700">Username</label>
        <Input
          type="text"
          name="username"
          placeholder="Your username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          disabled={loading}
          className="shad-input"
          autoComplete="username"
        />
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-14-medium text-dark-700">Password</label>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          disabled={loading}
          className="shad-input"
          autoComplete="current-password"
        />
      </div>
      {displayError && (
        <p className="text-14-regular text-red-400" role="alert">
          {displayError}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="shad-primary-btn inline-flex min-h-[44px] items-center justify-center rounded-md px-6 py-3 text-16-semibold whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-dark-300 disabled:opacity-70"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
