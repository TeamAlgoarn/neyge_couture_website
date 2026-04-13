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






import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminApi from "../lib/adminApi";
import { uploadProductImage } from "../lib/uploadProductImage";
import {
  Package,
  Sparkles,
  Save,
  X,
  Layers,
  Trash2,
  Image as ImageIcon,
  Star,
} from "lucide-react";

const C = {
  maroon: "#800020",
  gold: "#C4980A",
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
  font-size: 14px;
  font-weight: 500;
  color: #4a3828;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
.preview-img {
  width: 100%;
  max-height: 240px;
  border-radius: 18px;
  object-fit: cover;
  border: 1px solid rgba(196,152,10,.3);
  margin-top: 12px;
}
.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
  margin-top: 12px;
}
.preview-box {
  position: relative;
}
.preview-img-small {
  width: 100%;
  height: 110px;
  border-radius: 14px;
  object-fit: cover;
  border: 1px solid rgba(196,152,10,.3);
  background: #fff;
}
.upload-box {
  border: 1.5px dashed rgba(196,152,10,.45);
  background: rgba(255,255,255,.8);
  border-radius: 18px;
  padding: 18px;
}
.upload-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 18px;
  border-radius: 999px;
  border: 1.5px solid rgba(196,152,10,.35);
  background: rgba(196,152,10,.08);
  color: #800020;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: .25s;
}
.upload-btn:hover {
  transform: translateY(-1px);
  border-color: #C4980A;
  background: rgba(196,152,10,.14);
}
.upload-hint {
  font-size: 12px;
  color: #8b735f;
  margin-top: 10px;
  line-height: 1.5;
}
.upload-warning {
  font-size: 12px;
  color: #dc2626;
  margin-top: 8px;
  font-weight: 600;
}
.cover-box {
  margin-top: 16px;
}
.cover-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(196,152,10,.12);
  color: #800020;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  border: 1px solid rgba(196,152,10,.28);
  margin-bottom: 10px;
}
.btn-remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(192,57,43,.95);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
}
.img-badge {
  position: absolute;
  left: 8px;
  top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(212,175,55,.95);
  color: #800020;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
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
  const [uploadingImages, setUploadingImages] = useState(false);

  const imagesInputRef = useRef<HTMLInputElement | null>(null);

  const updateField = <K extends keyof ProductPayload>(key: K, value: ProductPayload[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
    if (!isEdit || !id) {
      setPageLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await adminApi.get<ProductResponse>(`/products/${id}`);
        const product = res.data?.data || res.data?.product || res.data;

        if (product) {
          setForm({
            name: product.name || "",
            slug: product.slug || "",
            price: Number(product.price || 0),
            discount_price: product.discount_price != null ? Number(product.discount_price) : null,
            thumbnail: product.thumbnail || "",
            images: Array.isArray(product.images) ? product.images : [],
            short_description: product.short_description || "",
            color: product.color || "",
            fabric: product.fabric || "",
            technique: product.technique || "",
            stock: Math.max(0, Number(product.stock || 0)),
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

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploadingImages(true);
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const url = await uploadProductImage(file);
        uploadedUrls.push(url);
      }

      setForm((prev) => ({
        ...prev,
        thumbnail: prev.thumbnail || uploadedUrls[0] || "",
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (error) {
      console.error("Images upload failed", error);
      alert("Images upload failed");
    } finally {
      setUploadingImages(false);
      if (imagesInputRef.current) imagesInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => {
      const imageToRemove = prev.images[index];
      const updatedImages = prev.images.filter((_, i) => i !== index);

      return {
        ...prev,
        images: updatedImages,
        thumbnail:
          prev.thumbnail === imageToRemove
            ? updatedImages[0] || ""
            : prev.thumbnail,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanedImages = form.images.filter((url) => url.trim() !== "");

      if (cleanedImages.length < 6) {
        alert("Please upload at least 6 product images.");
        setLoading(false);
        return;
      }

      const payload = {
        ...form,
        discount_price:
          form.discount_price === null || form.discount_price === 0
            ? null
            : Math.max(0, Number(form.discount_price)),
        price: Math.max(0, Number(form.price)),
        stock: Math.max(0, Number(form.stock)),
        collection_id: form.collection_id || null,
        collection_slug: form.collection_slug || null,
        thumbnail: form.thumbnail || cleanedImages[0] || "",
        images: cleanedImages,
      };

      if (isEdit && id) {
        await adminApi.put(`/products/${id}`, payload);
      } else {
        await adminApi.post("/products", payload);
      }

      navigate("/admin/products");
    } catch (error: any) {
      console.error("Failed to save product", error);

      const validationErrors = error?.response?.data?.data;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        alert(validationErrors.map((err: any) => err.msg).join("\n"));
      } else {
        alert(
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          "Save failed"
        );
      }
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
            <div
              style={{
                display: "grid",
                gap: 28,
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              }}
            >
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
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
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

                  <div>
                    <label className="form-label">Product Images</label>
                    <div className="upload-box">
                      <div className="upload-actions">
                        <button
                          type="button"
                          className="upload-btn"
                          onClick={() => imagesInputRef.current?.click()}
                        >
                          <ImageIcon size={15} />
                          {uploadingImages ? "Uploading..." : "Upload Product Images"}
                        </button>
                      </div>

                      <input
                        ref={imagesInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesUpload}
                        style={{ display: "none" }}
                      />

                      <p className="upload-hint">
                        Upload product images from your local folder. The first image is automatically saved as the cover thumbnail.
                      </p>
                      <p className="upload-hint">
                        Uploaded images: <strong>{form.images.length}</strong> / minimum <strong>6</strong> required
                      </p>

                      {form.images.length > 0 && form.images.length < 6 && (
                        <p className="upload-warning">
                          Please upload at least 6 images for this product.
                        </p>
                      )}

                      {form.thumbnail ? (
                        <div className="cover-box">
                          <div className="cover-label">
                            <Star size={13} />
                            Cover Image
                          </div>
                          <img
                            src={form.thumbnail}
                            alt="Cover preview"
                            className="preview-img"
                          />
                        </div>
                      ) : null}

                      {form.images.length > 0 ? (
                        <div className="preview-grid">
                          {form.images.map((url, index) => (
                            <div key={index} className="preview-box">
                              <img
                                src={url}
                                alt={`Product ${index + 1}`}
                                className="preview-img-small"
                              />

                              {form.thumbnail === url && (
                                <div className="img-badge">
                                  <Star size={10} />
                                  Cover
                                </div>
                              )}

                              <button
                                type="button"
                                className="btn-remove-image"
                                onClick={() => removeImage(index)}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-card">
                <div className="form-title">
                  <Sparkles size={20} color={C.gold} />
                  Pricing & Stock
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      className="form-input"
                      placeholder="e.g., 4999"
                      value={form.price}
                      onChange={(e) => updateField("price", Math.max(0, Number(e.target.value)))}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Discount Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      className="form-input"
                      placeholder="Optional"
                      value={form.discount_price ?? ""}
                      onChange={(e) =>
                        updateField(
                          "discount_price",
                          e.target.value ? Math.max(0, Number(e.target.value)) : null
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="form-label">Stock Quantity</label>
                    <input
                      type="number"
                      min={0}
                      className="form-input"
                      placeholder="e.g., 10"
                      value={form.stock}
                      onChange={(e) => updateField("stock", Math.max(0, Number(e.target.value)))}
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

            <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="btn-save"
              >
                <Save size={16} />
                {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/products")}
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