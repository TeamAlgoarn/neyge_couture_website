import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";
import { Plus, Edit, Trash2, Package } from "lucide-react";

// ─── Brand palette (matches all other pages) ─────────────────────────────────
const C = {
  maroon: '#800020',
  gold: '#C4980A',
  goldV: '#D4AF37',
  cream: '#F5E6D3',
  creamLt: '#FFF9F0',
  creamMid: '#F8EEE2',
  warmGrey: '#4a3828',
  navy: '#1B2A6B',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

.admin-products {
  font-family: 'Josefin Sans', sans-serif;
  word-break: break-word;
}

.admin-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.admin-header-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(24px, 5vw, 28px);
  font-weight: 400;
  color: #800020;
  margin: 0;
  letter-spacing: 0.04em;
}
.admin-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #D4AF37, #b8960f);
  color: #800020;
  border-radius: 100px;
  font-family: 'Josefin Sans';
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: transform .3s, box-shadow .3s;
  box-shadow: 0 4px 12px rgba(212,175,55,.3);
}
.admin-add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212,175,55,.4);
}

.admin-stats {
  background: rgba(255,249,240,.97);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  padding: 12px 20px;
  display: inline-block;
  margin-bottom: 24px;
}
.admin-stats-text {
  font-size: 13px;
  color: #9a8070;
  font-weight: 300;
}
.admin-stats-number {
  font-family: 'Cinzel', serif;
  font-weight: 500;
  color: #800020;
  font-size: 18px;
  margin-left: 4px;
}

.admin-card {
  background: rgba(255,249,240,.97);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 8px 36px rgba(0,0,0,.06);
}

.admin-product-item {
  background: rgba(255,249,240,.9);
  border: 1px solid rgba(196,152,10,.2);
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all .3s ease;
}
.admin-product-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(128,0,32,.1);
  border-color: rgba(196,152,10,.4);
}
.admin-product-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
@media (min-width: 768px) {
  .admin-product-content {
    flex-direction: row;
    align-items: flex-start;
  }
}
.admin-product-img {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  object-fit: cover;
  border: 1px solid rgba(196,152,10,.3);
  background: #f1e4d2;
}
.admin-product-info {
  flex: 1;
}
.admin-product-name {
  font-family: 'Cinzel', serif;
  font-size: 18px;
  font-weight: 500;
  color: #800020;
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}
.admin-product-meta {
  font-size: 12px;
  color: #9a8070;
  margin-bottom: 4px;
}
.admin-product-price {
  font-size: 14px;
  font-weight: 600;
  color: #800020;
  margin-top: 6px;
}
.status-active {
  background: rgba(34,197,94,.12);
  color: #059669;
  border: 1px solid rgba(34,197,94,.3);
  display: inline-block;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
}
.status-inactive {
  background: rgba(156,163,175,.12);
  color: #6b7280;
  border: 1px solid rgba(156,163,175,.3);
  display: inline-block;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
}
.admin-product-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.admin-edit-btn, .admin-delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all .25s;
}
.admin-edit-btn {
  border: 1.5px solid rgba(196,152,10,.4);
  color: #800020;
  background: transparent;
}
.admin-edit-btn:hover {
  border-color: #800020;
  background: rgba(128,0,32,.05);
  transform: translateY(-1px);
}
.admin-delete-btn {
  border: 1.5px solid rgba(220,38,38,.3);
  color: #dc2626;
  background: transparent;
}
.admin-delete-btn:hover {
  background: #dc2626;
  border-color: #dc2626;
  color: white;
  transform: translateY(-1px);
}
@media (max-width: 640px) {
  .admin-product-actions {
    justify-content: flex-end;
    width: 100%;
  }
  .admin-edit-btn, .admin-delete-btn {
    flex: 1;
    justify-content: center;
  }
}

.admin-loading,
.admin-error {
  background: rgba(255,249,240,.97);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  font-family: 'Josefin Sans';
  font-size: 14px;
}
.admin-error {
  color: #dc2626;
  border-color: rgba(220,38,38,.3);
  background: rgba(254,226,226,.8);
}

.admin-empty {
  text-align: center;
  padding: 48px 24px;
}
.admin-empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(196,152,10,.12);
  border: 1px solid rgba(196,152,10,.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.admin-empty-text {
  font-size: 14px;
  color: #9a8070;
  font-weight: 300;
}
`;

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
  // ✅ Scroll to top when this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <>
      <style>{CSS}</style>
      <AdminLayout title="Products">
        <div className="admin-products">
          <div className="admin-header">
            <h1 className="admin-header-title">Products</h1>
            <Link to="/admin/products/new" className="admin-add-btn">
              <Plus size={16} /> Add Product
            </Link>
          </div>

          {loading && (
            <div className="admin-loading">Loading products...</div>
          )}

          {error && (
            <div className="admin-error">{error}</div>
          )}

          {!loading && !error && (
            <>
              <div className="admin-stats">
                <span className="admin-stats-text">
                  Total products: <span className="admin-stats-number">{products.length}</span>
                </span>
              </div>

              <div className="admin-card">
                {products.length === 0 ? (
                  <div className="admin-empty">
                    <div className="admin-empty-icon">
                      <Package size={28} color={C.gold} />
                    </div>
                    <p className="admin-empty-text">No products found.</p>
                  </div>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="admin-product-item">
                      <div className="admin-product-content">
                        <div>
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt={product.name || "Product"}
                              className="admin-product-img"
                            />
                          ) : (
                            <div
                              className="admin-product-img"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#f1e4d2",
                              }}
                            >
                              <Package size={32} color={C.gold} />
                            </div>
                          )}
                        </div>

                        <div className="admin-product-info">
                          <div className="admin-product-name">
                            {product.name || "Untitled Product"}
                          </div>
                          <div className="admin-product-meta">
                            Slug: {product.slug || "-"}
                          </div>
                          <div className="admin-product-meta">
                            Stock: {product.stock ?? 0}
                          </div>
                          <div className="admin-product-price">
                            ₹{product.discount_price ?? product.price ?? 0}
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <span className={product.is_active ? "status-active" : "status-inactive"}>
                              {product.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>

                        <div className="admin-product-actions">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="admin-edit-btn"
                          >
                            <Edit size={14} /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="admin-delete-btn"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </AdminLayout>
    </>
  );
}