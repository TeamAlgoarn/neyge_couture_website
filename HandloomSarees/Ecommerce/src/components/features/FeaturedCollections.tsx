import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import img1 from '@/assets/img8.jpg';
import img2 from '@/assets/img9.jpg';
import img3 from '@/assets/img10.jpg';

const collections = [
  {
    title: 'Wedding Collection',
    description: 'Luxurious silk sarees for your special day',
    image: img1,
    link: '/shop?occasion=Wedding',
    overlay: 'from-[#800020]/80 via-[#4B0082]/60 to-black/70',
  },
  {
    title: 'Festive Sarees',
    description: 'Celebrate traditions with vibrant colors',
    image: img2,
    link: '/shop?occasion=Festive',
    overlay: 'from-[#4B0082]/80 via-[#800020]/60 to-black/70',
  },
  {
    title: 'Casual Elegance',
    description: 'Comfortable cotton for everyday wear',
    image: img3,
    link: '/shop?occasion=Casual',
    overlay: 'from-[#D4AF37]/50 via-[#800020]/70 to-black/80',
  },
];

export function FeaturedCollections() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-28 relative overflow-hidden bg-gradient-to-b from-[#F5E6D3] via-white to-[#F5E6D3]"
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 mb-5 px-6 py-2 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/40">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm font-semibold tracking-wider text-[#800020] uppercase">
              Curated Collections
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#800020] mb-5">
            Featured Collections
          </h2>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-light">
            Discover timeless handwoven elegance crafted by master artisans.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {collections.map((collection, index) => (
            <Link
              key={index}
              to={collection.link}
              className={`group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Image */}
              <img
                src={collection.image}
                alt={collection.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              />

              {/* Luxury Overlay (No White Fade) */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${collection.overlay} opacity-90 group-hover:opacity-95 transition duration-500`}
              />

              {/* Glass Content Panel */}
              <div className="absolute bottom-0 w-full p-8 backdrop-blur-md bg-black/30 border-t border-[#D4AF37]/40">
                <div className="w-14 h-1 bg-[#D4AF37] mb-4 transition-all duration-500 group-hover:w-24"></div>

                <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3 group-hover:-translate-y-1 transition duration-500">
                  {collection.title}
                </h3>

                <p className="text-white/90 text-lg mb-6 font-light group-hover:-translate-y-1 transition duration-500 delay-75">
                  {collection.description}
                </p>

                <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-lg group-hover:gap-4 transition-all duration-500">
                  <span className="relative">
                    Explore Now
                    <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-[#D4AF37] group-hover:w-full transition-all duration-500"></span>
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                </div>
              </div>

              {/* Golden Shine */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-in-out"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');

        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        .font-light {
          font-family: 'Cormorant Garamond', serif;
        }
      `}</style>
    </section>
  );
}
