// // import { useState, useEffect } from 'react';
// // import type { CartItem, Saree } from '@/types';

// // const CART_STORAGE_KEY = 'handloom_cart';

// // export function useCart() {
// //   const [cart, setCart] = useState<CartItem[]>(() => {
// //     const saved = localStorage.getItem(CART_STORAGE_KEY);
// //     return saved ? JSON.parse(saved) : [];
// //   });

// //   useEffect(() => {
// //     localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
// //   }, [cart]);

// //   const addToCart = (saree: Saree, quantity: number = 1) => {
// //     setCart((prevCart) => {
// //       const existingItem = prevCart.find((item) => item.saree.id === saree.id);
// //       if (existingItem) {
// //         return prevCart.map((item) =>
// //           item.saree.id === saree.id
// //             ? { ...item, quantity: item.quantity + quantity }
// //             : item
// //         );
// //       }
// //       return [...prevCart, { saree, quantity }];
// //     });
// //   };

// //   const removeFromCart = (sareeId: string) => {
// //     setCart((prevCart) => prevCart.filter((item) => item.saree.id !== sareeId));
// //   };

// //   const updateQuantity = (sareeId: string, quantity: number) => {
// //     if (quantity <= 0) {
// //       removeFromCart(sareeId);
// //       return;
// //     }
// //     setCart((prevCart) =>
// //       prevCart.map((item) =>
// //         item.saree.id === sareeId ? { ...item, quantity } : item
// //       )
// //     );
// //   };

// //   const clearCart = () => {
// //     setCart([]);
// //   };

// //   const getCartTotal = () => {
// //     return cart.reduce((total, item) => total + item.saree.price * item.quantity, 0);
// //   };

// //   const getCartCount = () => {
// //     return cart.reduce((count, item) => count + item.quantity, 0);
// //   };

// //   return {
// //     cart,
// //     addToCart,
// //     removeFromCart,
// //     updateQuantity,
// //     clearCart,
// //     getCartTotal,
// //     getCartCount,
// //   };
// // }


// //below code is for backend cart management using API calls
// import { useCallback, useEffect, useMemo, useState } from "react";
// import api from "@/api/client";
// import { tokenStorage } from "@/lib/token";
// import type { CartItem, Saree } from "@/types";

// type BackendCartProduct = {
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

// type BackendCartItem = {
//   id: string;
//   product_id: string;
//   quantity: number;
//   unit_price: number;
//   line_total: number;
//   product: BackendCartProduct;
// };

// type CartResponse = {
//   success: boolean;
//   message: string;
//   data: {
//     cart_id: string;
//     user_id: string;
//     items: BackendCartItem[];
//     subtotal: number;
//     total_items: number;
//   };
// };

// function mapProductToSaree(product: BackendCartProduct): Saree {
//   return {
//     id: product.id,
//     name: product.name,
//     slug: product.slug || "",
//     price: product.discount_price ?? product.price,
//     originalPrice: product.price,
//     image: product.thumbnail || product.images?.[0] || "",
//     images: product.images || [],
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
//   };
// }

// export function useCart() {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   const loadCart = useCallback(async () => {
//     if (!tokenStorage.has()) {
//       setCart([]);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await api.get<CartResponse>("/cart");
//       const backendItems = res.data?.data?.items || [];

//       const mappedItems: CartItem[] = backendItems.map((item) => ({
//         saree: mapProductToSaree(item.product),
//         quantity: item.quantity,
//       }));

//       setCart(mappedItems);
//     } catch (error: any) {
//       if (error?.response?.status === 401) {
//         setCart([]);
//       } else {
//         console.error("Failed to load cart", error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadCart();
//   }, [loadCart]);

//   const addToCart = async (saree: Saree, quantity: number = 1) => {
//     if (!tokenStorage.has()) return;

//     try {
//       await api.post("/cart/add", {
//         product_id: saree.id,
//         quantity,
//       });
//       await loadCart();
//     } catch (error) {
//       console.error("Failed to add to cart", error);
//       throw error;
//     }
//   };

//   const removeFromCart = async (sareeId: string) => {
//     if (!tokenStorage.has()) return;

//     try {
//       await api.post("/cart/remove", {
//         product_id: sareeId,
//       });
//       await loadCart();
//     } catch (error) {
//       console.error("Failed to remove from cart", error);
//       throw error;
//     }
//   };

//   const updateQuantity = async (sareeId: string, quantity: number) => {
//     if (!tokenStorage.has()) return;

//     try {
//       if (quantity <= 0) {
//         await removeFromCart(sareeId);
//         return;
//       }

//       // remove old cart line completely
//       await api.post("/cart/remove", {
//         product_id: sareeId,
//       });

//       // add again with new exact quantity
//       await api.post("/cart/add", {
//         product_id: sareeId,
//         quantity,
//       });

