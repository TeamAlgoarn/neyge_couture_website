import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Star } from 'lucide-react';

import hero1 from '@/assets/img8.jpg';
import hero2 from '@/assets/img7.jpg';
import hero3 from '@/assets/img9.jpg';
import hero4 from '@/assets/img10.jpg';
import hero5 from '@/assets/img8.jpg';


const heroImages = [hero1, hero2, hero3, hero4, hero5];

export function HeroBanner() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Your Original Scroll Animation Logic (Slightly Refined)
  const getCardTransform = (index: number, total: number) => {
    const scrollProgress = Math.min(scrollY / 600, 1);
    const centerIndex = Math.floor(total / 2);

    const initialRotation = (index - centerIndex) * 4;
    const initialX = (index - centerIndex) * 60;
    const initialY = Math.abs(index - centerIndex) * 15;

    const finalRotation = (index - centerIndex) * 2;
    const finalX = (index - centerIndex) * 320;
    const finalY = 0;

    const rotation =
      initialRotation +
      (finalRotation - initialRotation) * scrollProgress;

    const translateX =
      initialX + (finalX - initialX) * scrollProgress;

    const translateY =
      initialY + (finalY - initialY) * scrollProgress;

    const scale = 0.85 + scrollProgress * 0.15;

    return {
      transform: `
        translate(${translateX}px, ${translateY}px)
        rotate(${rotation}deg)
        scale(${scale})
      `,
      zIndex:
        index === centerIndex
          ? total + 10
          : total - Math.abs(index - centerIndex),
      opacity: 0.7 + scrollProgress * 0.3,
    };
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F5E6D3] via-white to-[#F5E6D3] pt-32 pb-20">

      {/* Parallax Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#800020]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#4B0082]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Silk Texture */}
      <div className="absolute inset-0 silk-overlay pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Luxury Text Section */}
        <div className={`text-center mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          <div className="inline-flex items-center gap-3 mb-8 px-8 py-3 bg-white/80 backdrop-blur-md rounded-full border border-[#D4AF37]/40 shadow-xl">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="tracking-[0.3em] text-sm font-semibold text-[#800020] uppercase">
              Heritage Reimagined
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-serif font-bold mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-[#800020] via-[#4B0082] to-[#800020] bg-clip-text text-transparent">
              A Symphony of Silk
            </span>
            <span className="block text-5xl mt-4 bg-gradient-to-r from-[#D4AF37] via-[#800020] to-[#D4AF37] bg-clip-text text-transparent">
              Crafted for Generations
            </span>
          </h1>

          <p className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed mb-6">
            Each weave tells a story — of heritage, artistry, and timeless elegance.
            Our master artisans craft every saree with devotion,
            preserving centuries of tradition while embracing modern sophistication.
          </p>

          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Discover heirloom pieces designed not just to be worn,
            but to be cherished and passed through generations.
          </p>

          <div className="flex justify-center mt-8 text-[#D4AF37]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#D4AF37]" />
            ))}
          </div>
        </div>

        {/* Animated Cards (Desktop + Mobile Same Logic) */}
        <div className="relative h-[550px] mb-24 perspective-hero">
          <div className="relative h-full flex items-center justify-center transform-style-3d">

            {heroImages.map((image, index) => {
              const style = getCardTransform(index, heroImages.length);

              return (
                <div
                  key={index}
                  className="absolute w-[300px] sm:w-[340px] md:w-[360px] lg:w-[380px] transition-all duration-700 ease-out"
                  style={style}
                >
                  <div className="relative h-[420px] sm:h-[480px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">

                    <img
                      src={image}
                      alt="Luxury Saree"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                    <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-[#D4AF37]/60 transition duration-500"></div>

                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-[#800020] via-[#4B0082] to-[#800020] text-white rounded-full font-semibold text-lg shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-500 hover:scale-105 group"
          >
            Explore The Collection
            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');

        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        .perspective-hero {
          perspective: 2000px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .silk-overlay {
          background-image: url("https://www.transparenttextures.com/patterns/silk.png");
          opacity: 0.05;
          mix-blend-mode: multiply;
        }
      `}</style>
    </section>
  );
}
