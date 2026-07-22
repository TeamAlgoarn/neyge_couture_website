// // import { useState, useEffect } from 'react';
// // import type { Saree } from '@/types';

// // const WISHLIST_STORAGE_KEY = 'handloom_wishlist';

// // export function useWishlist() {
// //   const [wishlist, setWishlist] = useState<Saree[]>(() => {
// //     const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
// //     return saved ? JSON.parse(saved) : [];
// //   });

// //   useEffect(() => {
// //     localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
// //   }, [wishlist]);

// //   const addToWishlist = (saree: Saree) => {
// //     setWishlist((prev) => {
// //       if (prev.find((item) => item.id === saree.id)) {
// //         return prev;
// //       }
// //       return [...prev, saree];
// //     });
// //   };

// //   const removeFromWishlist = (sareeId: string) => {
// //     setWishlist((prev) => prev.filter((item) => item.id !== sareeId));
// //   };

// //   const isInWishlist = (sareeId: string) => {
// //     return wishlist.some((item) => item.id === sareeId);
// //   };

// //   const toggleWishlist = (saree: Saree) => {
// //     if (isInWishlist(saree.id)) {
// //       removeFromWishlist(saree.id);
// //     } else {
// //       addToWishlist(saree);
// //     }
// //   };

// //   return {
// //     wishlist,
// //     addToWishlist,
// //     removeFromWishlist,
// //     isInWishlist,
// //     toggleWishlist,
// //   };
// // }


// // below code is for actual API integration, replace the above mock implementation with this when ready to connect to backend

// import { useCallback, useEffect, useState } from "react";
// import api from "@/api/client";
// import { tokenStorage } from "@/lib/token";
// import type { Saree } from "@/types";

// type BackendWishlistProduct = {
//   id: string;
//   name: string;
//   slug?: string;
//   price: number;
//   discount_price?: number | null;
//   thumbnail?: string | null;
//   images?: string[];
//   short_description?: string | null;
//   color?: string | null;
//   fabric?: string | null;
//   stock?: number | null;
//   technique?: string | null;
//   artisan?: {
//     name?: string;
//     region?: string;
//     experience?: string;
//   } | null;
//   occasion?: string[];
//   care_instructions?: string | null;
//   is_featured?: boolean;
// };

// type WishlistResponse = {
//   success: boolean;
//   message: string;
//   data: BackendWishlistProduct[];
// };

// function mapProductToSaree(product: BackendWishlistProduct): Saree {
//   const safeImages =
//     Array.isArray(product.images) && product.images.length > 0
//       ? product.images.filter(
//           (img) =>
//             typeof img === "string" &&
//             img.trim() !== "" &&
//             !img.includes("via.placeholder.com") &&
//             !img.includes("example.com")
//         )
//       : [];

//   const primaryImage =
//     product.thumbnail &&
//     product.thumbnail.trim() !== "" &&
//     !product.thumbnail.includes("via.placeholder.com") &&
//     !product.thumbnail.includes("example.com")
//       ? product.thumbnail
//       : safeImages[0] || "";

//   return {
//     id: product.id,
//     name: product.name,
//     slug: product.slug || "",
//     price: product.discount_price ?? product.price,
//     originalPrice: product.price,
//     image: primaryImage,
//     images: safeImages,
//     description: product.short_description || "",
//     color: product.color || "",
//     fabric: product.fabric || "",
//     occasion: product.occasion || [],
//     weavingTechnique: product.technique || "",
//     artisanDetails: product.artisan?.name
//       ? `${product.artisan.name}${product.artisan.region ? ` - ${product.artisan.region}` : ""}`
//       : "",
//     careInstructions: product.care_instructions || "",
//     stock: product.stock || 0,
//     rating: 0,
//     reviews: 0,
//     featured: product.is_featured || false,
//     blousePiece: false,
//     length: "",
//     newArrival: false,
//     bestSeller: false,
//   };
// }

// export function useWishlist() {
//   const [wishlist, setWishlist] = useState<Saree[]>([]);
//   const [loading, setLoading] = useState(false);

//   const loadWishlist = useCallback(async () => {
//     if (!tokenStorage.has()) {
//       setWishlist([]);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await api.get<WishlistResponse>("/wishlist");
//       const items = res.data?.data || [];
//       setWishlist(items.map(mapProductToSaree));
//     } catch (error: any) {
//       if (error?.response?.status === 401) {
//         setWishlist([]);
//       } else {
//         console.error("Failed to load wishlist", error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadWishlist();
//   }, [loadWishlist]);

//   const addToWishlist = async (saree: Saree) => {
//     if (!tokenStorage.has()) return;

//     await api.post("/wishlist/add", {
//       product_id: saree.id,
//     });

//     await loadWishlist();
//   };

