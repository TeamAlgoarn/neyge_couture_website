import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";
import { Layers, Sparkles, Save, X, Upload } from "lucide-react";
import { uploadCollectionImage } from "../lib/uploadCollectionImage";

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

// ── All available collection categories ──────────────────────────────────────
// These drive the filter sidebar in CollectionsPage. Whatever you pick here
// appears as a clickable filter chip for the user. Keep this list consistent.
const COLLECTION_CATEGORIES = [
  "Wedding",
  "Party & Festive",
  "Casual Wear",
  "Formal",
  "Summer",
  "Winter & Silk",
  "Heritage",
  "Bridal",
  "Daily Wear",
  "Other",
] as const;

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
.form-input, .form-textarea, .form-select {
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
.form-input:focus, .form-textarea:focus, .form-select:focus {
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
.form-hint {
  font-size: 11px;
  color: #9a8070;
  margin-top: 5px;
  line-height: 1.5;
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
.upload-box {
  border: 1.5px dashed rgba(196,152,10,.45);
  background: rgba(255,255,255,.8);
  border-radius: 18px;
  padding: 16px;
}
.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1.5px solid rgba(196,152,10,.35);
  background: rgba(196,152,10,.08);
  color: #800020;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  cursor: pointer;
}
.upload-hint {
  font-size: 12px;
  color: #8b735f;
  margin-top: 8px;
}

/* ── Category preview chip ── */
.cat-preview {
  display: inline-flex;
  align-items: center;
  margin-top: 10px;
  padding: 6px 14px;
  border-radius: 100px;
  background: rgba(128,0,32,.07);
  border: 1px solid rgba(128,0,32,.18);
  font-size: 12px;
  font-weight: 600;
  color: #800020;
  letter-spacing: 0.06em;
}

@media (max-width: 768px) {
  .form-card { padding: 20px; }
  .form-title { font-size: 18px; }
  .btn-save, .btn-cancel { flex: 1; justify-content: center; }
}
`;

type CollectionPayload = {
  name: string;
  slug: string;
  description: string;
  banner_image: string;
  is_active: boolean;
  featured: boolean;
  // ── NEW: category field sent to backend ────────────────────────────────────
  category: string;
};

type CollectionResponse = {
  data?: any;
  collection?: any;
};

const initialForm: CollectionPayload = {
  name: "",
  slug: "",
  description: "",
  banner_image: "",
  is_active: true,
  featured: false,
  category: "",      // ← new
};

export default function CollectionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = useMemo(() => !!id, [id]);

  const [form, setForm] = useState<CollectionPayload>(initialForm);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const updateField = <K extends keyof CollectionPayload>(
    key: K,
    value: CollectionPayload[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  // ── Fetch existing collection (edit mode) ──────────────────────────────────
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
            banner_image:
              collection.banner_image ||
              collection.image ||
              collection.thumbnail ||
              "",
            is_active: collection.is_active ?? true,
            featured: collection.featured ?? false,
            category: collection.category || "",   // ← load saved category
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

  // ── Image upload ───────────────────────────────────────────────────────────
  const handleCollectionImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const imageUrl = await uploadCollectionImage(file);
      setForm((prev) => ({ ...prev, banner_image: imageUrl }));
    } catch (error) {
      console.error("Collection image upload failed", error);
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  // ── Save ───────────────────────────────────────────────────────────────────
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
        <div
          className="collection-form"
          style={{ textAlign: "center", padding: "60px 20px" }}
        >
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
            <div
              style={{
                display: "grid",
                gap: 28,
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              }}
            >
              {/* ── Basic Details ── */}
              <div className="form-card">
                <div className="form-title">
                  <Layers
                    size={20}
                    style={{ display: "inline", marginRight: 8, color: C.gold }}
                  />
                  Basic Details
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Name */}
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

                  {/* Slug */}
                  <div>
                    <label className="form-label">Slug</label>
                    <input
                      className="form-input"
                      placeholder="e.g., summer-silks"
                      value={form.slug}
                      onChange={(e) => updateField("slug", e.target.value)}
                      required
                    />
                    <p className="form-hint">
                      URL-friendly identifier (lowercase, hyphens)
                    </p>
                  </div>

                  {/* ── NEW: Category dropdown ──────────────────────────────
                      This replaces the old name-guessing logic.
                      Whatever is selected here becomes the filter tag that
                      users see in CollectionsPage sidebar.
                  ─────────────────────────────────────────────────────────── */}
                  <div>
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={form.category}
                      onChange={(e) => updateField("category", e.target.value)}
                    >
                      <option value="">— Select a category —</option>
                      {COLLECTION_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <p className="form-hint">
                      This determines which filter tab the collection appears
                      under on the shop page.
                    </p>
                    {form.category && (
                      <div className="cat-preview">{form.category}</div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Describe the collection..."
                      rows={5}
                      value={form.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                    />
                  </div>

                  {/* Image upload */}
                  <div>
                    <label className="form-label">Collection Image</label>
                    <div className="upload-box">
                      <button
                        type="button"
                        className="upload-btn"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <Upload size={14} />
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                      </button>

                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCollectionImageUpload}
                        style={{ display: "none" }}
                      />

                      <p className="upload-hint">
                        Select image from your device. It will be uploaded
                        automatically.
                      </p>

                      {form.banner_image && (
                        <img
                          src={form.banner_image}
                          alt="Collection preview"
                          className="preview-img"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Settings ── */}
              <div className="form-card">
                <div className="form-title">
                  <Sparkles
                    size={20}
                    style={{ display: "inline", marginRight: 8, color: C.gold }}
                  />
                  Settings
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <label className="form-checkbox-label">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={form.featured}
                      onChange={(e) =>
                        updateField("featured", e.target.checked)
                      }
                    />
                    Featured Collection
                  </label>

                  <label className="form-checkbox-label">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={form.is_active}
                      onChange={(e) =>
                        updateField("is_active", e.target.checked)
                      }
                    />
                    Active Collection
                  </label>

                  {form.banner_image && (
                    <div style={{ marginTop: 8 }}>
                      <p className="form-label">Preview</p>
                      <img
                        src={form.banner_image}
                        alt="Collection preview"
                        className="preview-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 32,
                flexWrap: "wrap",
              }}
            >
              <button
                type="submit"
                disabled={loading}
                className="btn-save"
              >
                <Save size={16} />
                {loading
                  ? "Saving..."
                  : isEdit
                  ? "Update Collection"
                  : "Create Collection"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/collections")}
                className="btn-cancel"
              >
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