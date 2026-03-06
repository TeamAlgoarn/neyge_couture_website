import { Sparkles } from 'lucide-react';

export function ArtisanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] via-white to-[#F5E6D3] pt-28 pb-20 px-4">

      <div className="max-w-6xl mx-auto">

        {/* HERO SECTION */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-2 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/40">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm font-semibold uppercase tracking-wider text-[#800020]">
              Our Legacy
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#800020] mb-6">
            Weaving Stories, Not Just Sarees
          </h1>

          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Every thread carries a legacy. Every weave preserves a tradition.
            Behind every saree lies the skilled hands of master artisans who
            have inherited their craft across generations.
          </p>
        </div>

        {/* SECTION 1 */}
        <section className="mb-20">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/20 p-10 md:p-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#800020] mb-6">
              Where Heritage Meets Craftsmanship
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              For centuries, India’s weaving communities have preserved
              techniques passed down through generations. From intricate zari
              borders to hand-dyed natural fabrics, each saree reflects
              patience, precision, and pride.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Our artisans do not just create garments — they create heirlooms.
              Every piece is woven on traditional looms, often taking days or
              even weeks to complete.
            </p>

            <p className="text-gray-600 italic">
              The rhythm of the loom is not just work — it is tradition in motion.
            </p>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="mb-20">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/20 p-10 md:p-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#800020] mb-8">
              The Hands Behind the Heritage
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Our artisans come from renowned weaving regions across India —
              where craftsmanship is not a profession, but a way of life.
            </p>

            <p className="text-gray-700 leading-relaxed mb-8">
              Many began learning the art as children, sitting beside their
              elders, understanding the dance between thread and tension.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[#800020] font-medium">
              <div className="bg-[#FFF9F0] rounded-2xl p-6 border border-[#D4AF37]/20">
                Ancient weaving techniques
              </div>
              <div className="bg-[#FFF9F0] rounded-2xl p-6 border border-[#D4AF37]/20">
                Sustainable production practices
              </div>
              <div className="bg-[#FFF9F0] rounded-2xl p-6 border border-[#D4AF37]/20">
                Cultural storytelling through fabric
              </div>
              <div className="bg-[#FFF9F0] rounded-2xl p-6 border border-[#D4AF37]/20">
                Deep respect for natural materials
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 */}
        <section className="mb-20">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/20 p-10 md:p-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#800020] mb-6">
              Crafting Change, One Loom at a Time
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              When you choose handloom, you support rural artisan families,
              fair wages, ethical sourcing, and the preservation of disappearing crafts.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-10">
              <div>
                <h3 className="text-3xl font-bold text-[#800020]">500+</h3>
                <p className="text-sm text-gray-600">Artisans Empowered</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#800020]">12</h3>
                <p className="text-sm text-gray-600">Weaving Regions</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#800020]">100%</h3>
                <p className="text-sm text-gray-600">Handloom Certified</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#800020]">0</h3>
                <p className="text-sm text-gray-600">Machine Production</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 */}
        <section>
          <div className="bg-gradient-to-br from-[#800020] to-[#4B0082] text-white rounded-3xl shadow-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              A Commitment to Authenticity
            </h2>

            <p className="max-w-3xl mx-auto text-white/90 leading-relaxed mb-8">
              Every saree you wear carries a human story — a legacy woven with
              dedication, resilience, and artistry.
            </p>

            <p className="italic text-[#D4AF37]">
              When you drape our sarees, you don’t just wear elegance —
              you wear tradition.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
