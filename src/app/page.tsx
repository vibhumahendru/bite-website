import Link from "next/link";
import Image from "next/image";
import { Mascot } from "@/components/mascot";
import { ScrollDemo } from "@/components/scroll-demo";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-6">
          <Mascot size={100} />
        </div>
        <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight max-w-2xl">
          Stop reading everything.
          <br />
          <span className="text-[#6366f1]">Start biting.</span>
        </h1>
        <p className="mt-6 max-w-lg text-lg text-[#888] leading-relaxed">
          Bite turns any webpage or YouTube video into a concise summary with key
          insights — in seconds, directly from your browser.
        </p>
        <p className="mt-5 text-sm font-medium text-[#22c55e]">
          Start your free 7-day trial
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <a
            href="https://chromewebstore.google.com/detail/nejgdcmbmkfdpkpflcjiabdbjfjghnfn"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#6366f1] px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 inline-flex items-center gap-2"
          >
            <Image src="/chrome.png" alt="" width={18} height={18} />
            Get the Extension
          </a>
          <Link
            href="/pricing"
            className="rounded-lg border border-[#333] px-8 py-3 text-sm font-semibold text-[#ccc] transition-all hover:border-[#555] hover:text-white"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Interactive Demo — YouTube with Bite panel sliding in */}
      <section className="border-t border-[#2a2a4a] py-20">
        <h2 className="mb-6 text-center text-4xl sm:text-5xl font-bold text-white px-6">
          Here&apos;s how it works
        </h2>
        <div className="mx-auto mb-10 w-16 border-t border-[#333]" />
        <h3 className="mb-2 text-center text-2xl sm:text-3xl font-bold text-white px-6">
          YouTube video too long? <span className="text-[#6366f1]">Bite it.</span>
        </h3>
        <p className="mb-8 text-center text-[#888] max-w-lg mx-auto px-6">
          That 3-hour podcast or lecture you keep putting off? Get every key insight,
          argument, and takeaway in seconds — not hours.
        </p>
        <ScrollDemo />
      </section>

      {/* Showcase: Economist — long articles */}
      <section className="border-t border-[#2a2a4a] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center text-2xl sm:text-3xl font-bold text-white leading-tight">
            Article too long? <span className="text-[#6366f1]">Bite it.</span>
          </h2>
          <p className="mb-10 text-center text-[#888] max-w-lg mx-auto">
            That 3,000-word investigative piece you bookmarked but never read?
            Get the key facts, figures, and conclusions in 10 seconds instead of 15 minutes.
          </p>
          <div className="relative rounded-xl overflow-hidden border border-[#2a2a4a] shadow-2xl shadow-black/50">
            <Image
              src="/demo-economist.png"
              alt="The Economist article summarized by Bite extension"
              width={1800}
              height={1000}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Showcase: Booking.com — chat with any page */}
      <section className="border-t border-[#2a2a4a] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center text-2xl sm:text-3xl font-bold text-white leading-tight">
            Chat to <span className="text-[#6366f1]">dig deeper.</span>
          </h2>
          <p className="mb-10 text-center text-[#888] max-w-lg mx-auto">
            Don&apos;t just read the summary — ask follow-up questions. Get specific
            answers from the page without re-reading or scrolling through everything.
          </p>
          <div className="relative rounded-xl overflow-hidden border border-[#2a2a4a] shadow-2xl shadow-black/50">
            <Image
              src="/demo-booking.png"
              alt="Booking.com page with Bite chat answering questions about hotels"
              width={1800}
              height={1000}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Showcase: Panels — summary + chat close-up */}
      <section className="border-t border-[#2a2a4a] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center text-2xl sm:text-3xl font-bold text-white leading-tight">
            Summaries & chat, <span className="text-[#6366f1]">side by side.</span>
          </h2>
          <p className="mb-10 text-center text-[#888] max-w-lg mx-auto">
            Every bite gives you a structured summary with key insights, a TL;DR,
            and the ability to ask follow-up questions — all in one clean panel.
          </p>
          <div className="relative rounded-xl overflow-hidden border border-[#2a2a4a] shadow-2xl shadow-black/50">
            <Image
              src="/demo-panels.png"
              alt="Bite extension showing summary and chat panels"
              width={1800}
              height={1000}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* How it works steps */}
      <section className="border-t border-[#2a2a4a] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl sm:text-3xl font-bold text-white">
            Three steps. That&apos;s it.
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <FeatureCard
              step="1"
              title="Bite any page"
              description="Click the Bite icon, hit 'Bite This Page' on any webpage or YouTube video, and get a structured summary instantly."
            />
            <FeatureCard
              step="2"
              title="Chat with it"
              description="Ask follow-up questions about the content. Get specific answers without re-reading or re-watching anything."
            />
            <FeatureCard
              step="3"
              title="Full history"
              description="Every page you bite is saved. Come back anytime to revisit summaries and pick up conversations where you left off."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2a2a4a] px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Ready to save hours of reading?
        </h2>
        <p className="mt-3 text-[#888]">
          7-day free trial. No credit card required.
        </p>
        <a
          href="https://chromewebstore.google.com/detail/nejgdcmbmkfdpkpflcjiabdbjfjghnfn"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-lg bg-[#22c55e] px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Get Biting — It&apos;s Free
        </a>
      </section>
    </div>
  );
}

function FeatureCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[#2a2a4a] bg-[#16213e] p-6 text-center">
      <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#6366f1]/20 text-[#6366f1] font-bold text-sm">
        {step}
      </div>
      <h3 className="mb-2 text-base font-bold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-[#888]">{description}</p>
    </div>
  );
}
