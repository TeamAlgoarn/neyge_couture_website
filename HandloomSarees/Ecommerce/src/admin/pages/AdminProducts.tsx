import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";

type Product = {
  id: string;
  name?: string;
  slug?: string;
  price?: number;
  discount_price?: number | null;
  thumbnail?: string | null;
  stock?: number;
  is_active?: boolean;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await adminApi.get("/products");
      console.log("PRODUCTS API RESPONSE:", res.data);

      let items: Product[] = [];

      if (Array.isArray(res.data)) {
        items = res.data;
      } else if (Array.isArray(res.data?.data)) {
        items = res.data.data;
      } else if (Array.isArray(res.data?.data?.items)) {
        items = res.data.data.items;
      } else if (Array.isArray(res.data?.products)) {
        items = res.data.products;
      } else if (Array.isArray(res.data?.items)) {
        items = res.data.items;
      }

      setProducts(items);
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setError(err?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    try {
      await adminApi.delete(`/products/${id}`);
      await fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AdminLayout title="Products">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link
          to="/admin/products/new"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Add Product
        </Link>
      </div>

      {loading && (
        <div className="rounded-xl border bg-white p-6">Loading products...</div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="rounded-xl border bg-white p-6">
          <p className="mb-4 text-sm text-gray-500">
            Total products: {products.length}
          </p>

          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.name || "Product"}
                        className="h-16 w-16 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg border bg-gray-100" />
                    )}

                    <div>
                      <p className="font-medium">
                        {product.name || "Untitled Product"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Slug: {product.slug || "-"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: ₹{product.discount_price ?? product.price ?? 0}
                      </p>
                      <p className="text-sm text-gray-500">
                        Stock: {product.stock ?? 0}
                      </p>
                      <p className="text-sm">
                        Status:{" "}
                        <span
                          className={
                            product.is_active ? "text-green-600" : "text-gray-500"
                          }
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="rounded-md border px-3 py-2 text-sm"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product.id)}
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