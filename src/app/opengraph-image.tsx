import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Bite - Summarize any webpage or YouTube video instantly";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0f1a 0%, #16213e 50%, #0f0f1a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Mascot placeholder - simple version */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 24,
            background: "#6366f1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 60,
            marginBottom: 30,
          }}
        >
          <img
            src="https://bite-website-ten.vercel.app/mascot.png"
            width={120}
            height={120}
            style={{ borderRadius: 24 }}
          />
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: 16,
          }}
        >
          Bite
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#888888",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Summarize any webpage or YouTube video instantly.
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#6366f1",
            marginTop: 20,
          }}
        >
          Chrome Extension
        </div>
      </div>
    ),
    { ...size }
  );
}
