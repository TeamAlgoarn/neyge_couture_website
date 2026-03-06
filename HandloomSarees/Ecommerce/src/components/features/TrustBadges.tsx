import { Shield, Truck, Award, RefreshCw } from 'lucide-react';

const badges = [
  { icon: Shield, title: '100% Authentic', description: 'Certified handloom sarees' },
  { icon: Truck, title: 'Free Shipping', description: 'On orders above ₹2,999' },
  { icon: Award, title: 'Quality Assured', description: 'Premium fabric & weaving' },
  { icon: RefreshCw, title: '7-Day Returns', description: 'Easy exchange policy' },
];

export function TrustBadges() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#F5E6D3] via-white to-[#F5E6D3]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="group p-8 bg-white/70 backdrop-blur-md rounded-3xl border border-[#D4AF37]/30 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#800020] to-[#4B0082] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <badge.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#800020] mb-1">
                {badge.title}
              </h3>
              <p className="text-sm text-gray-600">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
