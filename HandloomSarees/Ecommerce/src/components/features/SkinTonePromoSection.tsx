/**
 * SkinTonePromoSection
 * Drop this between <VideoShopping /> and <InstagramGrid /> in HomePage.tsx
 *
 * Usage in HomePage.tsx:
 *   import SkinTonePromoSection from "@/components/features/SkinTonePromoSection";
 *   ...
 *   <VideoShopping />
 *   <GoldenThread />
 *   <SkinTonePromoSection />   <-- add here
 *   <GoldenThread />
 *   <InstagramGrid />
 */

import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const C = {
  maroon: "#800020", maroonDeep: "#5a0016",
  navy: "#1B2A6B", navyDeep: "#0E1A4A",
  gold: "#C4980A", goldVibrant: "#D4AF37",
  cream: "#F5E6D3", creamLight: "#FFF9F0", creamMid: "#F8EEE2",
  warmGrey: "#4a3828", forest: "#14402A",
};

const SKIN_SWATCHES = [
  { hex: "#FDDBB4", label: "Fair" },
  { hex: "#E8B88A", label: "Light" },
  { hex: "#C68642", label: "Medium" },
  { hex: "#8D5524", label: "Tan" },
  { hex: "#4A2912", label: "Deep" },
];

const PALETTE_ROWS = [
  ["#E8453C", "#D4AF37", "#2E8B57", "#4169E1", "#9370DB"],
  ["#FF7F50", "#C4980A", "#14402A", "#800020", "#F2C4CE"],
];

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, on] as const;
}

const CSS = `
@keyframes stpFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes stpSpin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes stpPulse { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
@keyframes stpShimBtn { 0%{left:-80%} 100%{left:120%} }

.stp-btn {
  display:inline-flex; align-items:center; gap:10px; justify-content:center;
  padding:16px 52px;
  background:linear-gradient(135deg,#D4AF37 0%,#b89a0c 100%);
  color:#5a0016;
  font-family:'Josefin Sans',sans-serif; font-size:11px; letter-spacing:.24em;
  font-weight:700; text-transform:uppercase; text-decoration:none;
  transition:transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s;
  box-shadow:0 6px 28px rgba(196,152,10,.38);
  position:relative; overflow:hidden;
}
.stp-btn::after {
  content:''; position:absolute; top:0; left:-80%; width:60%; height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent);
  animation:stpShimBtn 3s ease infinite;
}
.stp-btn:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(196,152,10,.52); }

.stp-swatch-ring {
  width:56px; height:56px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 4px 18px rgba(0,0,0,.18);
  transition:transform .3s, box-shadow .3s;
  cursor:pointer; border:3px solid rgba(255,255,255,.4);
}
.stp-swatch-ring:hover { transform:scale(1.15) translateY(-4px); box-shadow:0 10px 28px rgba(0,0,0,.25); }

.stp-palette-dot {
  width:32px; height:32px; border-radius:50%;
  transition:transform .25s; cursor:default;
  box-shadow:0 2px 8px rgba(0,0,0,.18);
}
.stp-palette-dot:hover { transform:scale(1.25); }

.stp-feature {
  display:flex; align-items:flex-start; gap:14px;
  padding:20px; background:rgba(255,249,240,.7);
  border:1px solid rgba(196,152,10,.20);
  transition:border-color .3s, background .3s, transform .3s;
}
.stp-feature:hover { border-color:rgba(196,152,10,.45); background:rgba(255,249,240,.95); transform:translateY(-2px); }

.stp-rv { opacity:0; transform:translateY(22px); transition:opacity .85s cubic-bezier(.4,0,.2,1),transform .85s cubic-bezier(.4,0,.2,1); }
.stp-rv.on { opacity:1; transform:translateY(0); }
.stp-d1{transition-delay:.06s!important} .stp-d2{transition-delay:.16s!important}
.stp-d3{transition-delay:.28s!important} .stp-d4{transition-delay:.42s!important}
`;