//   const removeFromWishlist = async (sareeId: string) => {
//     if (!tokenStorage.has()) return;

//     await api.post("/wishlist/remove", {
//       product_id: sareeId,
//     });

//     await loadWishlist();
//   };

//   const isInWishlist = (sareeId: string) => {
//     return wishlist.some((item) => item.id === sareeId);
//   };

//   const toggleWishlist = async (saree: Saree) => {
//     if (!tokenStorage.has()) return;

//     if (isInWishlist(saree.id)) {
//       await removeFromWishlist(saree.id);
//     } else {
//       await addToWishlist(saree);
//     }
//   };

//   return {
//     wishlist,
//     loading,
//     refreshWishlist: loadWishlist,
//     addToWishlist,
//     removeFromWishlist,
//     isInWishlist,
//     toggleWishlist,
//   };
// }
  

import { useCallback, useEffect, useState } from "react";
import api from "@/api/client";
import { tokenStorage } from "@/lib/token";
import type { Saree } from "@/types";

type BackendWishlistProduct = {
  id: string;
  name: string;
  slug?: string;
  price: number;
  discount_price?: number | null;
  thumbnail?: string | null;
  images?: string[];
  short_description?: string | null;
  color?: string | null;
  fabric?: string | null;
  stock?: number | null;
  technique?: string | null;
  artisan?: {
    name?: string;
    region?: string;
    experience?: string;
  } | null;
  occasion?: string[];
  care_instructions?: string | null;
  is_featured?: boolean;
};

type WishlistResponse = {
  success: boolean;
  message: string;
  data: BackendWishlistProduct[];
};

function isValidImage(url?: string | null) {
  return (
    typeof url === "string" &&
    url.trim() !== "" &&
    !url.includes("via.placeholder.com") &&
    !url.includes("example.com")
  );
}

function mapProductToSaree(product: BackendWishlistProduct): Saree {
  const safeThumbnail = isValidImage(product.thumbnail) ? product.thumbnail!.trim() : "";

  const safeImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter((img) => isValidImage(img)).map((img) => img.trim())
      : [];

  const finalImages =
    safeImages.length > 0
      ? safeImages
      : safeThumbnail
      ? [safeThumbnail]
      : [];

  const primaryImage = safeThumbnail || finalImages[0] || "";

  return {
    id: product.id,
    name: product.name,
    slug: product.slug || "",
    price: typeof product.discount_price === "number" ? product.discount_price : product.price,
    originalPrice: product.price,
    image: primaryImage,
    images: finalImages,
    description: product.short_description || "",
    color: product.color || "",
    fabric: product.fabric || "",
    occasion: product.occasion || [],
    weavingTechnique: product.technique || "",
    artisanDetails: product.artisan?.name
      ? `${product.artisan.name}${product.artisan.region ? ` - ${product.artisan.region}` : ""}`
      : "",
    careInstructions: product.care_instructions || "",
    stock: typeof product.stock === "number" ? product.stock : 1,
    rating: 0,
    reviews: 0,
    featured: product.is_featured || false,
    blousePiece: false,
    length: "",
    newArrival: false,
    bestSeller: false,
  };
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Saree[]>([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!tokenStorage.has()) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get<WishlistResponse>("/wishlist");
      const items = res.data?.data || [];
      setWishlist(items.map(mapProductToSaree));
 
 
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setWishlist([]);
      } else {
        console.error("Failed to load wishlist", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

 const addToWishlist = async (saree: Saree) => {
  if (!tokenStorage.has()) return;

  try {
    await api.post("/wishlist/add", {
      product_id: saree.id,
    });

    await loadWishlist();
  } catch (error) {
    console.error("Failed to add wishlist", error);
    throw error;
  }
};

  const removeFromWishlist = async (sareeId: string) => {
  if (!tokenStorage.has()) return;

  try {
    console.log("Removing wishlist item:", sareeId);

    const res = await api.post("/wishlist/remove", {
      product_id: sareeId,
    });

    console.log("Remove wishlist response:", res.data);

    setWishlist((prev) => prev.filter((item) => item.id !== sareeId));
  } catch (error) {
    console.error("Failed to remove wishlist", error);
    throw error;
  }
};
  const isInWishlist = (sareeId: string) => {
    return wishlist.some((item) => item.id === sareeId);
  };

  const toggleWishlist = async (saree: Saree) => {
  if (!tokenStorage.has()) return;

  try {
    if (isInWishlist(saree.id)) {
      await removeFromWishlist(saree.id);
    } else {
      await addToWishlist(saree);
    }
  } catch (error) {
    console.error("Failed to toggle wishlist", error);
    throw error;
  }
};

  return {
    wishlist,
    loading,
    refreshWishlist: loadWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
  };
}