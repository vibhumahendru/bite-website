"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mascot } from "@/components/mascot";

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.push(redirect ? `/${redirect}` : "/dashboard");
      }
    });
  }, [router, redirect]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        // Auto-confirm is on, so user is logged in immediately
        if (signUpData.session) {
          // Send welcome email (fire-and-forget)
          fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            },
            body: JSON.stringify({ type: "welcome", email, name: "" }),
          }).catch(() => {});
          router.push(redirect ? `/${redirect}` : "/dashboard");
          return;
        }
        // Fallback: sign them in directly
        const { error: autoSignInError } = await supabase.auth.signInWithPassword({ email, password });
        if (autoSignInError) throw autoSignInError;
        // Send welcome email (fire-and-forget)
        fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
          body: JSON.stringify({ type: "welcome", email, name: "" }),
        }).catch(() => {});
        router.push(redirect ? `/${redirect}` : "/dashboard");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push(redirect ? `/${redirect}` : "/dashboard");
      }
    } catch (err: any) {
      let msg = err.message || "Something went wrong";
      if (/invalid login/i.test(msg)) msg = "Incorrect email or password";
      if (/already registered/i.test(msg)) msg = "This email is already registered — try signing in";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Mascot size={64} />
          </div>
          <h1 className="text-xl font-bold text-white">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-[#666]">
            Bite-sized summaries for any page
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[#333] bg-[#1a1a2e] px-4 py-3 text-sm text-white outline-none focus:border-[#6366f1] transition-colors"
          />
          <input
            type="password"
            placeholder={isSignUp ? "Password (min 6 characters)" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[#333] bg-[#1a1a2e] px-4 py-3 text-sm text-white outline-none focus:border-[#6366f1] transition-colors"
          />
          {isSignUp && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-[#333] bg-[#1a1a2e] px-4 py-3 text-sm text-white outline-none focus:border-[#6366f1] transition-colors"
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#6366f1] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? isSignUp
                ? "Signing up..."
                : "Signing in..."
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-xs text-[#ef4444]">{error}</p>
        )}
        {success && (
          <p className="mt-4 text-center text-xs text-[#22c55e]">{success}</p>
        )}

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
            setSuccess("");
          }}
          className="mt-4 w-full text-center text-xs text-[#6366f1] hover:underline"
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}
