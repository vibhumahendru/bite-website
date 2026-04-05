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

      // Start progress when the container top is 60% down the viewport
      // (i.e. user starts seeing the image), finish at end of scroll range
      const startOffset = windowH * 0.6;
      const scrolledInto = -(rect.top - startOffset);
      const scrollableRange = elHeight - windowH + startOffset;

      if (scrollableRange <= 0) return;

      const raw = scrolledInto / scrollableRange;
      setProgress(Math.max(0, Math.min(1, raw)));
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const panelProgress = Math.max(0, Math.min(1, progress / 0.85));
  // YouTube shrinks from 100% to 62% width, panel takes the remaining 38%
  const panelWidthPercent = 38;
  const ytWidth = 100 - panelProgress * panelWidthPercent; // 100% -> 62%
  const glowOpacity = Math.min(panelProgress * 1.5, 0.6);

  return (
    <div ref={containerRef} style={{ height: "250vh" }}>
      <div className="sticky top-12" style={{ height: "calc(100vh - 48px)" }}>
        <div className="flex h-full flex-col items-center justify-center px-4">
          <div
            className="relative w-full overflow-hidden rounded-xl border border-[#2a2a4a] shadow-2xl shadow-black/50"
            style={{ maxWidth: "1100px", maxHeight: "calc(100vh - 100px)" }}
          >
            <div className="relative flex" style={{ aspectRatio: "16/10" }}>
              {/* YouTube page — shrinks as panel slides in */}
              <div
                className="relative h-full shrink-0 overflow-hidden"
                style={{ width: `${ytWidth}%` }}
              >
                <Image
                  src="/demo-yt.png"
                  alt="YouTube video page showing Joe Rogan Experience with Elon Musk"
                  fill
                  className="object-cover object-left-top"
                  priority
                />
              </div>

              {/* Bite panel — grows in from the right */}
              <div
                className="relative h-full shrink-0 overflow-hidden"
                style={{ width: `${panelWidthPercent}%` }}
              >
                {/* Glow on panel edge */}
                {panelProgress > 0.05 && (
                  <div
                    className="pointer-events-none absolute top-0 bottom-0 left-0 w-4 z-10 -translate-x-1/2"
                    style={{
                      background: `linear-gradient(to right, transparent, rgba(99, 102, 241, ${glowOpacity * 0.4}))`,
                    }}
                  />
                )}
                <Image
                  src="/demo-panel.png"
                  alt="Bite extension panel showing summary"
                  fill
                  className="object-cover object-left-top"
                />
              </div>
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
