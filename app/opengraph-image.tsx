import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "TBO Academy — Educação para o mercado imobiliário";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          backgroundImage: "linear-gradient(135deg, #02261C 0%, #02150f 100%)",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#BAF241",
            }}
          />
          <div
            style={{
              fontSize: "30px",
              letterSpacing: "6px",
              textTransform: "uppercase",
              color: "#BAF241",
              fontWeight: 600,
            }}
          >
            Academy
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "118px",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.02,
            letterSpacing: "-3px",
          }}
        >
          TBO Academy
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "32px",
            fontSize: "40px",
            color: "rgba(255,255,255,0.78)",
            fontWeight: 400,
          }}
        >
          Educação para o mercado imobiliário
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "56px",
            width: "180px",
            height: "8px",
            borderRadius: "999px",
            backgroundColor: "#BAF241",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
