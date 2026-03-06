import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { User, MapPin, Package, LogOut, Video, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { FASHION_ADVISORS } from '@/constants/advisors';

export function ProfilePage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const orders = JSON.parse(localStorage.getItem('handloom_orders') || '[]').filter(
    (order: any) => order.userId === user.id
  );

  const consultations = JSON.parse(localStorage.getItem('handloom_consultations') || '[]').filter(
    (consultation: any) => consultation.userId === user.id
  );

  const formatConsultationDate = (dateStr: string, time: string) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} at ${time}`;
  };

  const getAdvisorName = (advisorId: string) => {
    const advisor = FASHION_ADVISORS.find(a => a.id === advisorId);
    return advisor?.name || 'Unknown Advisor';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] via-white to-[#F5E6D3] pt-24 md:pt-28 pb-12 px-4">

      <div className="max-w-6xl mx-auto pt-20">

        {/* PROFILE HEADER */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#D4AF37]/20 rounded-3xl shadow-2xl p-8 mb-10 ">

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-gradient-to-br from-[#800020] to-[#4B0082] rounded-full flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs uppercase tracking-wider text-[#800020] font-semibold">
                    Member Profile
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#800020]">
                  {user.name}
                </h1>

                <p className="text-gray-600">{user.email}</p>
                {user.phone && <p className="text-gray-600">{user.phone}</p>}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* VIDEO CONSULTATIONS */}
        {consultations.length > 0 && (
          <LuxuryCard title="Video Consultations" icon={<Video className="w-5 h-5 text-[#D4AF37]" />}>
            {consultations.slice(0, 3).map((consultation: any) => (
              <div key={consultation.id} className="border border-[#D4AF37]/20 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-[#800020]">
                      {getAdvisorName(consultation.advisorId)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatConsultationDate(consultation.date, consultation.time)}
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#800020]">
                    {consultation.status}
                  </span>
                </div>
              </div>
            ))}
          </LuxuryCard>
        )}

        {/* GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ADDRESSES */}
          <LuxuryCard title="Saved Addresses" icon={<MapPin className="w-5 h-5 text-[#D4AF37]" />}>
            {user.addresses.length > 0 ? (
              user.addresses.map((address) => (
                <div key={address.id} className="border border-[#D4AF37]/20 rounded-xl p-4">
                  <p className="font-semibold text-[#800020]">{address.name}</p>
                  <p className="text-sm text-gray-700">{address.addressLine1}</p>
                  {address.addressLine2 && (
                    <p className="text-sm text-gray-700">{address.addressLine2}</p>
                  )}
                  <p className="text-sm text-gray-700">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No saved addresses</p>
            )}
          </LuxuryCard>

          {/* ORDERS */}
          <LuxuryCard title="Recent Orders" icon={<Package className="w-5 h-5 text-[#D4AF37]" />}>
            {orders.length > 0 ? (
              orders.slice(0, 3).map((order: any) => (
                <div key={order.id} className="border border-[#D4AF37]/20 rounded-xl p-4">
                  <p className="font-semibold text-[#800020]">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">
                    {order.items.length} item(s) • ₹{order.finalTotal}
                  </p>
                  <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#800020]">
                    {order.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No orders yet</p>
            )}
          </LuxuryCard>

        </div>
      </div>
    </div>
  );
}

/* Reusable Luxury Card */

function LuxuryCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-[#D4AF37]/20 rounded-3xl shadow-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="text-xl font-serif font-bold text-[#800020]">
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
