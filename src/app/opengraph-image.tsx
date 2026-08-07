import { ImageResponse } from "next/og";

export const alt =
  "Luna1 Research — Independent research across public markets, capital allocation, and real assets";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#090b10",
          color: "#e5e7eb",
          padding: "74px 78px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "70%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "5px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "32px",
                borderLeft: "2px solid #3b82f6",
                borderRight: "2px solid #3b82f6",
                transform: "skew(-20deg)",
              }}
            />
            LUNA1 RESEARCH
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: "#f59e0b",
                fontSize: "15px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              Independent investment research
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "Georgia, serif",
                fontSize: "62px",
                lineHeight: 1.03,
                letterSpacing: "-2px",
              }}
            >
              <span>Public markets.</span>
              <span>Capital allocation.</span>
              <span>Real assets.</span>
            </div>
          </div>
          <div style={{ fontSize: "16px", color: "#9ca3af" }}>
            Discipline · Evidence · Continuous improvement
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: "90px",
            top: "122px",
            width: "235px",
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "180px",
              height: "230px",
              border: "2px solid #3b82f6",
              transform: "rotate(30deg) skew(-14deg)",
              opacity: 0.8,
            }}
          />
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#f59e0b",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "116px",
              top: "145px",
              width: "190px",
              height: "1px",
              background: "#22d3ee",
              transform: "rotate(-13deg)",
              transformOrigin: "left",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "116px",
              top: "150px",
              width: "205px",
              height: "1px",
              background: "#3b82f6",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "116px",
              top: "155px",
              width: "190px",
              height: "1px",
              background: "#f59e0b",
              transform: "rotate(13deg)",
              transformOrigin: "left",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: "78px",
            right: "78px",
            top: "66px",
            height: "1px",
            background: "#2a303b",
          }}
        />
      </div>
    ),
    size,
  );
}
