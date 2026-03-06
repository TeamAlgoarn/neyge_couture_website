import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SareeCard } from '@/components/features/SareeCard';
import { SAREES } from '@/constants/sarees';
import { ChevronDown, Sliders, X, Sparkles } from 'lucide-react';

const FABRICS = ['Silk', 'Cotton', 'Linen', 'Khadi'];
const OCCASIONS = ['Wedding', 'Casual', 'Festive', 'Party'];
const COLORS = ['Red', 'Blue', 'Green', 'Gold', 'Pink', 'Purple', 'White', 'Multicolor'];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

export function ShopPage() {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [selectedFabrics, setSelectedFabrics] = useState<string[]>(() => {
    const fabric = searchParams.get('fabric');
    return fabric ? [fabric] : [];
  });

  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(() => {
    const occasion = searchParams.get('occasion');
    return occasion ? [occasion] : [];
  });

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<string>('popular');

  const toggleFilter = (
    value: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev: string[]) =>
      prev.includes(value)
        ? prev.filter((v: string) => v !== value)
        : [...prev, value]
    );
  };

  const filteredSarees = useMemo(() => {
    let filtered = [...SAREES];

    if (selectedFabrics.length)
      filtered = filtered.filter((s) => selectedFabrics.includes(s.fabric));

    if (selectedOccasions.length)
      filtered = filtered.filter((s) => selectedOccasions.includes(s.occasion));

    if (selectedColors.length)
      filtered = filtered.filter((s) => selectedColors.includes(s.color));

    filtered = filtered.filter(
      (s) => s.price >= priceRange[0] && s.price <= priceRange[1]
    );

    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest')
      filtered.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    else filtered.sort((a, b) => b.rating - a.rating);

    return filtered;
  }, [selectedFabrics, selectedOccasions, selectedColors, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f0eb] via-[#faf8f6] to-[#f5f0eb]">
      
      {/* HERO SECTION */}
      <div className="relative pt-28 pb-16 overflow-hidden">
        {/* Background ornamental elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#800020] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#B8860B] rounded-full blur-3xl"></div>
        </div>

        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23800020' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        <div className="max-w-[1400px] mx-auto px-6 text-center relative z-10">
          {/* Heritage Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 bg-white/80 backdrop-blur-sm rounded-full border border-[#B8860B]/20 shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#B8860B]" />
            <span className="text-sm tracking-[0.2em] text-[#800020] font-medium uppercase">
              Handcrafted Excellence
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-serif text-[#800020] mb-4 leading-[1.1] animate-slide-up" style={{ fontFamily: "'Playfair Display', serif" }}>
            Discover Timeless Elegance
          </h1>
          
          <p className="text-lg md:text-xl text-[#8B4513] mb-3 font-light animate-slide-up" style={{ animationDelay: '0.1s', fontFamily: "'Cormorant Garamond', serif" }}>
            A Curated Collection of Handloom Masterpieces
          </p>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-600 leading-relaxed mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Each saree in our collection tells a unique story of heritage, artistry, and skilled craftsmanship. 
            From vibrant silks to delicate cottons, explore pieces that celebrate India's rich weaving traditions 
            while embracing contemporary sophistication.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="px-4 py-2 bg-white/60 backdrop-blur rounded-full border border-[#B8860B]/20 text-xs font-medium text-[#800020]">
              ✨ Authentic Handloom
            </div>
            <div className="px-4 py-2 bg-white/60 backdrop-blur rounded-full border border-[#B8860B]/20 text-xs font-medium text-[#800020]">
              🧵 Premium Fabrics
            </div>
            <div className="px-4 py-2 bg-white/60 backdrop-blur rounded-full border border-[#B8860B]/20 text-xs font-medium text-[#800020]">
              🎨 Exclusive Designs
            </div>
            <div className="px-4 py-2 bg-white/60 backdrop-blur rounded-full border border-[#B8860B]/20 text-xs font-medium text-[#800020]">
              ⭐ Artisan Crafted
            </div>
          </div>

          <p className="text-xs text-gray-500 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Browse {SAREES.length} exquisite pieces, each one a testament to timeless beauty
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-20 -mt-4">

        {/* MOBILE ACTION BAR */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/90 backdrop-blur border border-[#B8860B]/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <Sliders className="w-4 h-4 text-[#800020]" />
            <span className="font-medium text-[#800020]">Filters</span>
          </button>

          <SortSelect sortBy={sortBy} setSortBy={setSortBy} />
        </div>

        <div className="flex gap-12">

          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6 border border-[#B8860B]/10 sticky top-28">
              <h3 className="text-xl font-serif text-[#800020] mb-6 pb-3 border-b border-[#B8860B]/20">
                Refine Your Search
              </h3>
              <FiltersContent
                selectedFabrics={selectedFabrics}
                selectedOccasions={selectedOccasions}
                selectedColors={selectedColors}
                toggleFilter={toggleFilter}
                setSelectedFabrics={setSelectedFabrics}
                setSelectedOccasions={setSelectedOccasions}
                setSelectedColors={setSelectedColors}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </div>
          </aside>

          {/* PRODUCTS */}
          <div className="flex-1">

            {/* DESKTOP SORT */}
            <div className="hidden lg:flex justify-between items-center mb-8 pb-4 border-b border-[#B8860B]/10">
              <p className="text-gray-600 font-light">
                Showing <span className="font-semibold text-[#800020]">{filteredSarees.length}</span> of <span className="font-semibold">{SAREES.length}</span> exquisite pieces
              </p>
              <SortSelect sortBy={sortBy} setSortBy={setSortBy} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSarees.map((saree, index) => (
                <div 
                  key={saree.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <SareeCard saree={saree} />
                </div>
              ))}
            </div>

            {filteredSarees.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500 font-light mb-4">No sarees match your filters</p>
                <p className="text-gray-400">Try adjusting your selection to discover more</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[90%] max-w-md bg-gradient-to-b from-white to-[#faf8f6] shadow-2xl animate-slide-in-right overflow-y-auto">
            <div className="flex items-center justify-between p-8 border-b border-[#B8860B]/20 bg-white/50 backdrop-blur">
              <h3 className="text-2xl font-serif text-[#800020]">Refine Your Search</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-full hover:bg-[#800020]/10 transition-colors"
              >
                <X className="w-6 h-6 text-[#800020]" />
              </button>
            </div>

            <div className="p-8">
              <FiltersContent
                selectedFabrics={selectedFabrics}
                selectedOccasions={selectedOccasions}
                selectedColors={selectedColors}
                toggleFilter={toggleFilter}
                setSelectedFabrics={setSelectedFabrics}
                setSelectedOccasions={setSelectedOccasions}
                setSelectedColors={setSelectedColors}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        /* Custom scrollbar for filters */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f5f0eb;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #B8860B;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #800020;
        }
      `}</style>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function SortSelect({
  sortBy,
  setSortBy,
}: {
  sortBy: string;
  setSortBy: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="appearance-none bg-white/90 backdrop-blur border border-[#B8860B]/30 pl-5 pr-12 py-3.5 rounded-full text-sm font-medium text-[#800020] focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#800020] pointer-events-none" />
    </div>
  );
}

function FiltersContent({
  selectedFabrics,
  selectedOccasions,
  selectedColors,
  toggleFilter,
  setSelectedFabrics,
  setSelectedOccasions,
  setSelectedColors,
  priceRange,
  setPriceRange,
}: {
  selectedFabrics: string[];
  selectedOccasions: string[];
  selectedColors: string[];
  toggleFilter: (
    value: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => void;
  setSelectedFabrics: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedOccasions: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedColors: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
}) {
  return (
    <>
      <FilterSection
        title="Fabric"
        items={FABRICS}
        selected={selectedFabrics}
        toggle={(v) => toggleFilter(v, setSelectedFabrics)}
      />
      <FilterSection
        title="Occasion"
        items={OCCASIONS}
        selected={selectedOccasions}
        toggle={(v) => toggleFilter(v, setSelectedOccasions)}
      />
      <FilterSection
        title="Color"
        items={COLORS}
        selected={selectedColors}
        toggle={(v) => toggleFilter(v, setSelectedColors)}
      />

      <div className="mt-6 pt-4 border-t border-[#B8860B]/10">
        <h4 className="font-serif text-base mb-4 text-[#800020]">Price Range</h4>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="50000"
            step="1000"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([0, parseInt(e.target.value)])
            }
            className="w-full h-2 bg-[#B8860B]/20 rounded-full appearance-none cursor-pointer 
                     [&::-webkit-slider-thumb]:appearance-none 
                     [&::-webkit-slider-thumb]:w-5 
                     [&::-webkit-slider-thumb]:h-5 
                     [&::-webkit-slider-thumb]:rounded-full 
                     [&::-webkit-slider-thumb]:bg-[#800020]
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-white
                     [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:transition-transform
                     [&::-webkit-slider-thumb]:hover:scale-110
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-[#800020]
                     [&::-moz-range-thumb]:border-2
                     [&::-moz-range-thumb]:border-white
                     [&::-moz-range-thumb]:shadow-lg
                     [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between mt-4">
            <span className="text-sm text-gray-500">₹0</span>
            <span className="text-sm font-semibold text-[#800020]">
              ₹{priceRange[1].toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function FilterSection({
  title,
  items,
  selected,
  toggle,
}: {
  title: string;
  items: string[];
  selected: string[];
  toggle: (value: string) => void;
}) {
  return (
    <div className="mb-6 pb-4 border-b border-[#B8860B]/10 last:border-0">
      <h4 className="font-serif text-base mb-4 text-[#800020]">{title}</h4>
      <div className="space-y-3">
        {items.map((item) => (
          <label 
            key={item} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => toggle(item)}
              className="w-4 h-4 rounded border-2 border-[#B8860B]/30 text-[#800020] 
                       focus:ring-2 focus:ring-[#800020] focus:ring-offset-2 
                       cursor-pointer transition-all duration-200
                       checked:bg-[#800020] checked:border-[#800020]"
            />
            <span className="text-xs text-gray-700 group-hover:text-[#800020] transition-colors duration-200">
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}