//       await loadCart();
//     } catch (error) {
//       console.error("Failed to update cart quantity", error);
//       throw error;
//     }
//   };

//   const clearCart = async () => {
//     if (!tokenStorage.has()) return;

//     try {
//       for (const item of cart) {
//         await api.post("/cart/remove", {
//           product_id: item.saree.id,
//         });
//       }
//       await loadCart();
//     } catch (error) {
//       console.error("Failed to clear cart", error);
//       throw error;
//     }
//   };

//   const getCartTotal = useMemo(() => {
//     return () =>
//       cart.reduce((total, item) => total + item.saree.price * item.quantity, 0);
//   }, [cart]);

//   const getCartCount = useMemo(() => {
//     return () => cart.reduce((count, item) => count + item.quantity, 0);
//   }, [cart]);

//   return {
//     cart,
//     loading,
//     refreshCart: loadCart,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartCount,
//   };
// }





import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/api/client";
import { tokenStorage } from "@/lib/token";
import type { CartItem, Saree } from "@/types";

type BackendCartProduct = {
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

type BackendCartItem = {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  product: BackendCartProduct;
};

type CartResponse = {
  success: boolean;
  message: string;
  data: {
    cart_id: string;
    user_id: string;
    items: BackendCartItem[];
    subtotal: number;
    total_items: number;
  };
};

function mapProductToSaree(product: BackendCartProduct): Saree {
  const safeImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter(
          (img) =>
            typeof img === "string" &&
            img.trim() !== "" &&
            !img.includes("via.placeholder.com") &&
            !img.includes("example.com")
        )
      : [];

  const primaryImage =
    product.thumbnail &&
    product.thumbnail.trim() !== "" &&
    !product.thumbnail.includes("via.placeholder.com") &&
    !product.thumbnail.includes("example.com")
      ? product.thumbnail
      : safeImages[0] || "";

  return {
    id: product.id,
    name: product.name,
    slug: product.slug || "",
    price: product.discount_price ?? product.price,
    originalPrice: product.price,
    image: primaryImage,
    images: safeImages,
    description: product.short_description || "",
    color: product.color || "",
    fabric: product.fabric || "",
    occasion: product.occasion || [],
    weavingTechnique: product.technique || "",
    artisanDetails: product.artisan?.name
      ? `${product.artisan.name}${product.artisan.region ? ` - ${product.artisan.region}` : ""}`
      : "",
    careInstructions: product.care_instructions || "",
    stock: product.stock || 0,
    rating: 0,
    reviews: 0,
    featured: product.is_featured || false,
    blousePiece: false,
    length: "",
    newArrival: false,
    bestSeller: false,
  };
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    setLoading(true);

    try {
      if (!tokenStorage.has()) {
        setCart([]);
        return;
      }

      const res = await api.get<CartResponse>("/cart");
      const backendItems = res.data?.data?.items || [];

      const mappedItems: CartItem[] = backendItems.map((item) => ({
        saree: mapProductToSaree(item.product),
        quantity: item.quantity,
      }));

      setCart(mappedItems);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setCart([]);
      } else {
        console.error("Failed to load cart", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (saree: Saree, quantity: number = 1) => {
    if (!tokenStorage.has()) return;

    try {
      await api.post("/cart/add", {
        product_id: saree.id,
        quantity,
      });
      await loadCart();
    } catch (error) {
      console.error("Failed to add to cart", error);
      throw error;
    }
  };

  const removeFromCart = async (sareeId: string) => {
    if (!tokenStorage.has()) return;

    try {
      await api.post("/cart/remove", {
        product_id: sareeId,
      });
      await loadCart();
    } catch (error) {
      console.error("Failed to remove from cart", error);
      throw error;
    }
  };

  const updateQuantity = async (sareeId: string, quantity: number) => {
    if (!tokenStorage.has()) return;

    try {
      if (quantity <= 0) {
        await removeFromCart(sareeId);
        return;
      }

      await api.post("/cart/remove", {
        product_id: sareeId,
      });

      await api.post("/cart/add", {
        product_id: sareeId,
        quantity,
      });

      await loadCart();
    } catch (error) {
      console.error("Failed to update cart quantity", error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!tokenStorage.has()) return;

    try {
      for (const item of cart) {
        await api.post("/cart/remove", {
          product_id: item.saree.id,
        });
      }
      await loadCart();
    } catch (error) {
      console.error("Failed to clear cart", error);
      throw error;
    }
  };

  const getCartTotal = useMemo(() => {
    return () =>
      cart.reduce((total, item) => total + item.saree.price * item.quantity, 0);
  }, [cart]);

  const getCartCount = useMemo(() => {
    return () => cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return {
    cart,
    loading,
    refreshCart: loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };
}