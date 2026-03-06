import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { SareeCard } from '@/components/features/SareeCard';

export function WishlistPage() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] via-white to-[#F5E6D3] flex items-center justify-center px-4">
        <div className="text-center luxury-fade-in-up max-w-md">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-[#D4AF37]/20 to-[#800020]/10 rounded-full flex items-center justify-center animate-pulse-slow">
            <Heart className="w-16 h-16 text-[#D4AF37]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#800020] mb-4">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 mb-8 text-sm md:text-base">
            Save your favorite sarees to buy them later and keep track of what you love
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#800020] to-[#4B0082] hover:from-[#4B0082] hover:to-[#800020] text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-xl"
          >
            Browse Sarees
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] via-white to-[#F5E6D3] py-8 md:py-12 pt-24 md:pt-38 pb-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 md:mb-12 luxury-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 px-4 md:px-6 py-2 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/40">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[#800020]">
              Your Favorites
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#800020] mb-3">
            My Wishlist
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
            <p className="text-base md:text-lg font-medium">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {wishlist.map((saree, index) => (
            <div
              key={saree.id}
              className="luxury-card-stagger"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <SareeCard saree={saree} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {wishlist.length > 0 && (
          <div className="mt-12 md:mt-16 text-center luxury-fade-in-up">
            <div className="inline-block p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-[#D4AF37]/20">
              <p className="text-gray-700 mb-4 text-sm md:text-base">
                Found everything you love?
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-[#800020] font-semibold hover:text-[#D4AF37] transition-colors text-sm md:text-base"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .luxury-fade-in {
          animation: luxuryFadeIn 0.8s ease-out both;
        }

        .luxury-fade-in-up {
          animation: luxuryFadeInUp 1s ease-out both;
        }

        .luxury-card-stagger {
          animation: luxuryCardEntry 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes luxuryFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes luxuryFadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes luxuryCardEntry {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-pulse-slow {
          animation: pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulseSlow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}