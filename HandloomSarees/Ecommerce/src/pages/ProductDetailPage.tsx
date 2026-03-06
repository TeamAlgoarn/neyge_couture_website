import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, Shield, RefreshCw, Award, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { SAREES } from '@/constants/sarees';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/hooks/useCarts';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';
import { SareeCard } from '@/components/features/SareeCard';

export function ProductDetailPage() {
  const { id } = useParams();
  const saree = SAREES.find((s) => s.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!saree) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5E6D3] to-white">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-[#800020] mb-4">Product not found</h2>
          <Link to="/shop" className="text-[#D4AF37] hover:underline font-semibold">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(saree.id);
  const relatedSarees = SAREES.filter(
    (s) => s.id !== saree.id && (s.fabric === saree.fabric || s.occasion === saree.occasion)
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(saree);
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = () => {
    toggleWishlist(saree);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % saree.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + saree.images.length) % saree.images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] via-white to-[#F5E6D3]">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        
        {/* Breadcrumb */}
        <nav className="text-xs md:text-sm text-gray-600 mb-6 md:mb-10 animate-fade-in">
          <Link to="/" className="hover:text-[#800020] transition-colors">Home</Link>
          <span className="mx-2 text-[#D4AF37]">/</span>
          <Link to="/shop" className="hover:text-[#800020] transition-colors">Shop</Link>
          <span className="mx-2 text-[#D4AF37]">/</span>
          <span className="text-[#800020] font-semibold">{saree.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12 md:mb-20 py-20 md:py-20">
          
          {/* Images Section */}
          <div className="luxury-fade-in">
            <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden mb-4 md:mb-6 group shadow-2xl border border-[#D4AF37]/20">
              <div className="w-full" style={{ paddingBottom: '133.33%', position: 'relative' }}>
                <img
                  src={saree.images[selectedImage]}
                  alt={saree.name}
                  className="absolute inset-0 w-full h-full object-contain p-2 sm:p-0 sm:object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Image Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {saree.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm hover:bg-white p-2 md:p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-[#D4AF37]/30"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-[#800020]" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm hover:bg-white p-2 md:p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-[#D4AF37]/30"
                  >
                    <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-[#800020]" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {saree.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium">
                  {selectedImage + 1} / {saree.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            {saree.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 md:gap-4">
                {saree.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedImage === index
                        ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30 scale-105'
                        : 'border-gray-200 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${saree.name} ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="luxury-fade-in-up space-y-6 md:space-y-8">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {saree.newArrival && (
                <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg animate-pulse-slow flex items-center gap-1">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                  New Arrival
                </span>
              )}
              {saree.bestSeller && (
                <span className="bg-gradient-to-r from-[#800020] to-[#4B0082] text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg flex items-center gap-1">
                  <Award className="w-3 h-3 md:w-4 md:h-4" />
                  Best Seller
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#800020] leading-tight">
              {saree.name}
            </h1>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 md:w-5 md:h-5 transition-transform hover:scale-110 ${
                      i < Math.floor(saree.rating)
                        ? 'fill-[#D4AF37] text-[#D4AF37]'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm md:text-base text-gray-600">
                {saree.rating} ({saree.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-3 md:gap-4 p-4 md:p-6 bg-gradient-to-br from-[#FFF9F0] to-[#F5E6D3] rounded-2xl border border-[#D4AF37]/30">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#800020] font-serif">
                {formatCurrency(saree.price)}
              </span>
              {saree.originalPrice && (
                <>
                  <span className="text-lg md:text-xl text-gray-500 line-through">
                    {formatCurrency(saree.originalPrice)}
                  </span>
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs md:text-sm font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg">
                    {Math.round(((saree.originalPrice - saree.price) / saree.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
              {saree.description}
            </p>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 p-4 md:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#D4AF37]/20 shadow-lg">
              <div className="space-y-1">
                <span className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">Fabric</span>
                <p className="font-semibold text-sm md:text-base text-[#800020]">{saree.fabric}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">Occasion</span>
                <p className="font-semibold text-sm md:text-base text-[#800020]">{saree.occasion}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">Color</span>
                <p className="font-semibold text-sm md:text-base text-[#800020]">{saree.color}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">Availability</span>
                <p className={`font-semibold text-sm md:text-base flex items-center gap-2 ${saree.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${saree.stock > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                  {saree.stock > 0 ? `In Stock (${saree.stock})` : 'Out of Stock'}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button
                onClick={handleAddToCart}
                disabled={saree.stock === 0}
                className="flex-1 bg-gradient-to-r from-[#800020] to-[#4B0082] hover:from-[#4B0082] hover:to-[#800020] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/40 text-sm md:text-base"
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`px-4 md:px-6 py-3 md:py-4 rounded-full border-2 transition-all duration-300 hover:scale-105 ${
                  inWishlist
                    ? 'border-red-500 bg-red-50 text-red-500 shadow-lg shadow-red-200'
                    : 'border-[#D4AF37] bg-white hover:bg-[#D4AF37]/10 text-[#D4AF37] shadow-lg'
                }`}
              >
                <Heart className={`w-5 h-5 md:w-6 md:h-6 transition-all ${inWishlist ? 'fill-current scale-110' : ''}`} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 py-6 md:py-8 border-y-2 border-[#D4AF37]/30">
              {[
                { icon: Truck, label: 'Free Shipping', color: 'from-orange-400 to-orange-500' },
                { icon: Shield, label: '100% Authentic', color: 'from-blue-400 to-blue-500' },
                { icon: RefreshCw, label: '7-Day Returns', color: 'from-green-400 to-green-500' },
                { icon: Award, label: 'Quality Certified', color: 'from-purple-400 to-purple-500' },
              ].map(({ icon: Icon, label, color }, index) => (
                <div 
                  key={label} 
                  className="text-center luxury-card-stagger"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${color} rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-gray-700">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="mb-12 md:mb-20 luxury-fade-in-up">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#D4AF37]/20 p-6 md:p-10">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 md:mb-10 pb-6 border-b-2 border-[#D4AF37]/30">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37]" />
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#800020]">Product Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              
              {/* Specifications */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg md:text-xl text-[#800020] mb-4 md:mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#800020] to-[#D4AF37] rounded-full"></div>
                  Specifications
                </h3>
                <dl className="space-y-3 md:space-y-4">
                  {[
                    { label: 'Length', value: saree.length },
                    { label: 'Blouse Piece', value: saree.blousePiece ? 'Included' : 'Not Included' },
                    { label: 'Weaving Technique', value: saree.weavingTechnique },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-[#FFF9F0] to-transparent rounded-xl border-l-4 border-[#D4AF37] hover:shadow-md transition-shadow">
                      <dt className="text-sm md:text-base text-gray-600 font-medium">{label}</dt>
                      <dd className="text-sm md:text-base font-bold text-[#800020]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Care Instructions */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg md:text-xl text-[#800020] mb-4 md:mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#800020] to-[#D4AF37] rounded-full"></div>
                  Care Instructions
                </h3>
                <div className="space-y-2 md:space-y-3">
                  {saree.careInstructions.split('.').filter(Boolean).map((instruction, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-2 md:p-3 hover:bg-[#FFF9F0] rounded-xl transition-colors"
                    >
                      <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                      <span className="text-xs md:text-sm text-gray-700">{instruction.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Artisan Story */}
              <div className="md:col-span-2 mt-4 md:mt-6">
                <h3 className="font-bold text-lg md:text-xl text-[#800020] mb-4 md:mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#800020] to-[#D4AF37] rounded-full"></div>
                  Artisan Story
                </h3>
                <div className="p-4 md:p-6 bg-gradient-to-br from-[#FFF9F0] to-[#F5E6D3] rounded-2xl border border-[#D4AF37]/30">
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">{saree.artisanDetails}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedSarees.length > 0 && (
          <div className="luxury-fade-in">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 md:px-6 py-2 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/40">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#D4AF37]" />
                <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[#800020]">
                  Similar Styles
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#800020]">
                You May Also Like
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {relatedSarees.map((relatedSaree, index) => (
                <div
                  key={relatedSaree.id}
                  className="luxury-card-stagger"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <SareeCard saree={relatedSaree} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Luxury Animations */
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

        /* Mobile Optimizations */
        @media (max-width: 640px) {
          .luxury-fade-in,
          .luxury-fade-in-up {
            animation-duration: 0.6s;
          }
        }
      `}</style>
    </div>
  );
}