import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFestiveCollectionBySlug } from '@/api/festiveCollections';
import { SareeCard } from '@/components/features/SareeCard';

export default function FestiveCollectionPage() {
  const { slug = '' } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getFestiveCollectionBySlug(slug);
        setData(res);
      } finally {
        setLoading(false);
      }
    };

    if (slug) load();
  }, [slug]);

  if (loading) {
    return <div className="p-10 text-center">Loading festive collection...</div>;
  }

  if (!data) {
    return <div className="p-10 text-center">Festive collection not found</div>;
  }

  return (
    <div className="pb-16 pt-28">
      <div className="mx-auto max-w-7xl px-4">
        {data.banner_image ? (
          <img
            src={data.banner_image}
            alt={data.name}
            className="mb-8 h-[360px] w-full rounded-3xl object-cover"
          />
        ) : null}

        <div className="mb-10 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#C4980A]">
            Festive Collection
          </p>
          <h1 className="mb-3 text-5xl font-semibold text-[#800020]">{data.name}</h1>
          <p className="mx-auto max-w-3xl text-sm text-gray-600">{data.description}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4">
          {(data.products || []).map((product: any) => (
            <SareeCard key={product.id} saree={product} />
          ))}
        </div>
      </div>
    </div>
  );
}