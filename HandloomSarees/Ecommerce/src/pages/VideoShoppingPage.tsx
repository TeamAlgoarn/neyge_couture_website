import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Globe, CheckCircle, Sparkles, ArrowLeft, ChevronRight } from 'lucide-react';
import { FASHION_ADVISORS, TIME_SLOTS } from '@/constants/advisors';
import type { FashionAdvisor, VideoConsultation } from '@/types';
import { CalendarScheduler } from '@/components/features/CalenderScheduler';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';

// ─── Brand palette ────────────────────────────────────────────────────────────
const C = {
  maroon:   "#800020",
  maroonDk: "#5a0016",
  gold:     "#C4980A",
  goldV:    "#D4AF37",
  cream:    "#F5E6D3",
  creamLt:  "#FFF9F0",
  warmGrey: "#4a3828",
  indigo:   "#4B0082",
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.vs-root {
  font-family: 'Jost', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  min-height: 100vh;
  color: #1a1010;
  line-height: 1;
}

/* ── Wrap ── */
.vs-wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 56px;
}
@media(max-width: 900px)  { .vs-wrap { padding: 0 24px; } }
@media(max-width: 480px)  { .vs-wrap { padding: 0 16px; } }

/* ── Eyebrow ── */
.vs-ey {
  font-family: 'Jost'; font-size: 11px;
  letter-spacing: .25em; text-transform: uppercase;
  color: #C4980A; font-weight: 600;
}

/* ── Gold divider ── */
.vs-gd { width: 56px; height: 1px; background: #C4980A; margin: 0 auto; display: block; }

/* ─────────────────────────────
   ANIMATIONS
───────────────────────────── */
@keyframes vsFadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes vsShimmer  { 0%{left:-80%} 100%{left:120%} }
@keyframes vsGoldBlink{ 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0)} 50%{box-shadow:0 0 22px 3px rgba(212,175,55,.28)} }

.vs-fade { animation: vsFadeUp .75s cubic-bezier(.4,0,.2,1) both; }
.vs-d0 { animation-delay:0s    }
.vs-d1 { animation-delay:.10s  }
.vs-d2 { animation-delay:.20s  }
.vs-d3 { animation-delay:.32s  }

/* ─────────────────────────────
   PAGE HEADER (no hero image)
───────────────────────────── */
.vs-header {
  text-align: center;
  padding: 140px 24px 64px;
  position: relative;
}
.vs-header-badge {
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(196,152,10,.12); border: 1px solid rgba(196,152,10,.35);
  padding: 8px 20px; border-radius: 100px;
  margin-bottom: 22px;
}
.vs-header-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(36px, 5.5vw, 60px);
  font-weight: 400; line-height: 1.08;
  color: #800020; margin-bottom: 18px;
}
.vs-header-sub {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(16px, 2.2vw, 20px);
  font-style: italic; font-weight: 300;
  color: #4a3828; max-width: 560px;
  margin: 0 auto 22px; line-height: 1.7;
}

