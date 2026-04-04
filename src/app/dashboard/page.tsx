"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Mascot } from "@/components/mascot";

type SubStatus = "pro" | "free" | "loading";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubStatus>("loading");
  const [billingLoading, setBillingLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [periodEnd, setPeriodEnd] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      setEmail(user.email || "");

      // Check subscription
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status, current_period_end")
        .eq("user_id", user.id)
        .single();

      if (sub && (sub.status === "active" || sub.status === "cancelled") && new Date(sub.current_period_end) > new Date()) {
        setStatus("pro");
        if (sub.status === "cancelled") {
          setCancelled(true);
          setPeriodEnd(new Date(sub.current_period_end).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
        }
      } else {
        setStatus("free");
      }
    }

    load();
  }, [router]);

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

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="text-[#666] text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <Mascot size={80} />
        </div>

        {status === "pro" ? (
          <>
            <div className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-[#d4a017] mb-4" style={{ background: "linear-gradient(135deg, rgba(212,160,23,0.2), rgba(245,197,66,0.15))", border: "1px solid rgba(212,160,23,0.3)" }}>
              Pro
            </div>
            <h1 className="text-2xl font-bold text-white">
              You&apos;re all set!
            </h1>
            <p className="mt-2 text-sm text-[#666]">{email}</p>
            {cancelled && (
              <div className="mt-4 rounded-lg border border-[#d4a017]/30 bg-[#d4a017]/10 px-4 py-3 text-sm text-[#d4a017]">
                Your subscription has been cancelled and will end on {periodEnd}.
              </div>
            )}
            <p className="mt-4 text-[#888] leading-relaxed">
              You have full access to Bite Pro — 200 summaries per day and unlimited chat.
              Head to your Chrome extension and start biting.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://chrome.google.com/webstore/detail/nejgdcmbmkfdpkpflcjiabdbjfjghnfn"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#6366f1] px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Go Bite Something
              </a>
              <button
                onClick={handleManageBilling}
                disabled={billingLoading}
                className="rounded-lg border border-[#333] px-8 py-3 text-sm font-semibold text-[#ccc] transition-all hover:border-[#555] hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {billingLoading ? "Loading..." : "Manage Billing"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="inline-block rounded-full bg-[#333]/50 px-3 py-1 text-xs font-semibold text-[#888] mb-4">
              Free Tier
            </div>
            <h1 className="text-2xl font-bold text-white">
              Welcome to Bite!
            </h1>
            <p className="mt-2 text-sm text-[#666]">{email}</p>
            <p className="mt-4 text-[#888] leading-relaxed">
              You&apos;re on the free tier — 3 summaries per day.
              Head to the Chrome extension to start biting, or upgrade to Pro for 200 summaries
              and unlimited chat.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="rounded-lg bg-[#6366f1] px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Upgrade to Pro
              </Link>
              <a
                href="https://chrome.google.com/webstore/detail/nejgdcmbmkfdpkpflcjiabdbjfjghnfn"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[#333] px-8 py-3 text-sm font-semibold text-[#ccc] transition-all hover:border-[#555] hover:text-white"
              >
                Get the Extension
              </a>
            </div>
          </>
        )}

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/");
          }}
          className="mt-8 text-xs text-[#555] hover:text-[#888] transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
