import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCarts';
import { formatCurrency } from '@/lib/utils';

export function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 2999 ? 0 : 150;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] via-white to-[#F5E6D3] flex items-center justify-center px-4">
        <div className="text-center luxury-fade-in-up max-w-md">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-[#D4AF37]/20 to-[#800020]/10 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-[#D4AF37]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#800020] mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8 text-sm md:text-base">
            Discover our beautiful collection of handcrafted sarees
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#800020] to-[#4B0082] hover:from-[#4B0082] hover:to-[#800020] text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-xl"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] via-white to-[#F5E6D3] pt-28 md:pt-32 pb-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 md:mb-12 pt-24 luxury-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 px-4 md:px-6 py-2 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/40">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[#800020]">
              Your Selection
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#800020]">
            Shopping Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {cart.map((item, index) => (
              <div
                key={item.saree.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-[#D4AF37]/20 p-4 md:p-6 luxury-card-stagger hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                  
                  {/* Image */}
                  <Link 
                    to={`/product/${item.saree.id}`} 
                    className="flex-shrink-0 w-full sm:w-32 md:w-40 group"
                  >
                    <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={item.saree.images[0]}
                        alt={item.saree.name}
                        className="w-full aspect-[4/5] sm:w-32 sm:h-40 md:w-40 md:h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 space-y-3 md:space-y-4">
                    <div>
                      <Link
                        to={`/product/${item.saree.id}`}
                        className="font-serif font-bold text-lg md:text-xl text-[#800020] hover:text-[#D4AF37] mb-2 block transition-colors line-clamp-2"
                      >
                        {item.saree.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-600">
                        <span className="px-2 py-1 bg-[#FFF9F0] rounded-full">{item.saree.fabric}</span>
                        <span className="text-[#D4AF37]">•</span>
                        <span className="px-2 py-1 bg-[#FFF9F0] rounded-full">{item.saree.color}</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3 bg-gradient-to-r from-[#FFF9F0] to-[#F5E6D3] rounded-full p-1 border border-[#D4AF37]/30">
                        <button
                          onClick={() => updateQuantity(item.saree.id, item.quantity - 1)}
                          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full hover:bg-[#D4AF37] hover:text-white transition-all shadow-md hover:scale-110"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 md:w-10 text-center font-bold text-[#800020]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.saree.id, item.quantity + 1)}
                          disabled={item.quantity >= item.saree.stock}
                          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full hover:bg-[#D4AF37] hover:text-white transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.saree.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-white hover:bg-red-500 border-2 border-red-500 rounded-full transition-all hover:scale-105"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-semibold hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right sm:text-left lg:text-right space-y-1 sm:min-w-[120px]">
                    <p className="text-2xl md:text-3xl font-serif font-bold text-[#800020]">
                      {formatCurrency(item.saree.price * item.quantity)}
                    </p>
                    {item.saree.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatCurrency(item.saree.originalPrice * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl border border-[#D4AF37]/20 p-6 md:p-8 sticky top-24 luxury-fade-in">
              
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#800020]">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b-2 border-[#D4AF37]/30">
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm md:text-base">Subtotal</span>
                  <span className="font-bold text-[#800020]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm md:text-base">Shipping</span>
                  <span className="font-bold text-[#800020]">
                    {shipping === 0 ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <Sparkles className="w-4 h-4" /> FREE
                      </span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="p-3 bg-gradient-to-r from-[#FFF9F0] to-[#F5E6D3] rounded-xl border border-[#D4AF37]/30">
                    <p className="text-xs md:text-sm text-gray-700">
                      Add <span className="font-bold text-[#800020]">{formatCurrency(2999 - subtotal)}</span> more for free shipping
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-br from-[#800020] to-[#4B0082] rounded-2xl">
                <span className="text-white font-semibold text-sm md:text-base">Total</span>
                <span className="text-2xl md:text-3xl font-serif font-bold text-[#D4AF37]">{formatCurrency(total)}</span>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-gradient-to-r from-[#800020] to-[#4B0082] hover:from-[#4B0082] hover:to-[#800020] text-white text-center px-6 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-xl mb-4 text-sm md:text-base"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/shop"
                className="block w-full text-center text-[#800020] font-semibold hover:text-[#D4AF37] transition-colors text-sm md:text-base"
              >
                Continue Shopping
              </Link>

              {/* Trust Signals */}
              <div className="mt-6 pt-6 border-t-2 border-[#D4AF37]/30 space-y-3">
                {[
                  { text: 'Secure Checkout', color: 'from-green-400 to-emerald-500' },
                  { text: '7-Day Easy Returns', color: 'from-blue-400 to-blue-500' },
                  { text: '100% Authentic Products', color: 'from-purple-400 to-purple-500' },
                ].map(({ text, color }) => (
                  <div key={text} className="flex items-center gap-3 text-xs md:text-sm text-gray-700">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
      `}</style>
    </div>
  );
}