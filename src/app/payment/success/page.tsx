import Image from "next/image";
import { Mascot } from "@/components/mascot";

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Mascot size={100} />
        </div>
        <div className="inline-block rounded-full bg-[#6366f1]/20 px-3 py-1 text-xs font-semibold text-[#6366f1] mb-4">
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
