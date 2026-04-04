"use client";

import { useEffect, useRef } from "react";

interface MascotProps {
  size?: number;
  className?: string;
}

export function Mascot({ size = 80, className = "" }: MascotProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const crumbsRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const stage = stageRef.current;
    if (!stage) return;

    const $ = (id: string) => stage.querySelector(`#${id}`) as SVGElement | null;

    const els = {
      bodyGroup: $("body-group"),
      headGroup: $("head-group"),
      armL: $("arm-left"),
      armR: $("arm-right"),
      pupilL: $("pupil-left"),
      pupilR: $("pupil-right"),
      eyeL: $("eye-left"),
      eyeR: $("eye-right"),
      smile: $("smile"),
      mouthHole: $("mouth-hole"),
      tongue: $("tongue"),
      tongueTip: $("tongue-tip"),
      teethTop: $("teeth-top"),
      teethBottom: $("teeth-bottom"),
    };

    const crumbs = crumbsRef.current;

    function resetPose() {
      els.bodyGroup?.setAttribute("transform", "translate(150, 160)");
      els.headGroup?.setAttribute("transform", "");
      els.armL?.querySelector("rect")?.setAttribute("transform", "rotate(-10)");
      els.armR?.querySelector("rect")?.setAttribute("transform", "rotate(10)");
      els.eyeL?.setAttribute("height", "32");
      els.eyeR?.setAttribute("height", "32");
      els.pupilL?.setAttribute("r", "8");
      els.pupilR?.setAttribute("r", "8");
      els.pupilL?.setAttribute("cy", "-57");
      els.pupilR?.setAttribute("cy", "-57");
      els.pupilL?.setAttribute("cx", "-34");
      els.pupilR?.setAttribute("cx", "34");
      if (els.pupilL) els.pupilL.style.display = "";
      if (els.pupilR) els.pupilR.style.display = "";
      if (els.smile) els.smile.style.display = "";
      els.smile?.setAttribute("d", "M-25,18 Q0,38 25,18");
      setMouth(0);
      if (els.teethTop) els.teethTop.style.display = "none";
    }

    function stop() {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = null;
      resetPose();
    }

    function setMouth(openAmount: number) {
      if (openAmount < 1) {
        els.mouthHole?.setAttribute("height", "0");
        els.tongue?.setAttribute("ry", "0");
        els.tongueTip?.setAttribute("ry", "0");
        if (els.smile) els.smile.style.display = "";
        if (els.teethTop) els.teethTop.style.display = "none";
        return;
      }
      if (els.smile) els.smile.style.display = "none";
      if (els.teethTop) els.teethTop.style.display = "";
      const h = openAmount;
      const y = 10;
      els.mouthHole?.setAttribute("y", String(y));
      els.mouthHole?.setAttribute("height", String(h));
      els.mouthHole?.setAttribute("rx", String(Math.min(h / 2, 12)));
      const tongueY = y + h * 0.55;
      const tongueRy = Math.min(h * 0.35, 16);
      els.tongue?.setAttribute("cy", String(tongueY));
      els.tongue?.setAttribute("ry", String(tongueRy));
      els.tongue?.setAttribute("rx", String(Math.min(22, 20 + h * 0.1)));
      const tipY = y + h * 0.75;
      const tipRy = Math.min(h * 0.2, 9);
      els.tongueTip?.setAttribute("cy", String(tipY));
      els.tongueTip?.setAttribute("ry", String(tipRy));
      els.teethTop?.querySelectorAll("polygon").forEach((tri, i) => {
        const baseY = y;
        const tipLen = Math.min(h * 0.4, 14);
        const cx = [-22, -2, 22][i];
        const hw = 8;
        tri.setAttribute("points", `${cx - hw},${baseY} ${cx},${baseY + tipLen} ${cx + hw},${baseY}`);
      });
      const bottomY = y + h;
      let bHtml = "";
      if (h > 12) {
        const tipLen = Math.min(h * 0.35, 12);
        [-14, 8, 28].forEach((cx) => {
          bHtml += `<polygon points="${cx - 7},${bottomY} ${cx},${bottomY - tipLen} ${cx + 7},${bottomY}" fill="white" stroke="#E8E4F0" stroke-width="0.8"/>`;
        });
      }
      if (els.teethBottom) els.teethBottom.innerHTML = bHtml;
    }

    function blink() {
      els.eyeL?.setAttribute("height", "4");
      els.eyeR?.setAttribute("height", "4");
      els.pupilL?.setAttribute("r", "2");
      els.pupilR?.setAttribute("r", "2");
      setTimeout(() => {
        els.eyeL?.setAttribute("height", "32");
        els.eyeR?.setAttribute("height", "32");
        els.pupilL?.setAttribute("r", "8");
        els.pupilR?.setAttribute("r", "8");
      }, 120);
    }

    function spawnCrumbs(count: number) {
      if (!crumbs) return;
      const colors = ["#FFD93D", "#FF6B6B", "#6BCB77", "#4D96FF", "#FF8B3D", "#C084FC", "#FF4757"];
      for (let i = 0; i < count; i++) {
        const crumb = document.createElement("div");
        const sz = 2 + Math.random() * 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const startX = 28 + Math.random() * 24;
        const startY = 52;
        const dx = (Math.random() - 0.5) * 50;
        const dy = 10 + Math.random() * 30;
        const rot = Math.random() * 360;
        crumb.style.cssText = `position:absolute;left:${startX}px;top:${startY}px;width:${sz}px;height:${sz}px;background:${color};border-radius:${Math.random() > 0.4 ? "2px" : "50%"};transition:all ${0.5 + Math.random() * 0.5}s cubic-bezier(.2,.8,.3,1);opacity:1;transform:rotate(0deg);pointer-events:none;`;
        crumbs.appendChild(crumb);
        requestAnimationFrame(() => {
          crumb.style.left = startX + dx + "px";
          crumb.style.top = startY + dy + "px";
          crumb.style.opacity = "0";
          crumb.style.transform = `rotate(${rot}deg) scale(0.2)`;
        });
        setTimeout(() => crumb.remove(), 1100);
      }
    }

    // --- ANIMATIONS ---
    function doIdle(duration: number, onDone: () => void) {
      stop();
      let t = 0, blinkT = 0;
      const startTime = Date.now();
      function tick() {
        if (!mountedRef.current) return;
        t += 0.04;
        blinkT++;
        const bobY = Math.sin(t) * 3;
        const tilt = Math.sin(t * 0.6) * 1.2;
        els.bodyGroup?.setAttribute("transform", `translate(150, ${160 + bobY}) rotate(${tilt})`);
        els.pupilL?.setAttribute("cx", String(-34 + Math.sin(t * 0.4) * 3));
        els.pupilR?.setAttribute("cx", String(34 + Math.sin(t * 0.4) * 3));
        const sb = Math.sin(t * 1.2) * 2;
        els.smile?.setAttribute("d", `M-25,18 Q0,${38 + sb} 25,18`);
        if (blinkT % 85 === 0) blink();
        if (Date.now() - startTime > duration) { onDone(); return; }
        animRef.current = requestAnimationFrame(tick);
      }
      tick();
    }

    function doBite(onDone: () => void) {
      stop();
      let phase = 0, t = 0;
      function tick() {
        if (!mountedRef.current) return;
        t++;
        if (phase === 0) {
          const p = Math.min(t / 14, 1);
          const ease = p * (2 - p);
          setMouth(ease * 45);
          els.pupilL?.setAttribute("r", String(8 + ease * 2));
          els.pupilR?.setAttribute("r", String(8 + ease * 2));
          els.pupilL?.setAttribute("cy", String(-57 + ease * 5));
          els.pupilR?.setAttribute("cy", String(-57 + ease * 5));
          els.tongue?.setAttribute("cx", String(Math.sin(t * 0.4) * 3));
          els.tongueTip?.setAttribute("cx", String(Math.sin(t * 0.4) * 4));
          if (t >= 18) { phase = 1; t = 0; }
        } else if (phase === 1) {
          const p = Math.min(t / 4, 1);
          setMouth(45 * (1 - p));
          if (p >= 0.4 && p < 0.6) spawnCrumbs(8);
          if (t >= 5) { setMouth(0); onDone(); return; }
        }
        animRef.current = requestAnimationFrame(tick);
      }
      tick();
    }

    function doChew(duration: number, onDone: () => void) {
      stop();
      let t = 0, ct = 0;
      const startTime = Date.now();
      function tick() {
        if (!mountedRef.current) return;
        t += 0.06;
        ct++;
        const chew = Math.sin(t * 1.8);
        const openAmt = 12 + Math.abs(chew) * 18;
        const side = chew * 4;
        setMouth(openAmt);
        els.tongue?.setAttribute("cx", String(side * 2));
        els.tongueTip?.setAttribute("cx", String(side * 2.5));
        els.bodyGroup?.setAttribute("transform", `translate(150, ${160 + Math.abs(chew) * 1.5})`);
        els.pupilL?.setAttribute("cx", String(-34 + side));
        els.pupilR?.setAttribute("cx", String(34 + side));
        els.armL?.querySelector("rect")?.setAttribute("transform", `rotate(${-10 + Math.sin(t * 1.8) * 10})`);
        els.armR?.querySelector("rect")?.setAttribute("transform", `rotate(${10 - Math.sin(t * 1.8) * 10})`);
        if (ct % 18 === 0) spawnCrumbs(3);
        if (ct % 50 === 0) blink();
        if (Date.now() - startTime > duration) { onDone(); return; }
        animRef.current = requestAnimationFrame(tick);
      }
      tick();
    }

    function doHappy(onDone: () => void) {
      stop();
      let t = 0;
      function tick() {
        if (!mountedRef.current) return;
        t += 0.08;
        const jump = Math.abs(Math.sin(t * 2)) * 18;
        const wiggle = Math.sin(t * 4) * 6;
        els.bodyGroup?.setAttribute("transform", `translate(150, ${160 - jump}) rotate(${wiggle})`);
        els.eyeL?.setAttribute("height", "14");
        els.eyeR?.setAttribute("height", "14");
        els.pupilL?.setAttribute("r", "4");
        els.pupilR?.setAttribute("r", "4");
        const sw = 28 + Math.sin(t * 3) * 4;
        els.smile?.setAttribute("d", `M-${sw},15 Q0,${42 + Math.sin(t * 3) * 3} ${sw},15`);
        els.armL?.querySelector("rect")?.setAttribute("transform", `rotate(${-10 - Math.sin(t * 3) * 30})`);
        els.armR?.querySelector("rect")?.setAttribute("transform", `rotate(${10 + Math.sin(t * 3) * 30})`);
        if (t > 4) { onDone(); return; }
        animRef.current = requestAnimationFrame(tick);
      }
      tick();
    }

    // Cycle: idle → bite → chew → happy → repeat
    function cycle() {
      if (!mountedRef.current) return;
      doIdle(3000, () => {
        if (!mountedRef.current) return;
        doBite(() => {
          if (!mountedRef.current) return;
          doChew(2500, () => {
            if (!mountedRef.current) return;
            doHappy(() => {
              if (!mountedRef.current) return;
              cycle();
            });
          });
        });
      });
    }

    cycle();

    return () => {
      mountedRef.current = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const viewScale = size / 80;

  return (
    <div
      ref={stageRef}
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size * 1.125,
        display: "inline-block",
      }}
    >
      <svg
        width={size}
        height={size * 1.125}
        viewBox="0 0 300 340"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="head-clip-web">
            <rect x="-72" y="-95" width="144" height="155" rx="18" />
          </clipPath>
        </defs>
        <g id="body-group" transform="translate(150, 160)">
          <rect x="-55" y="60" width="38" height="24" rx="6" fill="#5B4DD6" stroke="#4A3DB5" strokeWidth="1.5" />
          <rect x="17" y="60" width="38" height="24" rx="6" fill="#5B4DD6" stroke="#4A3DB5" strokeWidth="1.5" />
          <g id="arm-left" transform="translate(-68, 20)">
            <rect x="-26" y="-7" width="26" height="14" rx="7" fill="#6C5CE7" stroke="#4A3DB5" strokeWidth="1.5" transform="rotate(-10)" />
          </g>
          <g id="arm-right" transform="translate(68, 20)">
            <rect x="0" y="-7" width="26" height="14" rx="7" fill="#6C5CE7" stroke="#4A3DB5" strokeWidth="1.5" transform="rotate(10)" />
          </g>
          <g id="head-group">
            <rect x="-72" y="-95" width="144" height="155" rx="18" fill="#7C6FF0" stroke="#4A3DB5" strokeWidth="2.5" />
            <g clipPath="url(#head-clip-web)">
              <rect id="mouth-hole" x="-45" y="10" width="90" height="0" rx="6" fill="#2D1554" />
              <ellipse id="tongue" cx="0" cy="10" rx="22" ry="0" fill="#FF4757" />
              <ellipse id="tongue-tip" cx="0" cy="10" rx="14" ry="0" fill="#FF6B7A" />
              <g id="teeth-top" style={{ display: "none" }}>
                <polygon points="-30,10 -22,24 -14,10" fill="white" stroke="#E8E4F0" strokeWidth="0.8" />
                <polygon points="-10,10 -2,24 6,10" fill="white" stroke="#E8E4F0" strokeWidth="0.8" />
                <polygon points="14,10 22,24 30,10" fill="white" stroke="#E8E4F0" strokeWidth="0.8" />
              </g>
              <g id="teeth-bottom"></g>
            </g>
            <rect x="-28" y="-112" width="12" height="24" rx="4" fill="#9B8FF5" stroke="#4A3DB5" strokeWidth="1.5" />
            <rect x="16" y="-118" width="12" height="28" rx="4" fill="#9B8FF5" stroke="#4A3DB5" strokeWidth="1.5" />
            <rect id="eye-left" x="-50" y="-75" width="32" height="32" rx="9" fill="white" stroke="#4A3DB5" strokeWidth="1.5" />
            <circle id="pupil-left" cx="-34" cy="-57" r="8" fill="#2D1B69" />
            <circle cx="-31" cy="-62" r="3" fill="white" opacity="0.9" />
            <rect id="eye-right" x="18" y="-75" width="32" height="32" rx="9" fill="white" stroke="#4A3DB5" strokeWidth="1.5" />
            <circle id="pupil-right" cx="34" cy="-57" r="8" fill="#2D1B69" />
            <circle cx="37" cy="-62" r="3" fill="white" opacity="0.9" />
            <path id="smile" d="M-25,18 Q0,38 25,18" fill="none" stroke="#4A3DB5" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>
      </svg>
      <div
        ref={crumbsRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "visible",
        }}
      />
    </div>
  );
}
