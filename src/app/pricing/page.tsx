"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function handleSubscribe() {
    if (!user) {
      window.location.href = "/auth?redirect=pricing";
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            "x-user-token": session?.access_token || "",
          },
        }
      );
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center px-6 py-20">
      <h1 className="text-3xl font-bold text-white">Simple pricing</h1>
      <p className="mt-3 text-[#888]">
        One plan. Everything you need. Cancel anytime.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 max-w-2xl w-full">
        {/* Free tier */}
        <div className="rounded-xl border border-[#2a2a4a] bg-[#16213e] p-8">
          <h3 className="text-lg font-bold text-white">Free</h3>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">$0</span>
            <span className="text-[#666]"> / forever</span>
          </div>
          <p className="mt-2 text-sm text-[#888]">After your 7-day trial</p>
          <ul className="mt-6 space-y-3 text-sm text-[#ccc]">
            <li className="flex items-start gap-2">
              <span className="text-[#22c55e] mt-0.5">&#10003;</span>
              3 summaries per day
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#22c55e] mt-0.5">&#10003;</span>
              Access to past summaries
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#555] mt-0.5">&#10007;</span>
              <span className="text-[#555]">Follow-up chat</span>
            </li>
          </ul>
        </div>

        {/* Pro tier */}
        <div className="relative rounded-xl border-2 border-[#6366f1] bg-[#16213e] p-8">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#6366f1] px-4 py-1 text-xs font-bold text-white">
            RECOMMENDED
          </div>
          <h3 className="text-lg font-bold text-white">Pro</h3>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">$5</span>
            <span className="text-[#666]"> / month</span>
          </div>
          <p className="mt-2 text-sm text-[#888]">7-day free trial included</p>
          <ul className="mt-6 space-y-3 text-sm text-[#ccc]">
            <li className="flex items-start gap-2">
              <span className="text-[#22c55e] mt-0.5">&#10003;</span>
              200 summaries per day
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#22c55e] mt-0.5">&#10003;</span>
              Unlimited follow-up chat
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#22c55e] mt-0.5">&#10003;</span>
              Full history with chat restore
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#22c55e] mt-0.5">&#10003;</span>
              Priority support
            </li>
          </ul>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-[#6366f1] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Redirecting to Stripe..." : "Subscribe to Pro"}
          </button>
          {error && (
            <p className="mt-3 text-xs text-[#ef4444] text-center">{error}</p>
          )}
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-[#555]">
        <p>All plans include a 7-day free trial with 20 summaries/day + unlimited chat.</p>
        <p className="mt-1">No credit card required to start. Cancel anytime.</p>
      </div>
    </div>
  );
}
