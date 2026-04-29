import { Link } from "react-router-dom";
import { Sparkles, Crown, Wind, Heart, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
// Placeholder images – replace with your actual assets
import heroBg from "@/assets/ab4.jpeg";        // full‑screen hero background
import royalImg from "@/assets/ab3.png";       // opulent silk visual
import minimalImg from "@/assets/ab2.jpeg";     // airy, minimal drape
import artisanImg from "@/assets/ab5.png";     // loom/artisan shot

const C = {
  maroon: '#800020',
  maroonDk: '#5a0016',
  gold: '#C4980A',
  goldV: '#D4AF37',
  cream: '#F5E6D3',
  creamLt: '#FFF9F0',
  creamMid: '#F8EEE2',
  creamDk: '#EDD8C4',
  warmGrey: '#4a3828',
  navy: '#1B2A6B',
  forest: '#14402A',
  blush: '#F2C4CE',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.about-root {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  min-height: 100vh;
  color: #1a1010;
  line-height: 1;
}
.about-wrap {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 64px;
}
@media(max-width: 900px){ .about-wrap { padding: 0 24px; } }
@media(max-width: 480px){ .about-wrap { padding: 0 16px; } }

.ey {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 10px;
  letter-spacing: 0.30em;
  text-transform: uppercase;
  color: #C4980A;
  font-weight: 600;
}
.gd { width: 44px; height: 1px; background: #C4980A; margin: 0 auto; }

/* Animations */
@keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
@keyframes subtleKenBurns {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}
@keyframes scrollPulse {
  0%,100% { opacity: 0.5; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(6px); }
}
.about-fadein { animation: fadeIn .8s cubic-bezier(.4,0,.2,1) both; }
.about-fadeup { animation: fadeUp .8s cubic-bezier(.4,0,.2,1) both; }
.about-d0 { animation-delay: 0s }
.about-d1 { animation-delay: .12s }
.about-d2 { animation-delay: .24s }
.about-d3 { animation-delay: .36s }
.about-d4 { animation-delay: .48s }

/* Hero Section - Full Screen */
.about-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}
.about-hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  animation: subtleKenBurns 20s ease-in-out infinite alternate;
}
.about-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(90,0,22,.55) 0%, rgba(27,42,107,.65) 100%);
}
.about-hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 24px;
  color: white;
}
.about-hero-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(44px, 8vw, 82px);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: 0.04em;
  margin-bottom: 24px;
  text-shadow: 0 4px 20px rgba(0,0,0,.3);
}
.about-hero-sub {
  font-family: 'Josefin Sans';
  font-size: 18px;
  font-weight: 300;
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto;
  color: rgba(255,255,255,.85);
  text-shadow: 0 1px 8px rgba(0,0,0,.2);
}
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 2;
  animation: fadeUp 1s ease 1.2s both;
}
.scroll-indicator:hover { opacity: 1; }
.scroll-line {
  width: 1px;
  height: 50px;
  background: linear-gradient(to bottom, rgba(212,175,55,.8), transparent);
  animation: scrollPulse 2.2s ease-in-out infinite;
}
.scroll-text {
  font-size: 9px;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: rgba(212,175,55,.7);
  font-weight: 500;
}

/* Cards */
.about-card {
  background: rgba(255,249,240,.97);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 28px;
  padding: 52px 56px;
  margin-bottom: 48px;
  box-shadow: 0 12px 56px rgba(0,0,0,.07);
}
@media(max-width: 700px){ .about-card { padding: 32px 24px; } }
@media(max-width: 480px){ .about-card { padding: 26px 18px; border-radius: 20px; } }

