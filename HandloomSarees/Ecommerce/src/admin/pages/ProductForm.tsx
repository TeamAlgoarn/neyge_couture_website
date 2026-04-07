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

type ProductPayload = {
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  thumbnail: string;
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
    collection?: {
      id?: string;
      slug?: string;
      name?: string;
    };
  }) | any;
  product?: (ProductPayload & {
    id: string;
    collection?: {
      id?: string;
      slug?: string;
      name?: string;
    };
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

  const updateField = <K extends keyof ProductPayload>(
    key: K,
    value: ProductPayload[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setCollectionsLoading(true);
        const res = await adminApi.get("/collections");
        console.log("COLLECTIONS IN PRODUCT FORM:", res.data);

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
        console.log("PRODUCT EDIT RESPONSE:", res.data);

        const product = res.data?.data || res.data?.product || res.data;

        if (product) {
          setForm({
            name: product.name || "",
            slug: product.slug || "",
            price: Number(product.price || 0),
            discount_price:
              product.discount_price !== null &&
              product.discount_price !== undefined
                ? Number(product.discount_price)
                : null,
            thumbnail: product.thumbnail || "",
            short_description: product.short_description || "",
            color: product.color || "",
            fabric: product.fabric || "",
            technique: product.technique || "",
            stock: Number(product.stock || 0),
            collection_id: product.collection_id || product.collection?.id || "",
            collection_slug:
              product.collection_slug || product.collection?.slug || "",
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
    const selectedCollection = collections.find(
      (collection) => collection.id === collectionId
    );

    setForm((prev) => ({
      ...prev,
      collection_id: collectionId,
      collection_slug: selectedCollection?.slug || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        discount_price:
          form.discount_price === null || form.discount_price === 0
            ? null
            : Number(form.discount_price),
        price: Number(form.price),
        stock: Number(form.stock),
        collection_id: form.collection_id || null,
        collection_slug: form.collection_slug || null,
      };

      console.log("PRODUCT SAVE PAYLOAD:", payload);

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
        <p>Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? "Edit Product" : "New Product"}>
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 space-y-4">
            <h3 className="text-lg font-semibold">Basic Details</h3>

            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Product Name"
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

            <select
              className="w-full rounded-xl border px-4 py-3"
              value={form.collection_id}
              onChange={(e) => handleCollectionChange(e.target.value)}
              disabled={collectionsLoading}
            >
              <option value="">
                {collectionsLoading ? "Loading collections..." : "Select Collection"}
              </option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>

            {form.collection_slug ? (
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                Selected collection slug:{" "}
                <span className="font-medium">{form.collection_slug}</span>
              </div>
            ) : null}

            <textarea
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Short description"
              rows={4}
              value={form.short_description}
              onChange={(e) => updateField("short_description", e.target.value)}
            />

            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Thumbnail URL"
              value={form.thumbnail}
              onChange={(e) => updateField("thumbnail", e.target.value)}
            />

            {form.thumbnail ? (
              <div>
                <p className="mb-2 text-sm text-gray-500">Preview</p>
                <img
                  src={form.thumbnail}
                  alt="Product preview"
                  className="h-40 w-full rounded-xl border object-cover"
                />
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border bg-white p-6 space-y-4">
            <h3 className="text-lg font-semibold">Pricing & Stock</h3>

            <input
              type="number"
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Price"
              value={form.price}
              onChange={(e) => updateField("price", Number(e.target.value))}
              required
            />

            <input
              type="number"
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Discount Price"
              value={form.discount_price ?? ""}
              onChange={(e) =>
                updateField(
                  "discount_price",
                  e.target.value ? Number(e.target.value) : null
                )
              }
            />

            <input
              type="number"
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => updateField("stock", Number(e.target.value))}
            />

            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Color"
              value={form.color}
              onChange={(e) => updateField("color", e.target.value)}
            />

            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Fabric"
              value={form.fabric}
              onChange={(e) => updateField("fabric", e.target.value)}
            />

            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Technique"
              value={form.technique}
              onChange={(e) => updateField("technique", e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 space-y-4">
          <h3 className="text-lg font-semibold">Settings</h3>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => updateField("is_featured", e.target.checked)}
            />
            Featured Product
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => updateField("is_active", e.target.checked)}
            />
            Active Product
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-5 py-3 text-white"
          >
            {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="rounded-xl border px-5 py-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}