"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mascot } from "@/components/mascot";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"request" | "update" | "loading">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if we arrived here via a recovery link (Supabase sets session automatically)
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("update");
      }
    });

    // If no recovery event fires within 1s, show the request form
    const timeout = setTimeout(() => {
      setMode((prev) => (prev === "loading" ? "request" : prev));
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Enter your email address");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Check your email for a password reset link.");
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password updated! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  }

  if (mode === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="text-sm text-[#666]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Mascot size={64} />
          </div>
          <h1 className="text-xl font-bold text-white">
            {mode === "request" ? "Forgot your password?" : "Set a new password"}
          </h1>
          <p className="mt-1 text-sm text-[#666]">
            {mode === "request"
              ? "Enter your email and we'll send you a reset link"
              : "Choose a new password for your account"}
          </p>
        </div>

        {mode === "request" ? (
          <form onSubmit={handleRequestReset} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#333] bg-[#1a1a2e] px-4 py-3 text-sm text-white outline-none focus:border-[#6366f1] transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#6366f1] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-3">
            <input
              type="password"
              placeholder="New password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#333] bg-[#1a1a2e] px-4 py-3 text-sm text-white outline-none focus:border-[#6366f1] transition-colors"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-[#333] bg-[#1a1a2e] px-4 py-3 text-sm text-white outline-none focus:border-[#6366f1] transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#6366f1] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-4 text-center text-xs text-[#ef4444]">{error}</p>
        )}
        {success && (
          <p className="mt-4 text-center text-xs text-[#22c55e]">{success}</p>
        )}

        <button
          onClick={() => router.push("/auth")}
          className="mt-4 w-full text-center text-xs text-[#6366f1] hover:underline"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}
