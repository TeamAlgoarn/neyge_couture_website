import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { getActiveFestivePopup } from '@/api/festiveCollections';

export function FestivePopup() {
  const [data, setData] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadPopup = async () => {
      const festive = await getActiveFestivePopup();
      if (!festive) return;

      const seenKey = `festive_popup_seen_${festive.slug}`;
      const seen = localStorage.getItem(seenKey);

      if (!seen) {
        setData(festive);
        setOpen(true);
      }
    };

    loadPopup();
  }, []);

  const handleClose = () => {
    if (data?.slug) {
      localStorage.setItem(`festive_popup_seen_${data.slug}`, 'true');
    }
    setOpen(false);
  };

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full border p-2"
        >
          <X size={16} />
        </button>

        {data.banner_image ? (
          <img
            src={data.banner_image}
            alt={data.name}
            className="mb-4 h-56 w-full rounded-2xl object-cover"
          />
        ) : null}

        <h2 className="mb-2 text-3xl font-semibold">{data.name}</h2>
        <p className="mb-5 text-sm text-gray-600">
          {data.popup_message || data.description}
        </p>

        <Link
          to={`/festive/${data.slug}`}
          onClick={handleClose}
          className="inline-flex rounded-xl bg-[#800020] px-5 py-3 text-white"
        >
          Explore Collection
        </Link>
      </div>
    </div>
  );
}