/* ── Step indicator ── */
.vs-steps {
  display: flex; justify-content: center; align-items: center;
  gap: 0; margin-bottom: 52px; flex-wrap: wrap;
}
.vs-step-item {
  display: flex; align-items: center; gap: 0;
}
.vs-step-dot {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Jost'; font-size: 12px; font-weight: 600;
  transition: all .35s;
}
.vs-step-dot.done {
  background: linear-gradient(135deg, #800020, #5a0016);
  color: white; box-shadow: 0 4px 14px rgba(128,0,32,.3);
}
.vs-step-dot.active {
  background: linear-gradient(135deg, #D4AF37, #C4980A);
  color: #800020; box-shadow: 0 4px 14px rgba(212,175,55,.35);
  animation: vsGoldBlink 2.5s ease infinite;
}
.vs-step-dot.idle {
  background: rgba(196,152,10,.12);
  border: 1.5px solid rgba(196,152,10,.35);
  color: #9a8070;
}
.vs-step-label {
  font-family: 'Jost'; font-size: 11px; letter-spacing: .1em;
  text-transform: uppercase; margin-top: 6px; text-align: center;
  color: #9a8070;
}
.vs-step-label.active { color: #C4980A; font-weight: 600; }
.vs-step-label.done   { color: #800020; font-weight: 500; }
.vs-step-line {
  width: 48px; height: 1px;
  background: rgba(196,152,10,.3);
  margin: 0 4px;
  flex-shrink: 0;
}
@media(max-width: 480px) {
  .vs-step-line { width: 24px; }
  .vs-step-dot  { width: 28px; height: 28px; font-size: 11px; }
}

/* ─────────────────────────────
   ADVISOR CARDS
───────────────────────────── */
.vs-advisors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(440px, 1fr));
  gap: 28px;
  margin-bottom: 60px;
}
@media(max-width: 960px)  { .vs-advisors-grid { grid-template-columns: 1fr; } }

.vs-advisor-card {
  background: rgba(255,249,240,.95); backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.25);
  border-radius: 24px;
  padding: 28px;
  cursor: pointer;
  transition: transform .4s cubic-bezier(.4,0,.2,1), box-shadow .4s, border-color .3s;
  box-shadow: 0 8px 36px rgba(0,0,0,.07);
  display: flex; flex-direction: column; gap: 20px;
}
.vs-advisor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(128,0,32,.12);
  border-color: rgba(196,152,10,.5);
}
.vs-advisor-inner {
  display: flex; gap: 20px; align-items: flex-start;
}
.vs-advisor-img {
  width: 88px; height: 88px; border-radius: 18px;
  object-fit: cover; flex-shrink: 0;
  border: 2px solid rgba(196,152,10,.3);
  box-shadow: 0 6px 20px rgba(0,0,0,.1);
}
.vs-advisor-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-weight: 500; color: #800020; margin-bottom: 6px;
}
.vs-advisor-rating {
  display: flex; align-items: center; gap: 5px; margin-bottom: 8px;
}
.vs-advisor-bio {
  font-family: 'Jost'; font-size: 13px; color: #4a3828;
  font-weight: 300; line-height: 1.75; margin-bottom: 10px;
}
.vs-advisor-meta {
  display: flex; align-items: center; gap: 6px;
  font-family: 'Jost'; font-size: 12px; color: #9a8070; flex-wrap: wrap;
}
.vs-advisor-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 16px; border-top: 1px solid rgba(196,152,10,.18);
}
.vs-advisor-tag {
  padding: 5px 14px; border-radius: 100px;
  background: rgba(196,152,10,.1); border: 1px solid rgba(196,152,10,.3);
  font-family: 'Jost'; font-size: 11px; letter-spacing: .08em;
  color: #800020; text-transform: uppercase; font-weight: 500;
}
.vs-select-btn {
  display: flex; align-items: center; gap: 6px;
  font-family: 'Jost'; font-size: 12px; letter-spacing: .1em;
  text-transform: uppercase; color: #C4980A; font-weight: 600;
  background: none; border: none; cursor: pointer;
  transition: gap .25s, color .25s;
}
.vs-select-btn:hover { gap: 10px; color: #800020; }

/* ─────────────────────────────
   STEP PANELS (schedule, prefs, confirm)
───────────────────────────── */
.vs-panel {
  background: rgba(255,249,240,.97); backdrop-filter: blur(12px);
  border: 1px solid rgba(196,152,10,.25);
  border-radius: 28px;
  box-shadow: 0 24px 80px rgba(0,0,0,.09);
  max-width: 780px; margin: 0 auto 60px;
  overflow: hidden;
}

/* Panel top bar (maroon) */
.vs-panel-bar {
  background: linear-gradient(135deg, #800020 0%, #5a0016 55%, #4B0082 100%);
  padding: 22px 32px;
  display: flex; align-items: center; justify-content: space-between;
  position: relative; overflow: hidden;
}
.vs-panel-bar::after {
  content: ''; position: absolute; top: -40px; right: -40px;
  width: 140px; height: 140px; border-radius: 50%;
  border: 1px solid rgba(212,175,55,.15); pointer-events: none;
}
.vs-panel-bar-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-weight: 400; color: white;
}
.vs-panel-bar-back {
  display: flex; align-items: center; gap: 6px;
  font-family: 'Jost'; font-size: 12px; letter-spacing: .1em;
  text-transform: uppercase; color: rgba(255,255,255,.65);
  background: none; border: none; cursor: pointer;
  transition: color .25s;
}
.vs-panel-bar-back:hover { color: #D4AF37; }

/* Panel body */
.vs-panel-body { padding: 36px 36px 32px; }
@media(max-width: 600px) { .vs-panel-body { padding: 24px 20px 24px; } }

/* ─────────────────────────────
   SELECTED ADVISOR CHIP (inside panel)
───────────────────────────── */
.vs-selected-advisor {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px;
  background: rgba(196,152,10,.08); border: 1px solid rgba(196,152,10,.3);
  border-radius: 16px; margin-bottom: 28px;
}
.vs-selected-advisor img {
  width: 46px; height: 46px; border-radius: 12px;
  object-fit: cover; flex-shrink: 0;
}

/* ─────────────────────────────
   FORM INPUTS
───────────────────────────── */
.vs-input, .vs-textarea {
  width: 100%;
  padding: 14px 18px;
  background: white;
  border: 1.5px solid rgba(196,152,10,.3);
  border-radius: 14px;
  font-family: 'Jost'; font-size: 14px; color: #1a1010;
  transition: border-color .25s, box-shadow .25s;
  line-height: 1.5;
}
.vs-input::placeholder, .vs-textarea::placeholder {
  color: #b0a090; font-weight: 300;
}
.vs-input:focus, .vs-textarea:focus {
  outline: none;
  border-color: #C4980A;
  box-shadow: 0 0 0 3px rgba(196,152,10,.12);
}
.vs-textarea { resize: vertical; min-height: 110px; }
.vs-input-label {
  font-family: 'Jost'; font-size: 11px; letter-spacing: .15em;
  text-transform: uppercase; color: #C4980A; font-weight: 600;
  margin-bottom: 7px; display: block;
}
.vs-field { margin-bottom: 18px; }
.vs-fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media(max-width: 560px) { .vs-fields-grid { grid-template-columns: 1fr; } }

/* ─────────────────────────────
   BUTTONS
───────────────────────────── */
.vs-btn-row {
  display: flex; gap: 14px; margin-top: 32px; flex-wrap: wrap;
}
.vs-btn-primary {
  flex: 1; min-width: 140px; padding: 15px 24px;
  background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
  color: #800020; border: none; border-radius: 100px;
  font-family: 'Jost'; font-size: 13px; letter-spacing: .12em;
  font-weight: 600; text-transform: uppercase; cursor: pointer;
  transition: transform .35s, box-shadow .35s;
  box-shadow: 0 6px 24px rgba(212,175,55,.38);
  position: relative; overflow: hidden;
}
.vs-btn-primary::after {
  content: ''; position: absolute; top: 0; left: -80%; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent);
  animation: vsShimmer 3s ease infinite;
}
.vs-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(212,175,55,.52); }
.vs-btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }

