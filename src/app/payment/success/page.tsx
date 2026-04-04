import Link from "next/link";
import { Mascot } from "@/components/mascot";

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Mascot size={100} />
        </div>
        <h1 className="text-2xl font-bold text-white">You&apos;re all set!</h1>
        <p className="mt-4 text-[#888] leading-relaxed">
          Welcome to Bite Pro. Your subscription is active and you now have
          access to 200 summaries per day and unlimited follow-up chat.
        </p>
        <p className="mt-6 text-sm text-[#666]">
          Head back to your Chrome extension to start biting.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="rounded-lg border border-[#333] px-6 py-3 text-sm font-semibold text-[#ccc] transition-all hover:border-[#555] hover:text-white"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
