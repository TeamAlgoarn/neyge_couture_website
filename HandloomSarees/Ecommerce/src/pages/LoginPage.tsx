import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';
import { Mail, Lock, User, Sparkles } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const user = authService.login(formData.email, formData.password);
      if (user) {
        toast.success('Welcome back!');
        navigate('/');
      }
    } else {
      authService.register(formData.name, formData.email, formData.password);
      toast.success('Account created successfully!');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] via-white to-[#F5E6D3] pt-24 md:pt-28 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/40">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#800020]">
              Artisan Heritage
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#800020] mb-3">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>

          <p className="text-gray-600 text-sm md:text-base">
            {isLogin
              ? 'Sign in to access your account'
              : 'Join us to explore handcrafted sarees'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#D4AF37]/20 rounded-3xl shadow-2xl p-8 md:p-10 animate-scale-in">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-[#800020] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-[#D4AF37]/30 bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#800020] transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#800020] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-[#D4AF37]/30 bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#800020] transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#800020] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-[#D4AF37]/30 bg-[#FFF9F0] focus:outline-none focus:ring-2 focus:ring-[#800020] transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#800020] to-[#4B0082] hover:from-[#4B0082] hover:to-[#800020] text-white py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-xl"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#800020] font-semibold hover:text-[#D4AF37] transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-[#800020] transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out both;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}