.vs-btn-secondary {
  flex: 1; min-width: 120px; padding: 14px 24px;
  background: transparent;
  border: 1.5px solid rgba(196,152,10,.4); border-radius: 100px;
  font-family: 'Jost'; font-size: 13px; letter-spacing: .10em;
  font-weight: 500; text-transform: uppercase; color: #4a3828; cursor: pointer;
  transition: border-color .25s, color .25s, transform .3s;
}
.vs-btn-secondary:hover { border-color: #800020; color: #800020; transform: translateY(-2px); }

.vs-btn-maroon {
  flex: 1; min-width: 140px; padding: 15px 24px;
  background: linear-gradient(135deg, #800020 0%, #4B0082 100%);
  color: white; border: none; border-radius: 100px;
  font-family: 'Jost'; font-size: 13px; letter-spacing: .12em;
  font-weight: 600; text-transform: uppercase; cursor: pointer;
  transition: transform .35s, box-shadow .35s;
  box-shadow: 0 6px 24px rgba(128,0,32,.28);
}
.vs-btn-maroon:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(128,0,32,.4); }

/* ─────────────────────────────
   CONFIRM STEP
───────────────────────────── */
.vs-confirm-icon {
  width: 88px; height: 88px; border-radius: 50%;
  background: rgba(196,152,10,.1); border: 1.5px solid rgba(196,152,10,.35);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 28px;
  animation: vsGoldBlink 3s ease infinite;
}
.vs-confirm-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 400; color: #800020; margin-bottom: 12px; text-align: center;
}
.vs-confirm-meta {
  font-family: 'Jost'; font-size: 14px; color: #4a3828;
  font-weight: 300; text-align: center; line-height: 1.8; margin-bottom: 8px;
}
.vs-confirm-detail {
  background: rgba(196,152,10,.08); border: 1px solid rgba(196,152,10,.25);
  border-radius: 18px; padding: 22px 24px; margin: 24px 0 32px;
}
.vs-confirm-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 0; border-bottom: 1px solid rgba(196,152,10,.12);
}
.vs-confirm-row:last-child { border-bottom: none; }
.vs-confirm-key {
  font-family: 'Jost'; font-size: 11px; letter-spacing: .12em;
  text-transform: uppercase; color: #9a8070; font-weight: 500;
}
.vs-confirm-val {
  font-family: 'Cormorant Garamond', serif;
  font-size: 17px; font-weight: 500; color: #800020;
}

