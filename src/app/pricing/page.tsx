"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type SubState = "loading" | "none" | "pro" | "cancelled";

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [subState, setSubState] = useState<SubState>("loading");
  const [periodEnd, setPeriodEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        setSubState("none");
        return;
      }

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status, current_period_end")
        .eq("user_id", user.id)
        .maybeSingle();

      if (sub && new Date(sub.current_period_end) > new Date()) {
        if (sub.status === "cancelled") {
          setSubState("cancelled");
          setPeriodEnd(new Date(sub.current_period_end).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
        } else if (sub.status === "active") {
          setSubState("pro");
        } else {
          setSubState("none");
        }
      } else {
        setSubState("none");
      }
    }
    load();
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

  async function handleManageBilling() {
    setBillingLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-portal-session`,
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
      console.error("Billing portal error:", err);
    } finally {
      setBillingLoading(false);
    }
  }

  // Determine what the Pro card button should show
  function renderProButton() {
    if (subState === "loading") return null;

    if (subState === "pro") {
      return (
        <div className="mt-8 space-y-3">
          <div className="w-full rounded-lg bg-[#22c55e]/20 py-3 text-sm font-semibold text-[#22c55e] text-center">
            Your current plan
          </div>
          <button
            onClick={handleManageBilling}
            disabled={billingLoading}
            className="w-full rounded-lg border border-[#333] py-3 text-sm font-semibold text-[#ccc] transition-all hover:border-[#555] hover:text-white disabled:opacity-60"
          >
            {billingLoading ? "Loading..." : "Manage Billing"}
          </button>
        </div>
      );
    }

    if (subState === "cancelled") {
      return (
        <div className="mt-8 space-y-3">
          <div className="w-full rounded-lg border border-[#d4a017]/30 bg-[#d4a017]/10 py-3 px-4 text-xs text-[#d4a017] text-center">
            Cancels on {periodEnd}
          </div>
          <button
            onClick={handleManageBilling}
            disabled={billingLoading}
            className="w-full rounded-lg bg-[#6366f1] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {billingLoading ? "Loading..." : "Reactivate Subscription"}
          </button>
        </div>
      );
    }

    return (
      <>
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
      </>
    );
  }

  return (
    <div className="flex flex-col items-center px-6 py-20">
      <h1 className="text-3xl font-bold text-white">Simple pricing</h1>
      <p className="mt-3 text-[#888]">
        One plan. Everything you need. Cancel anytime.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 max-w-2xl w-full">
        {/* Free tier */}
        <div className={`rounded-xl border bg-[#16213e] p-8 ${subState === "none" || subState === "loading" ? "border-[#2a2a4a]" : "border-[#2a2a4a]"}`}>
          <h3 className="text-lg font-bold text-white">Free</h3>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">£0</span>
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
            {subState === "pro" ? "YOUR PLAN" : "RECOMMENDED"}
          </div>
          <h3 className="text-lg font-bold text-white">Pro</h3>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">£5</span>
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
          {renderProButton()}
        </div>
      </div>

      {subState === "none" && (
        <div className="mt-12 text-center text-sm text-[#555]">
          <p>All plans include a 7-day free trial with 20 summaries/day + unlimited chat.</p>
          <p className="mt-1">No credit card required to start. Cancel anytime.</p>
        </div>
      )}
      {subState === "pro" && (
        <div className="mt-12 text-center text-sm text-[#555]">
          <Link href="/dashboard" className="text-[#6366f1] hover:underline">Back to Dashboard</Link>
        </div>
      )}
    </div>
  );
}
