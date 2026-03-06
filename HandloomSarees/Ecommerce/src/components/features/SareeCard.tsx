import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import type { Saree } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/hooks/useCarts';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';

interface Props {
  saree: Saree;
}

export function SareeCard({ saree }: Props) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(saree.id);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart(saree);
    toast.success(`${saree.name} added to cart`);
  };

  const handleWish = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleWishlist(saree);
  };

  return (
    <Link
      to={`/product/${saree.id}`}
      className="group w-full"
    >
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 hover:-translate-y-4 bg-black">

        {/* Image */}
        <div className="relative aspect-[3/4]">
          <img
            src={saree.images[0]}
            alt={saree.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        </div>

        {/* Overlay Content */}
        <div className="absolute bottom-0 w-full p-6 text-white backdrop-blur-md">
          <h3 className="text-xl font-serif font-bold mb-2">
            {saree.name}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-[#D4AF37]">
              {formatCurrency(saree.price)}
            </span>

            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition duration-300">
              <button
                onClick={handleWish}
                className={`p-2 rounded-full backdrop-blur-md ${
                  inWishlist ? 'bg-red-500' : 'bg-white/20'
                }`}
              >
                <Heart className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={handleAdd}
                className="p-2 rounded-full bg-[#D4AF37]"
              >
                <ShoppingCart className="w-4 h-4 text-[#800020]" />
              </button>
            </div>
          </div>
        </div>

        {/* Golden Border Glow */}
        <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-[#D4AF37]/60 transition duration-500"></div>
      </div>
    </Link>
  );
}
