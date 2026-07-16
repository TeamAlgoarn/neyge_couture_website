import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";
import { Plus, Edit, Trash2, Layers } from "lucide-react";

const CSS = `
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
}
.admin-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #D4AF37, #b8960f);
  color: #800020;
  border-radius: 100px;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
}
.admin-stats {
  background: rgba(255,249,240,.97);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  padding: 12px 20px;
  display: inline-block;
  margin-bottom: 24px;
}
.admin-card {
  background: rgba(255,249,240,.97);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  padding: 20px;
}
.admin-collection-item {
  background: rgba(255,249,240,.9);
  border: 1px solid rgba(196,152,10,.2);
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 16px;
}
.admin-collection-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
@media (min-width: 768px) {
  .admin-collection-content {
    flex-direction: row;
    align-items: flex-start;
  }
}
.admin-collection-img {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  object-fit: cover;
  border: 1px solid rgba(196,152,10,.3);
}
.admin-collection-info {
  flex: 1;
}
.admin-collection-name {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  font-weight: 500;
  color: #800020;
  margin-bottom: 6px;
}
.admin-collection-meta {
  font-size: 12px;
  color: #9a8070;
  margin-bottom: 8px;
}
.admin-collection-desc {
  font-size: 13px;
  color: #4a3828;
  font-weight: 300;
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
.admin-collection-actions {
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
}
.admin-edit-btn {
  border: 1.5px solid rgba(196,152,10,.4);
  color: #800020;
  background: transparent;
}
.admin-delete-btn {
  border: 1.5px solid rgba(220,38,38,.3);
  color: #dc2626;
  background: transparent;
}
@media (max-width: 640px) {
  .admin-collection-actions {
    justify-content: flex-end;
    width: 100%;
  }
  .admin-edit-btn, .admin-delete-btn {
    flex: 1;
    justify-content: center;
  }
}
`;

type Collection = {
  id: string; name?: string; slug?: string; description?: string;
  image?: string | null; thumbnail?: string | null; is_active?: boolean;
};

export default function AdminCollections() {
  // ✅ Scroll to top when this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/collections");
      const items = Array.isArray(res.data) ? res.data : (res.data?.data?.items || res.data?.data || res.data?.collections || []);
      setCollections(items);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collection?")) return;
    try {
      await adminApi.delete(`/collections/${id}`);
      await fetchCollections();
    } catch {
      alert("Delete failed");
    }
  };

  useEffect(() => { fetchCollections(); }, []);

  if (loading) return <AdminLayout title="Collections"><div className="admin-loading">Loading...</div></AdminLayout>;
  if (error) return <AdminLayout title="Collections"><div className="admin-error">{error}</div></AdminLayout>;

  return (
    <>
      <style>{CSS}</style>
      <AdminLayout title="Collections">
        <div className="admin-header">
          <h1 className="admin-header-title">Collections</h1>
          <Link to="/admin/collections/new" className="admin-add-btn"><Plus size={16} /> Add Collection</Link>
        </div>
        <div className="admin-stats">Total collections: <strong>{collections.length}</strong></div>
        <div className="admin-card">
          {collections.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40 }}>No collections found.</div>
          ) : (
            collections.map(coll => (
              <div key={coll.id} className="admin-collection-item">
                <div className="admin-collection-content">
                  <div>
                    {coll.image || coll.thumbnail ? (
                      <img src={coll.image || coll.thumbnail || ""} alt={coll.name} className="admin-collection-img" />
                    ) : (
                      <div className="admin-collection-img" style={{ background: "#f1e4d2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Layers size={32} color="#C4980A" />
                      </div>
                    )}
                  </div>
                  <div className="admin-collection-info">
                    <div className="admin-collection-name">{coll.name || "Untitled"}</div>
                    <div className="admin-collection-meta">Slug: {coll.slug || "-"}</div>
                    {coll.description && <div className="admin-collection-desc">{coll.description}</div>}
                    <div style={{ marginTop: 8 }}>
                      <span className={coll.is_active ? "status-active" : "status-inactive"}>
                        {coll.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="admin-collection-actions">
                    <Link to={`/admin/collections/${coll.id}/edit`} className="admin-edit-btn"><Edit size={14} /> Edit</Link>
                    <button onClick={() => handleDelete(coll.id)} className="admin-delete-btn"><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </AdminLayout>
    </>
  );
}