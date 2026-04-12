// import { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import AdminLayout from "../components/AdminLayout";
// import adminApi from "../lib/adminApi";

// type ProductPayload = {
//   name: string;
//   slug: string;
//   price: number;
//   discount_price: number | null;
//   thumbnail: string;
//   short_description: string;
//   color: string;
//   fabric: string;
//   technique: string;
//   stock: number;
//   collection_id: string;
//   is_featured: boolean;
//   is_active: boolean;
// };

// type ProductResponse = {
//   data?: (ProductPayload & { id: string }) | any;
//   product?: (ProductPayload & { id: string }) | any;
// };

// type Collection = {
//   id: string;
//   name: string;
// };

// const initialForm: ProductPayload = {
//   name: "",
//   slug: "",
//   price: 0,
//   discount_price: null,
//   thumbnail: "",
//   short_description: "",
//   color: "",
//   fabric: "",
//   technique: "",
//   stock: 0,
//   collection_id: "",
//   is_featured: false,
//   is_active: true,
// };

// export default function ProductForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEdit = useMemo(() => !!id, [id]);

//   const [form, setForm] = useState<ProductPayload>(initialForm);
//   const [collections, setCollections] = useState<Collection[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(isEdit);
//   const [collectionsLoading, setCollectionsLoading] = useState(true);

//   const updateField = <K extends keyof ProductPayload>(
//     key: K,
//     value: ProductPayload[K]
//   ) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   useEffect(() => {
//     const fetchCollections = async () => {
//       try {
//         setCollectionsLoading(true);
//         const res = await adminApi.get("/collections");
//         console.log("COLLECTIONS IN PRODUCT FORM:", res.data);

//         let items: Collection[] = [];

//         if (Array.isArray(res.data)) {
//           items = res.data;
//         } else if (Array.isArray(res.data?.data)) {
//           items = res.data.data;
//         } else if (Array.isArray(res.data?.data?.items)) {
//           items = res.data.data.items;
//         } else if (Array.isArray(res.data?.collections)) {
//           items = res.data.collections;
//         } else if (Array.isArray(res.data?.items)) {
//           items = res.data.items;
//         }

//         setCollections(items);
//       } catch (error) {
//         console.error("Failed to fetch collections", error);
//         setCollections([]);
//       } finally {
//         setCollectionsLoading(false);
//       }
//     };

//     fetchCollections();
//   }, []);

//   useEffect(() => {
//     if (!isEdit || !id) {
//       setPageLoading(false);
//       return;
//     }

//     const fetchProduct = async () => {
//       try {
//         const res = await adminApi.get<ProductResponse>(`/products/${id}`);
//         console.log("PRODUCT EDIT RESPONSE:", res.data);

//         const product =
//           res.data?.data ||
//           res.data?.product ||
//           res.data;

//         if (product) {
//           setForm({
//             name: product.name || "",
//             slug: product.slug || "",
//             price: Number(product.price || 0),
//             discount_price:
//               product.discount_price !== null &&
//               product.discount_price !== undefined
//                 ? Number(product.discount_price)
//                 : null,
//             thumbnail: product.thumbnail || "",
//             short_description: product.short_description || "",
//             color: product.color || "",
//             fabric: product.fabric || "",
//             technique: product.technique || "",
//             stock: Number(product.stock || 0),
//             collection_id:
//               product.collection_id ||
//               product.collection?.id ||
//               "",
//             is_featured: !!product.is_featured,
//             is_active: product.is_active ?? true,
//           });
//         }
//       } catch (error) {
//         console.error("Failed to fetch product", error);
//       } finally {
//         setPageLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id, isEdit]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const payload = {
//         ...form,
//         discount_price:
//           form.discount_price === null || form.discount_price === 0
//             ? null
//             : Number(form.discount_price),
//         price: Number(form.price),
//         stock: Number(form.stock),
//         collection_id: form.collection_id || null,
//       };

//       console.log("PRODUCT SAVE PAYLOAD:", payload);

//       if (isEdit && id) {
//         await adminApi.put(`/products/${id}`, payload);
//       } else {
//         await adminApi.post("/products", payload);
//       }

//       navigate("/admin/products");
//     } catch (error) {
//       console.error("Failed to save product", error);
//       alert("Save failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (pageLoading) {
//     return (
//       <AdminLayout title={isEdit ? "Edit Product" : "New Product"}>
//         <p>Loading...</p>
//       </AdminLayout>
//     );
//   }

//   return (
//     <AdminLayout title={isEdit ? "Edit Product" : "New Product"}>
//       <form onSubmit={handleSubmit} className="grid gap-6">
//         <div className="grid gap-6 md:grid-cols-2">
//           <div className="rounded-2xl border bg-white p-6 space-y-4">
//             <h3 className="text-lg font-semibold">Basic Details</h3>

