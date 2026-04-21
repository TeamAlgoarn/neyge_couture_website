import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  getAdminFestiveCollections,
  deleteFestiveCollection,
  type FestiveCollection,
} from '@/api/festiveCollections';

export default function AdminFestiveCollections() {
  const [items, setItems] = useState<FestiveCollection[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminFestiveCollections();
      setItems(data);
    } catch {
      toast.error('Failed to load festive collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteFestiveCollection(id);
      toast.success('Festive collection deleted');
      loadData();
    } catch {
      toast.error('Failed to delete festive collection');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Festive Collections</h1>
        <Link
          to="/admin/festive-collections/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#800020] px-4 py-2 text-white"
        >
          <Plus size={16} />
          New Festive Collection
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-500">{item.slug}</p>
                  <p className="mt-2 text-sm">{item.description}</p>
                  <div className="mt-3 flex gap-3 text-sm">
                    <span>{item.is_active ? 'Active' : 'Inactive'}</span>
                    <span>{item.popup_enabled ? 'Popup Enabled' : 'Popup Off'}</span>
                    <span>{item.products?.length || 0} Products</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/admin/festive-collections/${item.id}/edit`}
                    className="rounded-lg border p-2"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg border p-2 text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}