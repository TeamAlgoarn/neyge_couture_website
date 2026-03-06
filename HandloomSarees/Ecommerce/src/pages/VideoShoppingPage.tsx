import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Star, Globe, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { FASHION_ADVISORS, TIME_SLOTS } from '@/constants/advisors';
import type { FashionAdvisor, VideoConsultation } from '@/types';
import { CalendarScheduler } from '@/components/features/CalenderScheduler';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';

export function VideoShoppingPage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [selectedAdvisor, setSelectedAdvisor] = useState<FashionAdvisor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [preferences, setPreferences] = useState({
    occasion: '',
    fabric: '',
    priceRange: '',
    colorPreference: '',
    notes: '',
  });

  const [step, setStep] =
    useState<'advisors' | 'schedule' | 'preferences' | 'confirm'>('advisors');

  const handleAdvisorSelect = (advisor: FashionAdvisor) => {
    setSelectedAdvisor(advisor);
    setSelectedDate(null);
    setSelectedTime(null);
    setStep('schedule');
  };

  const handleScheduleNext = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }
    setStep('preferences');
  };

  const handleBookConsultation = () => {
    if (!user) {
      toast.error('Please log in to book a consultation');
      navigate('/login');
      return;
    }

    if (!selectedAdvisor || !selectedDate || !selectedTime) {
      toast.error('Please complete all booking details');
      return;
    }

    const consultation: VideoConsultation = {
      id: 'CONSULT' + Date.now(),
      userId: user.id,
      advisorId: selectedAdvisor.id,
      date: selectedDate.toISOString(),
      time: selectedTime,
      duration: 30,
      status: 'scheduled',
      sareePreferences: {
        occasion: preferences.occasion || undefined,
        fabric: preferences.fabric || undefined,
        priceRange: preferences.priceRange || undefined,
        colorPreference: preferences.colorPreference || undefined,
      },
      notes: preferences.notes || undefined,
      createdAt: new Date().toISOString(),
    };

    const consultations = JSON.parse(
      localStorage.getItem('handloom_consultations') || '[]'
    );
    consultations.push(consultation);
    localStorage.setItem(
      'handloom_consultations',
      JSON.stringify(consultations)
    );

    toast.success('Video consultation booked successfully!');
    setStep('confirm');
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] via-white to-[#F5E6D3] pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-2 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/40">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm font-semibold uppercase tracking-wider text-[#800020]">
              Premium Experience
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#800020] mb-6">
            Luxury Video Shopping
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Book a private session with our expert stylists and explore
            handcrafted sarees in real time.
          </p>
        </div>

        {/* STEP 1 — ADVISORS */}
        {step === 'advisors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {FASHION_ADVISORS.map((advisor) => (
              <div
                key={advisor.id}
                onClick={() => handleAdvisorSelect(advisor)}
                className="bg-white rounded-3xl shadow-xl border border-[#D4AF37]/20 p-8 hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <img
                    src={advisor.image}
                    alt={advisor.name}
                    className="w-full sm:w-40 h-56 sm:h-40 object-cover rounded-2xl"
                  />
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-[#800020] mb-2">
                      {advisor.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                      <span>{advisor.rating}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{advisor.bio}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {advisor.experience} years
                      <Globe className="w-4 h-4 ml-4" />
                      {advisor.languages.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 2 — SCHEDULE */}
        {step === 'schedule' && selectedAdvisor && (
          <div className="bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/20 p-10 max-w-4xl mx-auto">
            <button
              onClick={() => setStep('advisors')}
              className="text-[#800020] hover:text-[#D4AF37] mb-6 font-semibold"
            >
              ← Change Advisor
            </button>

            <CalendarScheduler
              availableDays={selectedAdvisor.availability}
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              timeSlots={TIME_SLOTS}
            />

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setStep('advisors')}
                className="flex-1 border border-gray-300 px-6 py-4 rounded-full font-semibold"
              >
                Back
              </button>

              <button
                onClick={handleScheduleNext}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 bg-gradient-to-r from-[#800020] to-[#4B0082] text-white px-6 py-4 rounded-full font-semibold disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — PREFERENCES */}
        {step === 'preferences' && (
          <div className="bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/20 p-10 max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-[#800020] mb-6">
              Your Saree Preferences
            </h2>

            <div className="space-y-5">
              {['occasion','fabric','priceRange','colorPreference'].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={`Enter ${field}`}
                  value={(preferences as any)[field]}
                  onChange={(e) =>
                    setPreferences({ ...preferences, [field]: e.target.value })
                  }
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              ))}

              <textarea
                rows={4}
                placeholder="Additional notes"
                value={preferences.notes}
                onChange={(e) =>
                  setPreferences({ ...preferences, notes: e.target.value })
                }
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setStep('schedule')}
                className="flex-1 border border-gray-300 px-6 py-4 rounded-full font-semibold"
              >
                Back
              </button>

              <button
                onClick={handleBookConsultation}
                className="flex-1 bg-gradient-to-r from-[#800020] to-[#4B0082] text-white px-6 py-4 rounded-full font-semibold"
              >
                Book Consultation
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — CONFIRM */}
        {step === 'confirm' && selectedAdvisor && selectedDate && selectedTime && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center border border-[#D4AF37]/20">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-serif font-bold text-[#800020] mb-4">
              Consultation Confirmed
            </h2>
            <p className="text-gray-600 mb-8">
              {formatDate(selectedDate)} at {selectedTime}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex-1 bg-gradient-to-r from-[#800020] to-[#4B0082] text-white px-6 py-4 rounded-full font-semibold"
              >
                View My Consultations
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="flex-1 border border-gray-300 px-6 py-4 rounded-full font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