/* ─────────────────────────────
   MOBILE
───────────────────────────── */
@media(max-width: 600px) {
  .vs-header { padding-top: 160px;  }
  .vs-header-title { font-size: 32px; }
  .vs-btn-row { flex-direction: column; }
  .vs-btn-primary, .vs-btn-secondary, .vs-btn-maroon { flex: none; width: 100%; }
  .vs-advisor-inner { flex-direction: column; }
  .vs-advisor-img { width: 100%; height: 180px; border-radius: 16px; }
}
`;

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEPS = ['Advisor', 'Schedule', 'Preferences', 'Confirm'];
const STEP_KEYS = ['advisors', 'schedule', 'preferences', 'confirm'];

function StepBar({ current }: { current: string }) {
  const idx = STEP_KEYS.indexOf(current);
  return (
    <div className="vs-steps">
      {STEPS.map((label, i) => {
        const state = i < idx ? 'done' : i === idx ? 'active' : 'idle';
        return (
          <div key={label} className="vs-step-item">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className={`vs-step-dot ${state}`}>
                {state === 'done' ? '✓' : i + 1}
              </div>
              <span className={`vs-step-label ${state}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="vs-step-line" style={{ marginBottom: 20 }} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export function VideoShoppingPage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [selectedAdvisor, setSelectedAdvisor] = useState<FashionAdvisor | null>(null);
  const [selectedDate,    setSelectedDate]    = useState<Date | null>(null);
  const [selectedTime,    setSelectedTime]    = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    occasion: '', fabric: '', priceRange: '', colorPreference: '', notes: '',
  });
  const [step, setStep] = useState<'advisors' | 'schedule' | 'preferences' | 'confirm'>('advisors');

  const handleAdvisorSelect = (advisor: FashionAdvisor) => {
    setSelectedAdvisor(advisor); setSelectedDate(null); setSelectedTime(null); setStep('schedule');
  };
  const handleScheduleNext = () => {
    if (!selectedDate || !selectedTime) { toast.error('Please select both date and time'); return; }
    setStep('preferences');
  };
  const handleBookConsultation = () => {
    if (!user) { toast.error('Please log in to book a consultation'); navigate('/login'); return; }
    if (!selectedAdvisor || !selectedDate || !selectedTime) { toast.error('Please complete all booking details'); return; }
    const consultation: VideoConsultation = {
      id: 'CONSULT' + Date.now(), userId: user.id,
      advisorId: selectedAdvisor.id,
      date: selectedDate.toISOString(), time: selectedTime, duration: 30,
      status: 'scheduled',
      sareePreferences: {
        occasion: preferences.occasion || undefined, fabric: preferences.fabric || undefined,
        priceRange: preferences.priceRange || undefined, colorPreference: preferences.colorPreference || undefined,
      },
      notes: preferences.notes || undefined, createdAt: new Date().toISOString(),
    };
    const list = JSON.parse(localStorage.getItem('handloom_consultations') || '[]');
    list.push(consultation);
    localStorage.setItem('handloom_consultations', JSON.stringify(list));
    toast.success('Video consultation booked successfully!');
    setStep('confirm');
  };
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const PREF_FIELDS: { key: keyof typeof preferences; label: string; placeholder: string }[] = [
    { key: 'occasion',       label: 'Occasion',        placeholder: 'e.g. Wedding, Festive, Casual' },
    { key: 'fabric',         label: 'Fabric',           placeholder: 'e.g. Silk, Cotton, Linen'      },
    { key: 'priceRange',     label: 'Budget Range',     placeholder: 'e.g. ₹10,000 – ₹30,000'        },
    { key: 'colorPreference',label: 'Colour Preference',placeholder: 'e.g. Deep reds, Earth tones'   },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="vs-root">

        {/* ── Page Header ── */}
        <header className="vs-header">
          <div className="vs-fade vs-d0">
            <div className="vs-header-badge">
              <Sparkles size={13} color={C.gold} />
              <span className="vs-ey">Premium Experience</span>
            </div>
          </div>
          <h1 className="vs-header-title vs-fade vs-d1">
            Video Shopping<br />
          </h1>
          <div className="vs-fade vs-d1">
            <span className="vs-gd" style={{ marginBottom: 20 }} />
          </div>
          <p className="vs-header-sub vs-fade vs-d2">
            Book a private session with our expert stylists and explore
            handcrafted sarees in real time.
          </p>
          <div className="vs-fade vs-d3">
            <StepBar current={step} />
          </div>
        </header>

        <div className="vs-wrap" style={{ paddingBottom: 80 }}>

          {/* ══ STEP 1 — ADVISORS ══ */}
          {step === 'advisors' && (
            <div className="vs-advisors-grid vs-fade vs-d0">
              {FASHION_ADVISORS.map((advisor, i) => (
                <div
                  key={advisor.id}
                  className="vs-advisor-card"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onClick={() => handleAdvisorSelect(advisor)}
                >
                  <div className="vs-advisor-inner">
                    <img src={advisor.image} alt={advisor.name} className="vs-advisor-img" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="vs-advisor-name">{advisor.name}</div>
                      <div className="vs-advisor-rating">
                        <Star size={13} fill={C.goldV} color={C.goldV} />
                        <span style={{ fontFamily: "'Jost'", fontSize: 13, color: C.warmGrey, fontWeight: 500 }}>
                          {advisor.rating}
                        </span>
                        <span style={{ fontFamily: "'Jost'", fontSize: 11, color: '#9a8070', marginLeft: 4 }}>
                          · {advisor.experience} yrs exp
                        </span>
                      </div>
                      <p className="vs-advisor-bio">{advisor.bio}</p>
                      <div className="vs-advisor-meta">
                        <Globe size={12} color="#C4980A" />
                        <span>{advisor.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="vs-advisor-footer">
                    <span className="vs-advisor-tag">Available Now</span>
                    <button className="vs-select-btn">
                      Book Session <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══ STEP 2 — SCHEDULE ══ */}
          {step === 'schedule' && selectedAdvisor && (
            <div className="vs-panel vs-fade vs-d0">
              <div className="vs-panel-bar">
                <span className="vs-panel-bar-title">Choose Your Slot</span>
                <button className="vs-panel-bar-back" onClick={() => setStep('advisors')}>
                  <ArrowLeft size={13} /> Change Advisor
                </button>
              </div>
              <div className="vs-panel-body">
                {/* Selected advisor chip */}
                <div className="vs-selected-advisor">
                  <img src={selectedAdvisor.image} alt={selectedAdvisor.name} />
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 500, color: C.maroon }}>
                      {selectedAdvisor.name}
                    </div>
                    <div style={{ fontFamily: "'Jost'", fontSize: 12, color: '#9a8070', marginTop: 3 }}>
                      30-min styling session · Free of charge
                    </div>
                  </div>
                </div>

                <CalendarScheduler
                  availableDays={selectedAdvisor.availability}
                  onDateSelect={setSelectedDate}
                  onTimeSelect={setSelectedTime}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  timeSlots={TIME_SLOTS}
                />

                <div className="vs-btn-row">
                  <button className="vs-btn-secondary" onClick={() => setStep('advisors')}>← Back</button>
                  <button
                    className="vs-btn-primary"
                    onClick={handleScheduleNext}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 3 — PREFERENCES ══ */}
          {step === 'preferences' && (
            <div className="vs-panel vs-fade vs-d0">
              <div className="vs-panel-bar">
                <span className="vs-panel-bar-title">Your Saree Preferences</span>
                <button className="vs-panel-bar-back" onClick={() => setStep('schedule')}>
                  <ArrowLeft size={13} /> Back
                </button>
              </div>
              <div className="vs-panel-body">
                <p style={{ fontFamily: "'Jost'", fontSize: 13, color: '#9a8070', fontWeight: 300, lineHeight: 1.7, marginBottom: 28 }}>
                  Help your stylist prepare the perfect selection for you. All fields are optional.
                </p>

                <div className="vs-fields-grid">
                  {PREF_FIELDS.map(f => (
                    <div key={f.key} className="vs-field">
                      <label className="vs-input-label">{f.label}</label>
                      <input
                        type="text"
                        className="vs-input"
                        placeholder={f.placeholder}
                        value={preferences[f.key]}
                        onChange={e => setPreferences({ ...preferences, [f.key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>

                <div className="vs-field">
                  <label className="vs-input-label">Additional Notes</label>
                  <textarea
                    className="vs-textarea"
                    placeholder="Anything else you'd like your stylist to know…"
                    value={preferences.notes}
                    onChange={e => setPreferences({ ...preferences, notes: e.target.value })}
                  />
                </div>

                <div className="vs-btn-row">
                  <button className="vs-btn-secondary" onClick={() => setStep('schedule')}>← Back</button>
                  <button className="vs-btn-primary" onClick={handleBookConsultation}>
                    Book Consultation ✦
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 4 — CONFIRM ══ */}
          {step === 'confirm' && selectedAdvisor && selectedDate && selectedTime && (
            <div className="vs-panel vs-fade vs-d0" style={{ maxWidth: 560 }}>
              <div className="vs-panel-bar">
                <span className="vs-panel-bar-title">Booking Confirmed</span>
              </div>
              <div className="vs-panel-body" style={{ textAlign: 'center' }}>
                <div className="vs-confirm-icon">
                  <CheckCircle size={40} color={C.gold} />
                </div>
                <h2 className="vs-confirm-title">Consultation Confirmed</h2>
                <p className="vs-confirm-meta">
                  Your styling session has been scheduled. Your advisor will reach out shortly.
                </p>

                <div className="vs-confirm-detail">
                  {[
                    ['Advisor',  selectedAdvisor.name],
                    ['Date',     formatDate(selectedDate)],
                    ['Time',     selectedTime],
                    ['Duration', '30 minutes'],
                  ].map(([k, v]) => (
                    <div key={k} className="vs-confirm-row">
                      <span className="vs-confirm-key">{k}</span>
                      <span className="vs-confirm-val">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="vs-btn-row">
                  <button className="vs-btn-maroon" onClick={() => navigate('/profile')}>
                    View My Consultations
                  </button>
                  <button className="vs-btn-secondary" onClick={() => navigate('/shop')}>
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}