/* Mood Cards with Images */
.mood-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-top: 32px;
}
@media(max-width: 900px) { .mood-grid { grid-template-columns: 1fr; gap: 24px; } }
.mood-card {
  background: rgba(255,249,240,.9);
  border: 1px solid rgba(196,152,10,.2);
  border-radius: 24px;
  overflow: hidden;
  transition: transform .35s, box-shadow .35s;
}
.mood-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 48px rgba(128,0,32,.12);
  border-color: rgba(196,152,10,.4);
}
.mood-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform .6s ease;
}
.mood-card:hover .mood-img { transform: scale(1.05); }
.mood-content {
  padding: 28px 24px;
  text-align: left;
}
.mood-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(196,152,10,.12);
  border: 1px solid rgba(196,152,10,.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.mood-title {
  font-family: 'Cinzel', serif;
  font-size: 24px;
  font-weight: 500;
  color: #800020;
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}
.mood-sub {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px;
  font-style: italic;
  color: #C4980A;
  margin-bottom: 20px;
}
.mood-narrative {
  font-family: 'Josefin Sans';
  font-size: 14px;
  font-weight: 300;
  color: #4a3828;
  line-height: 1.85;
}
.mood-narrative p { margin-bottom: 16px; }
.mood-quote {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(196,152,10,.25);
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px;
  font-style: italic;
  color: #800020;
  text-align: center;
}

/* Thread Divider (animated) */
.thread-divider {
  width: 100%;
  overflow: hidden;
  line-height: 0;
  padding: 8px 0;
  margin: 20px 0;
}
.thread-svg {
  width: 100%;
  height: 32px;
  display: block;
}
.thread-svg path {
  stroke: rgba(196,152,10,0.3);
  stroke-width: 1;
  fill: none;
  animation: flowThread 6s ease-in-out infinite;
}
@keyframes flowThread {
  0%,100% { d: path("M0,16 C300,4 600,28 900,16 C1200,4 1500,28 1800,16"); }
  50% { d: path("M0,12 C300,24 600,8 900,12 C1200,24 1500,8 1800,12"); }
}

/* Mission Section with Brand Gradient */
.about-mission {
  background: linear-gradient(135deg, #800020 0%, #5a0016 55%, #1B2A6B 100%);
  border-radius: 28px;
  padding: 56px 48px;
  text-align: center;
  color: white;
  margin: 48px 0;
  position: relative;
  overflow: hidden;
}
.about-mission h2 {
  font-family: 'Cinzel', serif;
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 400;
  letter-spacing: 0.04em;
  margin-bottom: 20px;
}
.about-mission p {
  font-family: 'Josefin Sans';
  font-size: 16px;
  font-weight: 300;
  line-height: 1.8;
  max-width: 700px;
  margin: 0 auto;
  color: rgba(255,255,255,.85);
}

.about-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 38px;
  background: linear-gradient(135deg, #D4AF37, #b8960f);
  color: #800020;
  border-radius: 100px;
  font-family: 'Josefin Sans';
  font-size: 13px;
  letter-spacing: .12em;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
  transition: transform .35s, box-shadow .35s;
  box-shadow: 0 6px 24px rgba(212,175,55,.38);
}
.about-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(212,175,55,.52);
}
`;

export default function AboutPage() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // ✅ Force scroll to top whenever this page is loaded/opened
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const moods = [
    {
      icon: <Crown size={24} />,
      title: "Royal Heritage",
      subtitle: "Regal. Powerful. Timeless.",
      img: royalImg,
      narrative: [
        "Neyge feels like a modern day queen's wardrobe. Heavy silk. Grand identity. Rich Indian pride. This is opulence that doesn't apologise — it commands attention.",
        "Deep jewel tones, ivory, and gold. High-fashion serifs. Imagery drawn from palace walls, temple architecture, gold jewellery glowing in low light. The brand voice is bold, proud, confident.",
      ],
      quote: "“I am not dressing up. I am arriving.”",
    },
    {
      icon: <Wind size={24} />,
      title: "Minimal Modern Heirloom",
      subtitle: "Quiet luxury. Soft power. Understated tradition.",
      img: minimalImg,
      narrative: [
        "For women who hate loud fashion — old money meets handloom. Clean, airy, minimal. Cream, beige, sandalwood, muted gold, charcoal, with soft maroon whispers.",
        "Natural light, close-up fabric textures, minimal jewellery, calm poses. The voice is gentle, refined, poetic. Every piece whispers, never shouts.",
      ],
      quote: "“This is not fashion. This is taste.”",
    },
    {
      icon: <Heart size={24} />,
      title: "Artisan Soul",
      subtitle: "Handmade love story. Emotional. Earthy. Artistic.",
      img: artisanImg,
      narrative: [
        "A celebration of artisans, storytelling, and weaving culture. Earthy, soulful, handmade, intimate. Rust, terracotta, turmeric yellow, indigo, forest green, natural gold.",
        "Looms, artisans weaving, raw silk textures, heritage villages, candid storytelling shots. The voice is emotional, nostalgic, rooted in the soil of India.",
      ],
      quote: "“I'm wearing a story, not a saree.”",
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="about-root">
        {/* Full‑screen Hero with staggered animations */}
        <div className="about-hero">
          <img src={heroBg} alt="Neyge Couture" className="about-hero-bg" />
          <div className="about-hero-overlay" />
          <div className="about-hero-content">
            <span className="ey about-fadeup about-d0" style={{ color: '#D4AF37', marginBottom: 16, display: 'block' }}>
              Our Identity
            </span>
            <h1 className="about-hero-title about-fadeup about-d1">Neyge Couture</h1>
            <div className="gd about-fadeup about-d2" style={{ background: '#D4AF37', margin: '20px auto' }} />
            <p className="about-hero-sub about-fadeup about-d3">
              A luxury saree and Indian wear brand built to revive and celebrate authentic Indian textile heritage.<br />
              Rooted in handloom craftsmanship, working with real artisans and traditional weaving techniques —<br />
              making sarees feel modern, wearable, and emotionally meaningful.
            </p>
          </div>
          <div className="scroll-indicator">
            <span className="scroll-text">Scroll</span>
            <div className="scroll-line" />
          </div>
        </div>

        <div className="about-wrap" style={{ paddingBottom: 80 }}>
          {/* Thread Divider */}
          <div className="thread-divider">
            <svg className="thread-svg" viewBox="0 0 1800 32" preserveAspectRatio="none">
              <path d="M0,16 C300,4 600,28 900,16 C1200,4 1500,28 1800,16" />
            </svg>
          </div>

          {/* Three Moods Section */}
          <div className={`about-card about-fadeup ${visible ? 'about-d1' : ''}`} ref={ref}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <span className="ey">Brand Expression</span>
              <h2 className="about-hero-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginTop: 8, color: C.maroon }}>Three Moods of Neyge</h2>
              <div className="gd" style={{ margin: '16px auto' }} />
              <p style={{ fontFamily: "'Josefin Sans'", fontSize: 14, fontWeight: 300, color: C.warmGrey, marginTop: 8 }}>
                Our brand lives in three distinct yet harmonious expressions
              </p>
            </div>
            <div className="mood-grid">
              {moods.map((mood, idx) => (
                <div key={idx} className="mood-card">
                  <img src={mood.img} alt={mood.title} className="mood-img" />
                  <div className="mood-content">
                    <div className="mood-icon">{mood.icon}</div>
                    <div className="mood-title">{mood.title}</div>
                    <div className="mood-sub">{mood.subtitle}</div>
                    <div className="mood-narrative">
                      {mood.narrative.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                    <div className="mood-quote">{mood.quote}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thread Divider */}
          <div className="thread-divider">
            <svg className="thread-svg" viewBox="0 0 1800 32" preserveAspectRatio="none">
              <path d="M0,20 C300,8 600,30 900,20 C1200,8 1500,30 1800,20" />
            </svg>
          </div>

          {/* Mission Section */}
          <div className={`about-mission about-fadeup about-d2`}>
            <h2>Our Mission</h2>
            <p>
              To become a globally recognised luxury handloom house that redefines sarees as timeless heirlooms —
              not occasional wear, but everyday expressions of identity, grace, and quiet confidence.
            </p>
          </div>

          {/* Closing CTA */}
          <div className={`about-card about-fadeup about-d3`} style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Sparkles size={24} color={C.gold} />
              <span className="ey">Experience Neyge</span>
            </div>
            <p style={{ fontFamily: "'Josefin Sans'", fontSize: 15, fontWeight: 300, lineHeight: 1.9, color: C.warmGrey, maxWidth: 600, margin: '0 auto 28px' }}>
              Whether you seek regal grandeur, quiet minimalism, or the soul of artisan hands —<br />
              Neyge is the thread that weaves it all together.
            </p>
            <Link to="/collections" className="about-btn">
              Discover the Collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}