import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCarts';
import { useWishlist } from '@/hooks/useWishlist';
import { authService } from '@/lib/auth';

export function Header() {
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-[#D4AF37]/20'
          : 'bg-white/80 backdrop-blur-md border-b border-white/30'
      }`}
    >
      <div className="container mx-auto px-6">

        {/* Main Header */}
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`rounded-xl bg-gradient-to-br from-[#800020] to-[#4B0082] flex items-center justify-center transition-all duration-500 ${scrolled ? 'w-10 h-10' : 'w-12 h-12'}`}>
              <span className={`text-white font-bold font-serif ${scrolled ? 'text-xl' : 'text-2xl'}`}>H</span>
            </div>
            <div>
              <h1 className={`font-serif font-bold text-[#800020] transition-all duration-500 ${scrolled ? 'text-xl' : 'text-2xl'}`}>
                Handloom Sarees
              </h1>
              <p className="text-xs text-gray-600 font-light">
                Artisan Heritage Collection
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { to: '/', label: 'Home' },
              { to: '/shop', label: 'Shop' },
              { to: '/video-shopping', label: 'Video Shopping' },
              { to: '/collections/cotton', label: 'Cotton' },
              { to: '/about', label: 'Our Artisans' }
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="relative font-medium text-gray-800 hover:text-[#800020] transition-all duration-300 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">

            <button className="hidden md:block p-2 rounded-full hover:bg-gray-100 transition">
              <Search className="w-5 h-5 text-gray-800" />
            </button>

            <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-gray-100 transition">
              <Heart className="w-5 h-5 text-gray-800" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#800020] to-[#4B0082] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-md animate-bounce-subtle">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition">
              <ShoppingCart className="w-5 h-5 text-gray-800" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#800020] to-[#4B0082] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-md animate-bounce-subtle">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <Link to={user ? '/profile' : '/login'} className="p-2 rounded-full hover:bg-gray-100 transition">
              <User className="w-5 h-5 text-gray-800" />
            </Link>

            <button
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-[#D4AF37]/20 animate-slideDown">
            {[
              { to: '/', label: 'Home' },
              { to: '/shop', label: 'Shop' },
              { to: '/collections/silk', label: 'Silk' },
              { to: '/collections/cotton', label: 'Cotton' },
              { to: '/about', label: 'Our Artisans' }
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block py-3 text-gray-800 hover:text-[#800020] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <style>{`
        @keyframes bounce-subtle {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}
