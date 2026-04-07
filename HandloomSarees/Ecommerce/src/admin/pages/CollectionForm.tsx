import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";

type CollectionPayload = {
  name: string;
  slug: string;
  description: string;
  image: string;
  is_active: boolean;
  featured: boolean;
};

type CollectionResponse = {
  data?: any;
  collection?: any;
};

const initialForm: CollectionPayload = {
  name: "",
  slug: "",
  description: "",
  image: "",
  is_active: true,
  featured: false,
};

export default function CollectionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = useMemo(() => !!id, [id]);

  const [form, setForm] = useState<CollectionPayload>(initialForm);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);

  const updateField = <K extends keyof CollectionPayload>(
    key: K,
    value: CollectionPayload[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchCollection = async () => {
      try {
        const res = await adminApi.get<CollectionResponse>(`/collections/${id}`);
        const collection = res.data?.data || res.data?.collection || res.data;

        if (collection) {
          setForm({
            name: collection.name || "",
            slug: collection.slug || "",
            description: collection.description || "",
            image: collection.image || collection.thumbnail || "",
            is_active: collection.is_active ?? true,
            featured: collection.featured ?? false,
          });
        }
      } catch (error) {
        console.error("Failed to fetch collection", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchCollection();
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
      };

      if (isEdit && id) {
        await adminApi.put(`/collections/${id}`, payload);
      } else {
        await adminApi.post("/collections", payload);
      }

      navigate("/admin/collections");
    } catch (error) {
      console.error("Failed to save collection", error);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <AdminLayout title={isEdit ? "Edit Collection" : "New Collection"}>
        <p>Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? "Edit Collection" : "New Collection"}>
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 space-y-4">
            <h3 className="text-lg font-semibold">Basic Details</h3>

            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Collection Name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />

            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              required
            />

            <textarea
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Description"
              rows={5}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />

            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Image URL"
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
            />
          </div>

          <div className="rounded-2xl border bg-white p-6 space-y-4">
            <h3 className="text-lg font-semibold">Settings</h3>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
              />
              Featured Collection
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateField("is_active", e.target.checked)}
              />
              Active Collection
            </label>

            {form.image ? (
              <div className="pt-4">
                <p className="mb-2 text-sm text-gray-500">Preview</p>
                <img
                  src={form.image}
                  alt="Collection preview"
                  className="h-40 w-full rounded-xl border object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-5 py-3 text-white"
          >
            {loading
              ? "Saving..."
              : isEdit
              ? "Update Collection"
              : "Create Collection"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/collections")}
            className="rounded-xl border px-5 py-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}