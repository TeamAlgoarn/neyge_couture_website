import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCarts';
import { authService } from '@/lib/auth';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { CreditCard, Smartphone, Wallet, Sparkles, MapPin, Shield } from 'lucide-react';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const user = authService.getCurrentUser();
  
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 2999 ? 0 : 150;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please log in to continue');
      navigate('/login');
      return;
    }

    if (user.addresses.length === 0) {
      toast.error('Please add a delivery address');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const orderId = 'ORD' + Date.now();
      
      // Mock order creation
      const mockOrder = {
        id: orderId,
        userId: user.id,
        items: cart,
        total: subtotal,
        discount: 0,
        finalTotal: total,
        status: 'confirmed',
        shippingAddress: user.addresses[0],
        paymentMethod,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      // Store order in localStorage
      const orders = JSON.parse(localStorage.getItem('handloom_orders') || '[]');
      orders.push(mockOrder);
      localStorage.setItem('handloom_orders', JSON.stringify(orders));

      clearCart();
      setIsProcessing(false);
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${orderId}`);
    }, 2000);
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const paymentOptions = [
    {
      value: 'upi',
      icon: Smartphone,
      title: 'UPI Payment',
      subtitle: 'Pay via UPI apps',
      color: 'from-blue-400 to-blue-600',
    },
    {
      value: 'card',
      icon: CreditCard,
      title: 'Credit / Debit Card',
      subtitle: 'Visa, Mastercard, Rupay',
      color: 'from-purple-400 to-purple-600',
    },
    {
      value: 'wallet',
      icon: Wallet,
      title: 'Wallets',
      subtitle: 'Paytm, PhonePe, Amazon Pay',
      color: 'from-green-400 to-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] via-white to-[#F5E6D3] pt-24 md:pt-38 pb-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 md:mb-12 pt-24 luxury-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 px-4 md:px-6 py-2 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/40">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[#800020]">
              Secure Checkout
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#800020]">
            Complete Your Order
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery Address */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-[#D4AF37]/20 p-6 md:p-8 luxury-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#800020] to-[#4B0082] rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#800020]">
                  Delivery Address
                </h2>
              </div>
              
              {user.addresses.length > 0 ? (
                <div className="border-2 border-[#D4AF37]/30 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-[#FFF9F0] to-[#F5E6D3] hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2"></div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-[#800020] mb-1">{user.addresses[0].name}</p>
                      <p className="text-gray-700 font-medium mb-2">{user.addresses[0].phone}</p>
                      <p className="text-gray-600 text-sm md:text-base">
                        {user.addresses[0].addressLine1}
                        {user.addresses[0].addressLine2 && `, ${user.addresses[0].addressLine2}`}
                      </p>
                      <p className="text-gray-600 text-sm md:text-base">
                        {user.addresses[0].city}, {user.addresses[0].state} - {user.addresses[0].pincode}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-[#D4AF37]/30 rounded-2xl">
                  <MapPin className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
                  <p className="text-gray-600">No address added. Please add a delivery address.</p>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-[#D4AF37]/20 p-6 md:p-8 luxury-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#800020] to-[#4B0082] rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#800020]">
                  Payment Method
                </h2>
              </div>
              
              <div className="space-y-4">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = paymentMethod === option.value;
                  
                  return (
                    <label 
                      key={option.value}
                      className={`flex items-center gap-4 p-4 md:p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? 'border-[#D4AF37] bg-gradient-to-r from-[#FFF9F0] to-[#F5E6D3] shadow-lg scale-[1.02]'
                          : 'border-gray-200 bg-white hover:border-[#D4AF37]/50 hover:shadow-md'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.value}
                        checked={isSelected}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center shadow-lg ${isSelected ? 'scale-110' : ''} transition-transform`}>
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-bold text-[#800020] text-sm md:text-base">{option.title}</p>
                        <p className="text-xs md:text-sm text-gray-600">{option.subtitle}</p>
                      </div>
                      
                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl border border-[#D4AF37]/20 p-6 md:p-8 sticky top-24 luxury-fade-in" style={{ animationDelay: '200ms' }}>
              
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#800020]">Order Summary</h2>
              </div>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.saree.id} className="flex gap-3 p-3 bg-gradient-to-r from-[#FFF9F0] to-[#F5E6D3] rounded-xl border border-[#D4AF37]/20">
                    <img
                      src={item.saree.images[0]}
                      alt={item.saree.name}
                      className="w-16 h-20 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#800020] line-clamp-1 mb-1">{item.saree.name}</p>
                      <p className="text-xs text-gray-600 mb-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#800020]">
                        {formatCurrency(item.saree.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
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
              </div>

              <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-br from-[#800020] to-[#4B0082] rounded-2xl">
                <span className="text-white font-semibold text-sm md:text-base">Total Amount</span>
                <span className="text-2xl md:text-3xl font-serif font-bold text-[#D4AF37]">{formatCurrency(total)}</span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#800020] to-[#4B0082] hover:from-[#4B0082] hover:to-[#800020] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-xl mb-4 text-sm md:text-base relative overflow-hidden group"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Place Order'
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>

              <p className="text-xs text-center text-gray-600">
                By placing this order, you agree to our Terms & Conditions
              </p>
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

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F5E6D3;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #D4AF37, #800020);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #800020, #D4AF37);
        }
      `}</style>
    </div>
  );
}