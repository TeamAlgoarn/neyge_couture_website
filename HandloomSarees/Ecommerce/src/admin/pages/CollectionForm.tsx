import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";
import { Layers, Sparkles, Save, X } from "lucide-react";

// ─── Brand palette (matches all other pages) ─────────────────────────────────
const C = {
  maroon: '#800020',
  maroonDk: '#5a0016',
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

.collection-form {
  font-family: 'Josefin Sans', sans-serif;
}
.form-title {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  font-weight: 500;
  color: #800020;
  margin-bottom: 20px;
  letter-spacing: 0.02em;
}
.form-card {
  background: rgba(255,249,240,.97);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 8px 36px rgba(0,0,0,.06);
}
.form-input, .form-textarea {
  width: 100%;
  padding: 12px 16px;
  background: white;
  border: 1.5px solid rgba(196,152,10,.3);
  border-radius: 16px;
  font-family: 'Josefin Sans';
  font-size: 14px;
  color: #1a1010;
  transition: all 0.25s;
}
.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #C4980A;
  box-shadow: 0 0 0 3px rgba(196,152,10,.12);
}
.form-label {
  display: block;
  font-family: 'Josefin Sans';
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #C4980A;
  font-weight: 600;
  margin-bottom: 8px;
}
.form-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #800020;
  margin-right: 10px;
}
.form-checkbox-label {
  font-family: 'Josefin Sans';
  font-size: 14px;
  font-weight: 500;
  color: #4a3828;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
.preview-img {
  width: 100%;
  max-height: 200px;
  border-radius: 18px;
  object-fit: cover;
  border: 1px solid rgba(196,152,10,.3);
  margin-top: 12px;
}
.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #D4AF37, #b8960f);
  color: #800020;
  border: none;
  border-radius: 100px;
  font-family: 'Josefin Sans';
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 14px rgba(212,175,55,.35);
}
.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(212,175,55,.5);
}
.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-cancel {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: transparent;
  border: 1.5px solid rgba(196,152,10,.4);
  border-radius: 100px;
  font-family: 'Josefin Sans';
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #800020;
  cursor: pointer;
  transition: all 0.25s;
}
.btn-cancel:hover {
  border-color: #800020;
  background: rgba(128,0,32,.05);
  transform: translateY(-2px);
}
@media (max-width: 768px) {
  .form-card {
    padding: 20px;
  }
  .form-title {
    font-size: 18px;
  }
  .btn-save, .btn-cancel {
    flex: 1;
    justify-content: center;
  }
}
`;

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
      const payload = { ...form };

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
        <div className="collection-form" style={{ fontFamily: "'Josefin Sans', sans-serif", textAlign: "center", padding: "60px 20px" }}>
          Loading collection data...
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <AdminLayout title={isEdit ? "Edit Collection" : "New Collection"}>
        <div className="collection-form">
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
              {/* Basic Details Card */}
              <div className="form-card">
                <div className="form-title">
                  <Layers size={20} style={{ display: "inline", marginRight: 8, color: C.gold }} />
                  Basic Details
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label className="form-label">Collection Name</label>
                    <input
                      className="form-input"
                      placeholder="e.g., Summer Silks"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Slug</label>
                    <input
                      className="form-input"
                      placeholder="e.g., summer-silks"
                      value={form.slug}
                      onChange={(e) => updateField("slug", e.target.value)}
                      required
                    />
                    <p style={{ fontSize: 11, color: "#9a8070", marginTop: 4 }}>URL-friendly identifier (lowercase, hyphens)</p>
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Describe the collection..."
                      rows={5}
                      value={form.description}
                      onChange={(e) => updateField("description", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Image URL</label>
                    <input
                      className="form-input"
                      placeholder="https://example.com/image.jpg"
                      value={form.image}
                      onChange={(e) => updateField("image", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Settings Card */}
              <div className="form-card">
                <div className="form-title">
                  <Sparkles size={20} style={{ display: "inline", marginRight: 8, color: C.gold }} />
                  Settings
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <label className="form-checkbox-label">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={form.featured}
                      onChange={(e) => updateField("featured", e.target.checked)}
                    />
                    Featured Collection
                  </label>
                  <label className="form-checkbox-label">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={form.is_active}
                      onChange={(e) => updateField("is_active", e.target.checked)}
                    />
                    Active Collection
                  </label>

                  {form.image && (
                    <div style={{ marginTop: 8 }}>
                      <p className="form-label">Preview</p>
                      <img
                        src={form.image}
                        alt="Collection preview"
                        className="preview-img"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
              <button type="submit" disabled={loading} className="btn-save">
                <Save size={16} />
                {loading ? "Saving..." : (isEdit ? "Update Collection" : "Create Collection")}
              </button>
              <button type="button" onClick={() => navigate("/admin/collections")} className="btn-cancel">
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  );
}