import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

/* ── CALENDAR SHELL ── */
.cs-root { font-family: 'Jost', sans-serif; }

.cs-cal {
  background: rgba(255,249,240,.97); backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.28); border-radius: 22px;
  padding: 24px 22px; margin-bottom: 22px;
  box-shadow: 0 8px 36px rgba(0,0,0,.07);
}

/* ── NAV ROW ── */
.cs-nav {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px; padding-bottom: 16px;
  border-bottom: 1px solid rgba(196,152,10,.18);
}
.cs-nav-btn {
  width: 34px; height: 34px; border-radius: 50%;
  border: 1px solid rgba(196,152,10,.3); background: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background .25s, border-color .25s, transform .2s;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
}
.cs-nav-btn:hover { background: rgba(196,152,10,.1); border-color: #C4980A; transform: scale(1.08); }

.cs-month-row {
  display: flex; align-items: center; gap: 8px;
}
.cs-month-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 19px; font-weight: 500; color: #800020;
}

/* ── DAY NAME HEADERS ── */
.cs-day-headers {
  display: grid; grid-template-columns: repeat(7, 1fr);
  gap: 4px; margin-bottom: 6px;
}
.cs-day-hdr {
  text-align: center;
  font-family: 'Jost'; font-size: 10px; letter-spacing: .1em;
  text-transform: uppercase; color: #C4980A; font-weight: 600;
  padding: 4px 0;
}

/* ── DAY CELLS ── */
.cs-days {
  display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;
}
.cs-day-empty { aspect-ratio: 1; }

.cs-day-btn {
  aspect-ratio: 1; border-radius: 50%; border: none;
  font-family: 'Jost'; font-size: 13px; font-weight: 400;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background .2s, color .2s, transform .2s, box-shadow .2s;
  position: relative;
}
.cs-day-btn.available {
  background: white; color: #800020;
  border: 1px solid rgba(196,152,10,.25);
}
.cs-day-btn.available:hover {
  background: rgba(196,152,10,.12); border-color: #C4980A;
  transform: scale(1.1);
}
.cs-day-btn.selected {
  background: linear-gradient(135deg, #800020, #4B0082);
  color: white; border: none;
  box-shadow: 0 4px 16px rgba(128,0,32,.35);
  transform: scale(1.1); font-weight: 600;
}
/* ring pulse on selected */
.cs-day-btn.selected::after {
  content: ''; position: absolute; inset: -3px;
  border-radius: 50%; border: 1.5px solid rgba(196,152,10,.5);
  animation: csDayRing 2.5s ease infinite;
}
@keyframes csDayRing {
  0%,100%{ opacity: 1; transform: scale(1); }
  50%{ opacity: .4; transform: scale(1.18); }
}
.cs-day-btn.unavailable {
  background: transparent; color: rgba(0,0,0,.18);
  border: none; cursor: not-allowed;
}

/* ── TIME SLOTS ── */
.cs-time-section { margin-top: 4px; }

.cs-time-head {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 14px;
}
.cs-time-bar { width: 3px; height: 18px; background: linear-gradient(to bottom, #800020, #C4980A); border-radius: 2px; flex-shrink: 0; }
.cs-time-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px; font-weight: 500; color: #800020;
}

.cs-time-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
}
@media(max-width:400px){ .cs-time-grid { grid-template-columns: repeat(2, 1fr); } }

.cs-time-btn {
  padding: 11px 8px; border-radius: 100px; border: none;
  font-family: 'Jost'; font-size: 12px; letter-spacing: .06em;
  font-weight: 500; cursor: pointer;
  transition: background .25s, color .25s, transform .2s, box-shadow .2s;
}
.cs-time-btn.idle {
  background: white; color: #800020;
  border: 1px solid rgba(196,152,10,.3);
}
.cs-time-btn.idle:hover {
  background: rgba(196,152,10,.1); border-color: #C4980A; transform: scale(1.03);
}
.cs-time-btn.selected {
  background: linear-gradient(135deg, #D4AF37 0%, #b8960f 100%);
  color: #800020; font-weight: 600;
  border: 1px solid rgba(196,152,10,.5);
  box-shadow: 0 4px 14px rgba(212,175,55,.35);
  transform: scale(1.03);
}
`;

let _cssInjected = false;
function injectCss() {
  if (_cssInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.setAttribute('data-cs', '1');
  el.textContent = CSS;
  document.head.appendChild(el);
  _cssInjected = true;
}

interface CalendarSchedulerProps {
  availableDays: string[];
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  selectedDate: Date | null;
  selectedTime: string | null;
  timeSlots: string[];
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_HDRS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export function CalendarScheduler({
  availableDays, onDateSelect, onTimeSelect,
  selectedDate, selectedTime, timeSlots,
}: CalendarSchedulerProps) {
  injectCss();

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0,0,0,0);

  const daysInMonth    = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const prevMonth = () => {
    const p = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    if (p >= new Date(today.getFullYear(), today.getMonth(), 1)) setCurrentMonth(p);
  };
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const isAvailable = (date: Date) => {
    if (date < today) return false;
    const name = date.toLocaleDateString('en-IN', { weekday: 'long' });
    return availableDays.some(d => d.toLowerCase() === name.toLowerCase());
  };

  const isSelected = (date: Date) =>
    !!selectedDate && date.toDateString() === selectedDate.toDateString();

  const handleDay = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isAvailable(date)) { onDateSelect(date); onTimeSelect(''); }
  };

  // Build cells
  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(<div key={`e${i}`} className="cs-day-empty" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
    const avail = isAvailable(date);
    const sel   = isSelected(date);
    cells.push(
      <button
        key={d}
        className={`cs-day-btn ${sel ? 'selected' : avail ? 'available' : 'unavailable'}`}
        onClick={() => handleDay(d)}
        disabled={!avail}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="cs-root">

      {/* Calendar */}
      <div className="cs-cal">

        {/* Navigation */}
        <div className="cs-nav">
          <button className="cs-nav-btn" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeft size={16} color="#800020" />
          </button>
          <div className="cs-month-row">
            <CalendarIcon size={16} color="#C4980A" />
            <span className="cs-month-label">
              {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
          </div>
          <button className="cs-nav-btn" onClick={nextMonth} aria-label="Next month">
            <ChevronRight size={16} color="#800020" />
          </button>
        </div>

        {/* Day headers */}
        <div className="cs-day-headers">
          {DAY_HDRS.map(d => <div key={d} className="cs-day-hdr">{d}</div>)}
        </div>

        {/* Day cells */}
        <div className="cs-days">{cells}</div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="cs-time-section">
          <div className="cs-time-head">
            <div className="cs-time-bar" />
            <span className="cs-time-title">Select Time Slot</span>
          </div>
          <div className="cs-time-grid">
            {timeSlots.map(time => (
              <button
                key={time}
                className={`cs-time-btn ${selectedTime === time ? 'selected' : 'idle'}`}
                onClick={() => onTimeSelect(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}