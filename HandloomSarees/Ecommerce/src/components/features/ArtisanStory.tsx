import craftsmanshipImg from '@/assets/img9.jpg';
import { Sparkles } from 'lucide-react';

export function ArtisanStory() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-[#F5E6D3] via-white to-[#F5E6D3] overflow-hidden">

      {/* Soft Luxury Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#800020]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4B0082]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/70 backdrop-blur-md border border-[#D4AF37]/40 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs tracking-[0.3em] uppercase text-[#800020] font-semibold">
                Our Heritage
              </span>
            </div>

            <h2 className="text-5xl font-serif font-bold text-[#800020] leading-tight">
              Empowering Traditional Artisans
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed">
              Every saree is a living testament to devotion, discipline,
              and generations of artistry. We collaborate directly with master
              weavers to preserve India’s textile heritage while ensuring fair,
              sustainable livelihoods.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              From Kanchipuram’s silk looms to Gujarat’s khadi workshops,
              each creation carries the soul of craftsmanship.
            </p>

            {/* Luxury Stats */}
            <div className="grid grid-cols-3 gap-8 pt-6">
              {[
                { value: '500+', label: 'Artisan Families' },
                { value: '15+', label: 'States Represented' },
                { value: '50+', label: 'Weaving Techniques' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-light">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-[#800020] to-[#4B0082] text-white font-semibold hover:scale-105 transition-all shadow-xl hover:shadow-[#D4AF37]/40">
              Meet Our Artisans
            </button>
          </div>

          {/* Image */}
          <div className="relative group">
            <div className="absolute -top-6 -left-6 w-full h-full bg-[#D4AF37]/20 rounded-3xl -z-10 blur-xl"></div>

            <img
              src={craftsmanshipImg}
              alt="Handloom weaving craftsmanship"
              className="rounded-3xl shadow-2xl w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-xs">
              <p className="text-sm italic text-gray-700">
                “Each thread carries centuries of heritage and pride.”
              </p>
              <p className="text-sm font-semibold text-[#800020] mt-2">
                – Master Weaver, Kanchipuram
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
