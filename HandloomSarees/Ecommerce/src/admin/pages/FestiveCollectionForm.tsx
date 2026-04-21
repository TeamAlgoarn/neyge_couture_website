import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  createFestiveCollection,
  getAdminFestiveCollectionById,
  updateFestiveCollection,
} from '@/api/festiveCollections';
import { getProducts } from '@/api/products';

export default function FestiveCollectionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    banner_image: '',
    popup_enabled: false,
    popup_message: '',
    start_date: '',
    end_date: '',
    is_active: true,
    product_ids: [] as string[],
  });

 useEffect(() => {
  const loadInitial = async () => {
    try {
      const productRes = await getProducts();

      const productItems =
        productRes?.data?.items ||
        productRes?.items ||
        productRes?.data?.data?.items ||
        productRes?.data ||
        [];

      setProducts(Array.isArray(productItems) ? productItems : []);

      if (isEdit && id) {
        const data = await getAdminFestiveCollectionById(id);

        setForm({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          banner_image: data.banner_image || '',
          popup_enabled: !!data.popup_enabled,
          popup_message: data.popup_message || '',
          start_date: data.start_date ? data.start_date.slice(0, 16) : '',
          end_date: data.end_date ? data.end_date.slice(0, 16) : '',
          is_active: !!data.is_active,
          product_ids: (data.products || []).map((p: any) => p.id),
        });
      }
    } catch (error: any) {
      console.error('Failed to load festive form data', error);
      toast.error(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        'Failed to load form data'
      );
    }
  };

  loadInitial();
}, [id, isEdit]);

  const title = useMemo(
    () => (isEdit ? 'Edit Festive Collection' : 'Create Festive Collection'),
    [isEdit]
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleProductToggle = (productId: string) => {
    setForm((prev) => ({
      ...prev,
      product_ids: prev.product_ids.includes(productId)
        ? prev.product_ids.filter((id) => id !== productId)
        : [...prev.product_ids, productId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
      };

      if (isEdit && id) {
        await updateFestiveCollection(id, payload);
        toast.success('Festive collection updated');
      } else {
        await createFestiveCollection(payload);
        toast.success('Festive collection created');
      }

      navigate('/admin/festive-collections');
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Failed to save festive collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-semibold">{title}</h1>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-4 rounded-2xl border p-5">
          <input
            className="rounded-xl border p-3"
            placeholder="Collection Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
          />

          <textarea
            className="rounded-xl border p-3"
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Banner Image URL"
            value={form.banner_image}
            onChange={(e) => handleChange('banner_image', e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Popup Message"
            value={form.popup_message}
            onChange={(e) => handleChange('popup_message', e.target.value)}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="datetime-local"
              className="rounded-xl border p-3"
              value={form.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
            />
            <input
              type="datetime-local"
              className="rounded-xl border p-3"
              value={form.end_date}
              onChange={(e) => handleChange('end_date', e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
            />
            Active
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.popup_enabled}
              onChange={(e) => handleChange('popup_enabled', e.target.checked)}
            />
            Enable Popup
          </label>
        </div>

        <div className="rounded-2xl border p-5">
          <h2 className="mb-4 text-xl font-semibold">Select Products</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {products.map((product) => (
              <label key={product.id} className="flex items-center gap-3 rounded-xl border p-3">
                <input
                  type="checkbox"
                  checked={form.product_ids.includes(product.id)}
                  onChange={() => handleProductToggle(product.id)}
                />
                <span>{product.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-fit rounded-xl bg-[#800020] px-5 py-3 text-white"
        >
          {loading ? 'Saving...' : 'Save Festive Collection'}
        </button>
      </form>
    </div>
  );
}