//             <input
//               className="w-full rounded-xl border px-4 py-3"
//               placeholder="Product Name"
//               value={form.name}
//               onChange={(e) => updateField("name", e.target.value)}
//               required
//             />

//             <input
//               className="w-full rounded-xl border px-4 py-3"
//               placeholder="Slug"
//               value={form.slug}
//               onChange={(e) => updateField("slug", e.target.value)}
//               required
//             />

//             <select
//               className="w-full rounded-xl border px-4 py-3"
//               value={form.collection_id}
//               onChange={(e) => updateField("collection_id", e.target.value)}
//               disabled={collectionsLoading}
//             >
//               <option value="">
//                 {collectionsLoading ? "Loading collections..." : "Select Collection"}
//               </option>
//               {collections.map((collection) => (
//                 <option key={collection.id} value={collection.id}>
//                   {collection.name}
//                 </option>
//               ))}
//             </select>

//             <textarea
//               className="w-full rounded-xl border px-4 py-3"
//               placeholder="Short description"
//               rows={4}
//               value={form.short_description}
//               onChange={(e) => updateField("short_description", e.target.value)}
//             />

//             <input
//               className="w-full rounded-xl border px-4 py-3"
//               placeholder="Thumbnail URL"
//               value={form.thumbnail}
//               onChange={(e) => updateField("thumbnail", e.target.value)}
//             />

//             {form.thumbnail ? (
//               <div>
//                 <p className="mb-2 text-sm text-gray-500">Preview</p>
//                 <img
//                   src={form.thumbnail}
//                   alt="Product preview"
//                   className="h-40 w-full rounded-xl border object-cover"
//                 />
//               </div>
//             ) : null}
//           </div>

//           <div className="rounded-2xl border bg-white p-6 space-y-4">
//             <h3 className="text-lg font-semibold">Pricing & Stock</h3>

//             <input
//               type="number"
//               className="w-full rounded-xl border px-4 py-3"
//               placeholder="Price"
//               value={form.price}
//               onChange={(e) => updateField("price", Number(e.target.value))}
//               required
//             />

//             <input
//               type="number"
//               className="w-full rounded-xl border px-4 py-3"
//               placeholder="Discount Price"
//               value={form.discount_price ?? ""}
//               onChange={(e) =>
//                 updateField(
//                   "discount_price",
//                   e.target.value ? Number(e.target.value) : null
//                 )
//               }
//             />

//             <input
//               type="number"
//               className="w-full rounded-xl border px-4 py-3"
//               placeholder="Stock"
//               value={form.stock}
//               onChange={(e) => updateField("stock", Number(e.target.value))}
//             />

//             <input
//               className="w-full rounded-xl border px-4 py-3"
//               placeholder="Color"
//               value={form.color}
//               onChange={(e) => updateField("color", e.target.value)}
//             />

//             <input
//               className="w-full rounded-xl border px-4 py-3"
//               placeholder="Fabric"
//               value={form.fabric}
//               onChange={(e) => updateField("fabric", e.target.value)}
//             />

//             <input
//               className="w-full rounded-xl border px-4 py-3"
//               placeholder="Technique"
//               value={form.technique}
//               onChange={(e) => updateField("technique", e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="rounded-2xl border bg-white p-6 space-y-4">
//           <h3 className="text-lg font-semibold">Settings</h3>

//           <label className="flex items-center gap-3">
//             <input
//               type="checkbox"
//               checked={form.is_featured}
//               onChange={(e) => updateField("is_featured", e.target.checked)}
//             />
//             Featured Product
//           </label>

//           <label className="flex items-center gap-3">
//             <input
//               type="checkbox"
//               checked={form.is_active}
//               onChange={(e) => updateField("is_active", e.target.checked)}
//             />
//             Active Product
//           </label>
//         </div>

//         <div className="flex gap-3">
//           <button
//             type="submit"
//             disabled={loading}
//             className="rounded-xl bg-black px-5 py-3 text-white"
//           >
//             {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
//           </button>

//           <button
//             type="button"
//             onClick={() => navigate("/admin/products")}
//             className="rounded-xl border px-5 py-3"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </AdminLayout>
//   );
// }






import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";
import { Package, Sparkles, Save, X, Layers, Plus, Trash2 } from "lucide-react";

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

