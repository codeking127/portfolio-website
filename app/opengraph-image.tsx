import { ImageResponse } from "next/og";

// The picture shown when the site's link is shared (WhatsApp, LinkedIn, iMessage, X, Slack...).
// It is drawn from the site's own look: dark wallpaper, a Mac-style menu bar, my name and the paper crane.

export const alt = "Aryan Jain · Software engineer at HSBC";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// the crane from the hero, as [points, colour] facets in a 200×140 box
const CRANE: [string, string][] = [
  ["102,64 182,77 117,88", "#2a77ab"],
  ["84,86 55,11 89,91", "#92d2f3"],
  ["89,91 55,11 95,94", "#3f9cd3"],
  ["113,92 158,29 119,90", "#63bbe8"],
  ["119,90 158,29 126,88", "#3f9cd3"],
  ["150,38 159,28 187,53", "#63bbe8"],
  ["150,38 187,53 155,43", "#2a77ab"],
  ["100,50 79,90 102,102", "#63bbe8"],
  ["100,50 125,90 102,102", "#2a77ab"],
  ["100,50 91,76 104,79", "#c4e9fb"],
  ["96,72 14,115 104,86", "#c4e9fb"],
  ["104,86 14,115 111,100", "#63bbe8"],
];

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #161a2b 0%, #221a2e 100%)",
          color: "#eef0f4",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* faint folded-paper facets, like the site's wallpaper */}
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
          <polygon points="0,0 420,0 140,300" fill="#9aa8ff" opacity="0.10" />
          <polygon points="420,0 860,0 600,280" fill="#9aa8ff" opacity="0.05" />
          <polygon points="860,0 1200,0 1200,380" fill="#9aa8ff" opacity="0.09" />
          <polygon points="140,300 600,280 330,630" fill="#9aa8ff" opacity="0.04" />
          <polygon points="600,280 1200,380 900,630" fill="#9aa8ff" opacity="0.07" />
        </svg>

        {/* Mac-style menu bar */}
        <div style={{ display: "flex", alignItems: "center", height: 52, padding: "0 36px", background: "rgba(35,37,44,.75)", fontSize: 22, gap: 26 }}>
          <span style={{ fontWeight: 700 }}>aryan.os</span>
          <span style={{ color: "#aab0bc" }}>About</span>
          <span style={{ color: "#aab0bc" }}>Code</span>
          <span style={{ color: "#aab0bc" }}>Journey</span>
          <span style={{ marginLeft: "auto", color: "#8c9dff", fontWeight: 600 }}>aryanjain-dev.vercel.app</span>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center", padding: "0 80px" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontSize: 26, color: "#28c08a", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: "#28c08a" }} />
              Hello, world!
            </div>
            <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -5, lineHeight: 0.95, marginTop: 14 }}>Aryan Jain</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26, fontSize: 38, fontWeight: 600 }}>
              Software engineer
              <span style={{ background: "#f7f3ea", color: "#2a3a8f", padding: "2px 16px", borderRadius: "6px 18px 6px 6px", fontSize: 34 }}>@ HSBC</span>
            </div>
            <div style={{ fontSize: 28, color: "#aab0bc", marginTop: 22, maxWidth: 640, lineHeight: 1.4 }}>
              Python automation, a no-code platform used by 100+ people, and a runner, musician and paper folder.
            </div>
          </div>

          <svg width="380" height="266" viewBox="0 0 200 140">
            {CRANE.map(([pts, fill]) => (
              <polygon key={pts} points={pts} fill={fill} stroke="rgba(255,255,255,.35)" strokeWidth="0.5" />
            ))}
          </svg>
        </div>
      </div>
    ),
    size,
  );
}
