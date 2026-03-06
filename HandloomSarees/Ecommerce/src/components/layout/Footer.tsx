import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#1a1a1a] via-[#800020]/90 to-[#4B0082]/90 text-white  overflow-hidden">

      {/* Glow Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">

          {/* Brand */}
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-2xl text-[#D4AF37]">
              Handloom Sarees
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Celebrating India's weaving heritage by empowering artisan families
              and delivering timeless elegance worldwide.
            </p>

            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-all duration-300 hover:scale-110"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-[#D4AF37] mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              {['Shop', 'Silk Collection', 'Cotton', 'Our Artisans', 'Track Order'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-white/70 hover:text-[#D4AF37] transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-[#D4AF37] mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              {['Contact', 'Shipping', 'Returns', 'FAQ', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-white/70 hover:text-[#D4AF37] transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-[#D4AF37] mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
                Bangalore, Karnataka, India
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37]" />
                +91 1800-123-456
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37]" />
                support@handloom.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-8 text-center text-sm text-white/60">
          © {new Date().getFullYear()} Handloom Sarees — Empowering artisans, one weave at a time.
        </div>
      </div>
    </footer>
  );
}