.product-form {
  font-family: 'Josefin Sans', sans-serif;
}
.form-title {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  font-weight: 500;
  color: #800020;
  margin-bottom: 20px;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 8px;
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
.preview-img-small {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid rgba(196,152,10,.3);
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
.btn-add-image {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  background: rgba(196,152,10,.1);
  border: 1.5px dashed rgba(196,152,10,.5);
  border-radius: 100px;
  font-family: 'Josefin Sans';
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #C4980A;
  cursor: pointer;
  transition: all 0.25s;
}
.btn-add-image:hover {
  background: rgba(196,152,10,.18);
  border-color: #C4980A;
}
.btn-remove-image {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(192,57,43,.1);
  border: 1px solid rgba(192,57,43,.3);
  border-radius: 50%;
  color: #c0392b;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.btn-remove-image:hover {
  background: #c0392b;
  color: white;
}
.image-url-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.slug-hint {
  font-size: 11px;
  color: #9a8070;
  margin-top: 4px;
}
@media (max-width: 768px) {
  .form-card { padding: 20px; }
  .form-title { font-size: 18px; }
  .btn-save, .btn-cancel { flex: 1; justify-content: center; }
}
`;

type ProductPayload = {
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  thumbnail: string;
  images: string[];
  short_description: string;
  color: string;
  fabric: string;
  technique: string;
  stock: number;
  collection_id: string;
  collection_slug: string;
  is_featured: boolean;
  is_active: boolean;
};

type ProductResponse = {
  data?: (ProductPayload & {
    id: string;
    collection?: { id?: string; slug?: string; name?: string };
  }) | any;
  product?: (ProductPayload & {
    id: string;
    collection?: { id?: string; slug?: string; name?: string };
  }) | any;
};

type Collection = {
  id: string;
  name: string;
  slug: string;
};

const initialForm: ProductPayload = {
  name: "",
  slug: "",
  price: 0,
  discount_price: null,
  thumbnail: "",
  images: [],
  short_description: "",
  color: "",
  fabric: "",
  technique: "",
  stock: 0,
  collection_id: "",
  collection_slug: "",
  is_featured: false,
  is_active: true,
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = useMemo(() => !!id, [id]);

  const [form, setForm] = useState<ProductPayload>(initialForm);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  const updateField = <K extends keyof ProductPayload>(key: K, value: ProductPayload[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ── Image URL list helpers ────────────────────────────────────────────────
  const addImageUrl = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const updateImageUrl = (index: number, value: string) => {
    setForm((prev) => {
      const updated = [...prev.images];
      updated[index] = value;
      return { ...prev, images: updated };
    });
  };

  const removeImageUrl = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setCollectionsLoading(true);
        const res = await adminApi.get("/collections");
        let items: Collection[] = [];
        if (Array.isArray(res.data)) items = res.data;
        else if (Array.isArray(res.data?.data)) items = res.data.data;
        else if (Array.isArray(res.data?.data?.items)) items = res.data.data.items;
        else if (Array.isArray(res.data?.collections)) items = res.data.collections;
        else if (Array.isArray(res.data?.items)) items = res.data.items;
        setCollections(items);
      } catch (error) {
        console.error("Failed to fetch collections", error);
        setCollections([]);
      } finally {
        setCollectionsLoading(false);
      }
    };
    fetchCollections();
  }, []);

  useEffect(() => {
    if (!isEdit || !id) { setPageLoading(false); return; }

    const fetchProduct = async () => {
      try {
        const res = await adminApi.get<ProductResponse>(`/products/${id}`);
        const product = res.data?.data || res.data?.product || res.data;
        if (product) {
          setForm({
            name: product.name || "",
            slug: product.slug || "",
            price: Number(product.price || 0),
            discount_price:
              product.discount_price != null ? Number(product.discount_price) : null,
            thumbnail: product.thumbnail || "",
            images: Array.isArray(product.images) ? product.images : [],
            short_description: product.short_description || "",
            color: product.color || "",
            fabric: product.fabric || "",
            technique: product.technique || "",
            stock: Number(product.stock || 0),
            collection_id: product.collection_id || product.collection?.id || "",
            collection_slug: product.collection_slug || product.collection?.slug || "",
            is_featured: !!product.is_featured,
            is_active: product.is_active ?? true,
          });
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setPageLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEdit]);

  const handleCollectionChange = (collectionId: string) => {
    const selected = collections.find((c) => c.id === collectionId);
    setForm((prev) => ({
      ...prev,
      collection_id: collectionId,
      collection_slug: selected?.slug || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        discount_price: form.discount_price === null || form.discount_price === 0
          ? null : Number(form.discount_price),
        price: Number(form.price),
        stock: Number(form.stock),
        collection_id: form.collection_id || null,
        collection_slug: form.collection_slug || null,
        // filter out any empty image URLs before sending
        images: form.images.filter((url) => url.trim() !== ""),
      };

      if (isEdit && id) {
        await adminApi.put(`/products/${id}`, payload);
      } else {
        await adminApi.post("/products", payload);
      }
      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to save product", error);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <AdminLayout title={isEdit ? "Edit Product" : "New Product"}>
        <div className="product-form" style={{ textAlign: "center", padding: "60px 20px" }}>
          Loading product data...
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <AdminLayout title={isEdit ? "Edit Product" : "New Product"}>
        <div className="product-form">
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>

              {/* ── Basic Details Card ── */}
              <div className="form-card">
                <div className="form-title">
                  <Package size={20} color={C.gold} />
                  Basic Details
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label className="form-label">Product Name</label>
                    <input
                      className="form-input"
                      placeholder="e.g., Banarasi Silk Saree"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Slug</label>
                    <input
                      className="form-input"
                      placeholder="e.g., banarasi-silk-saree"
                      value={form.slug}
                      onChange={(e) => updateField("slug", e.target.value)}
                      required
                    />
                    <p className="slug-hint">URL-friendly identifier (lowercase, hyphens)</p>
                  </div>
                  <div>
                    <label className="form-label">Collection</label>
                    <select
                      className="form-select"
                      value={form.collection_id}
                      onChange={(e) => handleCollectionChange(e.target.value)}
                      disabled={collectionsLoading}
                    >
                      <option value="">
                        {collectionsLoading ? "Loading collections..." : "Select Collection"}
                      </option>
                      {collections.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {form.collection_slug && (
                      <p className="slug-hint" style={{ marginTop: 6 }}>
                        Collection slug: {form.collection_slug}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Short Description</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Brief description of the product..."
                      rows={4}
                      value={form.short_description}
                      onChange={(e) => updateField("short_description", e.target.value)}
                    />
                  </div>

                  {/* ── Thumbnail URL ── */}
                  <div>
                    <label className="form-label">Thumbnail URL</label>
                    <input
                      className="form-input"
                      placeholder="https://example.com/image.jpg"
                      value={form.thumbnail}
                      onChange={(e) => updateField("thumbnail", e.target.value)}
                    />
                  </div>
                  {form.thumbnail && (
                    <div>
                      <p className="form-label">Thumbnail Preview</p>
                      <img
                        src={form.thumbnail}
                        alt="Thumbnail preview"
                        className="preview-img"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                  )}

                  {/* ── Image URLs ── */}
                  <div>
                    <label className="form-label">Image URLs</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {form.images.map((url, index) => (
                        <div key={index} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <div className="image-url-row">
                            <input
                              className="form-input"
                              placeholder={`https://example.com/image-${index + 1}.jpg`}
                              value={url}
                              onChange={(e) => updateImageUrl(index, e.target.value)}
                            />
                            <button
                              type="button"
                              className="btn-remove-image"
                              onClick={() => removeImageUrl(index)}
                              title="Remove image"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          {url && (
                            <img
                              src={url}
                              alt={`Image ${index + 1} preview`}
                              className="preview-img-small"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add-image"
                        onClick={addImageUrl}
                      >
                        <Plus size={13} />
                        Add Image URL
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Pricing & Stock Card ── */}
              <div className="form-card">
                <div className="form-title">
                  <Sparkles size={20} color={C.gold} />
                  Pricing &amp; Stock
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g., 4999"
                      value={form.price}
                      onChange={(e) => updateField("price", Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Discount Price (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Optional"
                      value={form.discount_price ?? ""}
                      onChange={(e) =>
                        updateField("discount_price", e.target.value ? Number(e.target.value) : null)
                      }
                    />
                  </div>
                  <div>
                    <label className="form-label">Stock Quantity</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g., 10"
                      value={form.stock}
                      onChange={(e) => updateField("stock", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Color</label>
                    <input
                      className="form-input"
                      placeholder="e.g., Red, Gold"
                      value={form.color}
                      onChange={(e) => updateField("color", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Fabric</label>
                    <input
                      className="form-input"
                      placeholder="e.g., Silk, Cotton"
                      value={form.fabric}
                      onChange={(e) => updateField("fabric", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Weaving Technique</label>
                    <input
                      className="form-input"
                      placeholder="e.g., Banarasi, Kanchipuram"
                      value={form.technique}
                      onChange={(e) => updateField("technique", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Settings Card ── */}
            <div className="form-card" style={{ marginTop: 28 }}>
              <div className="form-title">
                <Layers size={20} color={C.gold} />
                Settings
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={form.is_featured}
                    onChange={(e) => updateField("is_featured", e.target.checked)}
                  />
                  Featured Product
                </label>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={form.is_active}
                    onChange={(e) => updateField("is_active", e.target.checked)}
                  />
                  Active Product
                </label>
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
              <button type="submit" disabled={loading} className="btn-save">
                <Save size={16} />
                {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
              </button>
              <button type="button" onClick={() => navigate("/admin/products")} className="btn-cancel">
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