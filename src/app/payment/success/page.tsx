"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Mascot } from "@/components/mascot";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth");
      } else {
        setReady(true);
      }
    });
  }, [router]);

  if (!ready) return null;

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Mascot size={100} />
        </div>
        <div className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-[#d4a017] mb-4" style={{ background: "linear-gradient(135deg, rgba(212,160,23,0.2), rgba(245,197,66,0.15))", border: "1px solid rgba(212,160,23,0.3)" }}>
          Pro
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome to Bite Pro!</h1>
        <p className="mt-4 text-[#888] leading-relaxed">
          You&apos;re all set — 200 summaries per day and unlimited follow-up chat are now unlocked.
          Open the Bite extension in Chrome and start biting.
        </p>
        <div className="mt-8">
          <a
            href="https://chrome.google.com/webstore/detail/nejgdcmbmkfdpkpflcjiabdbjfjghnfn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#6366f1] px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Image src="/chrome.png" alt="" width={18} height={18} />
            Open Bite Extension
          </a>
        </div>
      </div>
    </div>
  );
}
