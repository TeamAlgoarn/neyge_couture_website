import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";

type Collection = {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string | null;
  thumbnail?: string | null;
  is_active?: boolean;
  featured?: boolean;
};

export default function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await adminApi.get("/collections");
      console.log("COLLECTIONS API RESPONSE:", res.data);

      let items: Collection[] = [];

      if (Array.isArray(res.data)) {
        items = res.data;
      } else if (Array.isArray(res.data?.data)) {
        items = res.data.data;
      } else if (Array.isArray(res.data?.data?.items)) {
        items = res.data.data.items;
      } else if (Array.isArray(res.data?.collections)) {
        items = res.data.collections;
      } else if (Array.isArray(res.data?.items)) {
        items = res.data.items;
      }

      setCollections(items);
    } catch (err: any) {
      console.error("Failed to fetch collections:", err);
      setError(err?.message || "Failed to fetch collections");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Are you sure you want to delete this collection?");
    if (!ok) return;

    try {
      await adminApi.delete(`/collections/${id}`);
      await fetchCollections();
    } catch (error) {
      console.error("Failed to delete collection:", error);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <AdminLayout title="Collections">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Collections</h2>
        <Link
          to="/admin/collections/new"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Add Collection
        </Link>
      </div>

      {loading && (
        <div className="rounded-xl border bg-white p-6">Loading collections...</div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="rounded-xl border bg-white p-6">
          <p className="mb-4 text-sm text-gray-500">
            Total collections: {collections.length}
          </p>

          {collections.length === 0 ? (
            <p>No collections found.</p>
          ) : (
            <div className="space-y-3">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    {collection.image || collection.thumbnail ? (
                      <img
                        src={collection.image || collection.thumbnail || ""}
                        alt={collection.name || "Collection"}
                        className="h-16 w-16 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg border bg-gray-100" />
                    )}

                    <div>
                      <p className="font-medium">
                        {collection.name || "Untitled Collection"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Slug: {collection.slug || "-"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {collection.description || "No description"}
                      </p>
                      <p className="text-sm">
                        Status:{" "}
                        <span
                          className={
                            collection.is_active ? "text-green-600" : "text-gray-500"
                          }
                        >
                          {collection.is_active ? "Active" : "Inactive"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/admin/collections/${collection.id}/edit`}
                      className="rounded-md border px-3 py-2 text-sm"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(collection.id)}
                      className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}