export default function SkinTonePromoSection() {
  const [ref, on] = useInView(0.1);

  return (
    <>
      <style>{CSS}</style>
      <section
        ref={ref as React.RefObject<HTMLElement>}
        style={{ padding: "120px 0", position: "relative", overflow: "hidden", background: `linear-gradient(155deg, ${C.navyDeep} 0%, ${C.navy} 55%, ${C.maroonDeep} 100%)` }}
      >
        {/* Background orbs */}
        <div style={{ position: "absolute", top: "15%", right: "6%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,.10) 0%, transparent 68%)", pointerEvents: "none", animation: "stpPulse 8s ease infinite" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "4%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(242,196,206,.07) 0%, transparent 68%)", pointerEvents: "none" }} />

        {/* Decorative concentric rings */}
        {[640, 420, 240].map((s, i) => (
          <div key={i} style={{ position: "absolute", right: "-5%", top: "50%", transform: "translateY(-50%)", width: s, height: s, borderRadius: "50%", border: `1px solid rgba(212,175,55,${0.10 - i * 0.03})`, pointerEvents: "none" }} />
        ))}

        {/* Animated colour arc */}
        <svg style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "min(900px,90vw)", height: "min(900px,90vw)", pointerEvents: "none", opacity: .07, animation: "stpSpin 90s linear infinite" }} viewBox="0 0 900 900">
          {PALETTE_ROWS[0].map((c, i) => (
            <circle key={i} cx={450 + 340 * Math.cos(i * Math.PI * 2 / 5)} cy={450 + 340 * Math.sin(i * Math.PI * 2 / 5)} r={28} fill={c} />
          ))}
        </svg>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

            {/* LEFT — Copy */}
            <div>
              <span className={`stp-rv ${on ? "on" : ""}`} style={{ display: "block", fontFamily: "'Josefin Sans',sans-serif", fontSize: 10, letterSpacing: ".30em", textTransform: "uppercase", color: "rgba(212,175,55,.80)", fontWeight: 600, marginBottom: 18 }}>
                ✦ New · AI Styling Feature
              </span>

              <h2 className={`stp-rv stp-d1 ${on ? "on" : ""}`} style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(30px,4vw,52px)", fontWeight: 400, color: "white", lineHeight: 1.10, letterSpacing: ".05em", marginBottom: 14 }}>
                FIND SAREES<br />FOR YOUR SKIN
              </h2>

              <p className={`stp-rv stp-d2 ${on ? "on" : ""}`} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,.72)", lineHeight: 1.70, marginBottom: 28, maxWidth: 440 }}>
                Our AI reads the warmth, undertone and depth of your complexion — then reveals the exact saree colours that will make you radiant.
              </p>

              {/* Skin tone swatches preview */}
              <div className={`stp-rv stp-d2 ${on ? "on" : ""}`} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                <span style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 9, letterSpacing: ".20em", textTransform: "uppercase", color: "rgba(255,255,255,.40)", fontWeight: 600 }}>Every tone</span>
                <div style={{ display: "flex", gap: -8 }}>
                  {SKIN_SWATCHES.map((s, i) => (
                    <div key={i} className="stp-swatch-ring" style={{ background: s.hex, marginLeft: i > 0 ? -14 : 0, zIndex: SKIN_SWATCHES.length - i }} title={s.label} />
                  ))}
                </div>
                <span style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 9, letterSpacing: ".20em", textTransform: "uppercase", color: "rgba(255,255,255,.40)", fontWeight: 600 }}>celebrated</span>
              </div>

              {/* Feature list */}
              <div className={`stp-rv stp-d3 ${on ? "on" : ""}`} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
                {[
                  { icon: "📸", title: "Upload or Capture", body: "Use your camera or upload a selfie in natural light" },
                  { icon: "🎨", title: "Instant AI Analysis", body: "Claude AI reads your undertone, depth and natural warmth" },
                  { icon: "🪷", title: "Curated Saree Matches", body: "See handpicked sarees in your perfect colour palette" },
                ].map(f => (
                  <div key={f.title} className="stp-feature">
                    <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1, marginTop: 2 }}>{f.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: C.maroon, fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
                      <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 12, color: C.warmGrey, fontWeight: 300, lineHeight: 1.60 }}>{f.body}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`stp-rv stp-d4 ${on ? "on" : ""}`}>
                <Link to="/skin-tone-match" className="stp-btn">
                  ✦ &nbsp;Discover Your Palette
                </Link>
              </div>
            </div>

            {/* RIGHT — Visual palette preview */}
            <div className={`stp-rv stp-d2 ${on ? "on" : ""}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
              {/* Floating colour orb cluster */}
              <div style={{ position: "relative", width: 320, height: 320 }}>
                {/* Centre glow */}
                <div style={{ position: "absolute", inset: "20%", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,.22) 0%, transparent 70%)", animation: "stpPulse 5s ease infinite" }} />

                {/* Skin tone circles orbit */}
                {SKIN_SWATCHES.map((s, i) => {
                  const angle = (i / SKIN_SWATCHES.length) * Math.PI * 2 - Math.PI / 2;
                  const r = 118;
                  const x = 160 + r * Math.cos(angle);
                  const y = 160 + r * Math.sin(angle);
                  return (
                    <div key={i} style={{ position: "absolute", left: x - 32, top: y - 32, width: 64, height: 64, borderRadius: "50%", background: s.hex, border: "3px solid rgba(255,255,255,.22)", boxShadow: "0 8px 24px rgba(0,0,0,.28)", animation: `stpFloat ${4 + i * 0.5}s ease-in-out ${i * 0.4}s infinite` }} title={s.label} />
                  );
                })}

                {/* Centre circle */}
                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg, rgba(212,175,55,.25), rgba(128,0,32,.22))", border: "1.5px solid rgba(212,175,55,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, backdropFilter: "blur(8px)" }}>
                  🎨
                </div>
              </div>

              {/* Palette strip preview */}
              <div style={{ width: "100%", maxWidth: 340 }}>
                <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,255,255,.38)", textAlign: "center", marginBottom: 14, fontWeight: 600 }}>
                  Sample AI-generated palettes
                </div>
                {PALETTE_ROWS.map((row, ri) => (
                  <div key={ri} style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 12 }}>
                    {row.map((hex, ci) => (
                      <div key={ci} className="stp-palette-dot" style={{ background: hex }} />
                    ))}
                  </div>
                ))}
                <div style={{ textAlign: "center", marginTop: 18 }}>
                  <span style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(212,175,55,.55)", fontWeight: 600 }}>
                    ✦ personalised to your exact complexion
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}