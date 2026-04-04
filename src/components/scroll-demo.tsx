"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function ScrollDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const elHeight = el.offsetHeight;
      const windowH = window.innerHeight;

      const scrolledInto = -rect.top;
      const scrollableRange = elHeight - windowH;

      if (scrollableRange <= 0) return;

      const raw = scrolledInto / scrollableRange;
      setProgress(Math.max(0, Math.min(1, raw)));
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bite panel slides in from 68% to 100% visible
  const panelProgress = Math.max(0, Math.min(1, progress / 0.85));
  const visiblePercent = 68 + panelProgress * 32;
  const glowOpacity = Math.min(panelProgress * 1.5, 0.6);

  return (
    <div ref={containerRef} style={{ height: "250vh" }}>
      <div className="sticky top-12" style={{ height: "calc(100vh - 48px)" }}>
        <div className="flex h-full flex-col items-center justify-center px-4">
          <div
            className="relative w-full overflow-hidden rounded-xl border border-[#2a2a4a] shadow-2xl shadow-black/50"
            style={{ maxHeight: "calc(100vh - 100px)" }}
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: "3018/1646" }}>
              <div
                className="absolute inset-0"
                style={{
                  width: `${(100 / visiblePercent) * 100}%`,
                  clipPath: `inset(0 ${100 - visiblePercent}% 0 0)`,
                }}
              >
                <Image
                  src="/demo-full.png"
                  alt="YouTube video with Bite extension summarizing Joe Rogan Experience podcast with Elon Musk"
                  fill
                  className="object-cover object-left-top"
                  priority
                />
              </div>

              {/* Glow on panel edge */}
              {panelProgress > 0.05 && (
                <div
                  className="pointer-events-none absolute top-0 bottom-0 w-8"
                  style={{
                    right: `${100 - visiblePercent}%`,
                    background: `linear-gradient(to right, transparent, rgba(99, 102, 241, ${glowOpacity * 0.3}), transparent)`,
                  }}
                />
              )}
            </div>
          </div>

          {/* Scroll hint */}
          <div
            className="mt-4 text-center text-xs text-[#444] transition-opacity duration-500"
            style={{ opacity: progress < 0.08 ? 1 : 0 }}
          >
            ↓ Scroll to see the magic
          </div>
        </div>
      </div>
    </div>
  );
}
