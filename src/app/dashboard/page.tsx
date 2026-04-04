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

      if (sub && sub.status === "active" && new Date(sub.current_period_end) > new Date()) {
        setStatus("pro");
      } else {
        setStatus("free");
      }
    }

    load();
  }, [router]);

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
            <div className="inline-block rounded-full bg-[#6366f1]/20 px-3 py-1 text-xs font-semibold text-[#6366f1] mb-4">
              Pro
            </div>
            <h1 className="text-2xl font-bold text-white">
              You&apos;re all set!
            </h1>
            <p className="mt-2 text-sm text-[#666]">{email}</p>
            <p className="mt-4 text-[#888] leading-relaxed">
              You have full access to Bite Pro — 200 summaries per day and unlimited chat.
              Head to your Chrome extension and start biting.
            </p>
            <a
              href="https://chrome.google.com/webstore/detail/nejgdcmbmkfdpkpflcjiabdbjfjghnfn"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-lg bg-[#6366f1] px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Go Bite Something
            </a>
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
