import { ImageResponse } from "next/og";
import { AUTHOR_NAME } from "./seo";

export const alt = "Krennt Craven — Full-Stack & Cloud Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social share card. Kept to system fonts + solid/gradient fills so it
// generates reliably at build time without fetching external font files.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(1000px 600px at 80% -10%, #2a2350 0%, transparent 60%)",
          padding: "72px 80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #6c5ce7, #a29bfe)",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            KC
          </div>
          <div style={{ fontSize: 26, color: "#c7c7c7", fontWeight: 500 }}>
            krenntcraven.com
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            {AUTHOR_NAME}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 40,
              fontWeight: 600,
              background: "linear-gradient(90deg, #a29bfe, #6c5ce7)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Full-Stack &amp; Cloud Engineer
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#a3a3a3",
              maxWidth: 920,
              lineHeight: 1.35,
            }}
          >
            Building scalable, cloud-native systems — reliable from first commit
            to production.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            fontSize: 24,
            color: "#8f8f8f",
          }}
        >
          <span>React</span>
          <span>·</span>
          <span>Next.js</span>
          <span>·</span>
          <span>Node.js</span>
          <span>·</span>
          <span>AWS</span>
          <span>·</span>
          <span>TypeScript</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
