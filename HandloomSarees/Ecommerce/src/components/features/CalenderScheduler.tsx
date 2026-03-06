import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarSchedulerProps {
  availableDays: string[];
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  selectedDate: Date | null;
  selectedTime: string | null;
  timeSlots: string[];
}

export function CalendarScheduler({
  availableDays,
  onDateSelect,
  onTimeSelect,
  selectedDate,
  selectedTime,
  timeSlots,
}: CalendarSchedulerProps) {

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  const dayNamesShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const previousMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prev);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const isDateAvailable = (date: Date) => {
    if (date < today) return false;

    const fullDayName = date.toLocaleDateString('en-IN', { weekday: 'long' });

    return availableDays.some(
      (day) => day.toLowerCase() === fullDayName.toLowerCase()
    );
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (isDateAvailable(date)) {
      onDateSelect(date);
      onTimeSelect(''); // reset time when new date selected
    }
  };

  const renderCalendar = () => {
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );

      const available = isDateAvailable(date);
      const selected = isDateSelected(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={!available}
          className={`aspect-square flex items-center justify-center rounded-full text-sm transition-all ${
            selected
              ? 'bg-gradient-to-r from-[#800020] to-[#4B0082] text-white scale-105 shadow-lg'
              : available
              ? 'bg-[#FFF9F0] hover:bg-[#D4AF37]/20 text-[#800020]'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[#D4AF37]/20 p-6 mb-8 shadow-xl">

        <div className="flex items-center justify-between mb-6">
          <button onClick={previousMonth} className="p-2 rounded-full hover:bg-[#FFF9F0]">
            <ChevronLeft className="w-5 h-5 text-[#800020]" />
          </button>

          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-serif font-bold text-[#800020]">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
          </div>

          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-[#FFF9F0]">
            <ChevronRight className="w-5 h-5 text-[#800020]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 text-sm font-semibold text-[#800020]">
          {dayNamesShort.map((d) => (
            <div key={d} className="text-center">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {renderCalendar()}
        </div>
      </div>

      {selectedDate && (
        <div>
          <h4 className="font-serif font-bold text-[#800020] mb-4">
            Select Time Slot
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => onTimeSelect(time)}
                className={`py-3 rounded-full text-sm transition-all ${
                  selectedTime === time
                    ? 'bg-gradient-to-r from-[#800020] to-[#4B0082] text-white shadow-lg'
                    : 'bg-[#FFF9F0] text-[#800020] hover:bg-[#D4AF37]/20'
                }`}
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
