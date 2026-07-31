import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
  occasion?: string[] | string | null;
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

type CartContextType = {
  cart: CartItem[];
  loading: boolean;
  initialized: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (saree: Saree, quantity?: number) => Promise<void>;
  removeFromCart: (sareeId: string) => Promise<void>;
  updateQuantity: (sareeId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function normalizeOccasion(occasion?: string[] | string | null): string[] {
  if (Array.isArray(occasion)) return occasion;
  if (typeof occasion === "string" && occasion.trim()) return [occasion];
  return [];
}

function mapProductToSaree(product: BackendCartProduct): Saree {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug || "",
    price: product.discount_price ?? product.price,
    originalPrice: product.price,
    image: product.thumbnail || product.images?.[0] || "",
    images:
      product.images?.length
        ? product.images
        : product.thumbnail
        ? [product.thumbnail]
        : [],
    description: product.short_description || "",
    color: product.color || "",
    fabric: product.fabric || "",
    occasion: normalizeOccasion(product.occasion),
    weavingTechnique: product.technique || "",
    artisanDetails: product.artisan?.name
      ? `${product.artisan.name}${
          product.artisan.region ? ` - ${product.artisan.region}` : ""
        }`
      : "",
    careInstructions: product.care_instructions || "",
    stock: product.stock ?? 0,
    rating: 0,
    reviews: 0,
    featured: product.is_featured || false,
    blousePiece: false,
    length: "",
  };
}

function getCurrentToken(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (tokenStorage as any).get === "function") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (tokenStorage as any).get() || "";
    }

    return (
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token") ||
      ""
    );
  } catch {
    return "";
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const lastTokenRef = useRef<string>("");

  const loadCart = useCallback(async () => {
    const token = getCurrentToken();

    if (!token || !tokenStorage.has()) {
      setCart([]);
      setInitialized(true);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get<CartResponse>("/cart");
      const backendItems = res.data?.data?.items || [];

      const mappedItems: CartItem[] = backendItems.map((item) => ({
        saree: mapProductToSaree(item.product),
        quantity: item.quantity,
      }));

      setCart(mappedItems);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setCart([]);
      } else {
        console.error("Failed to load cart", error);
        if (error?.response?.data) {
          console.error("Backend error response:", error.response.data);
        }
      }
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    lastTokenRef.current = getCurrentToken();
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    const handleAuthChange = async () => {
      const currentToken = getCurrentToken();

      if (currentToken !== lastTokenRef.current) {
        lastTokenRef.current = currentToken;

        setCart([]);

        if (currentToken) {
          await loadCart();
        } else {
          setInitialized(true);
        }
      }
    };

    window.addEventListener("auth-changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [loadCart]);

  const addToCart = useCallback(
    async (saree: Saree, quantity: number = 1) => {
      if (!tokenStorage.has()) return;

      setLoading(true);
      try {
        await api.post("/cart/add", {
          product_id: saree.id,
          quantity,
        });

        await loadCart();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Failed to add to cart", error);
        if (error?.response?.data) {
          console.error("Backend error response:", error.response.data);
        }
        setLoading(false);
        throw error;
      }
    },
    [loadCart]
  );

  const removeFromCart = useCallback(
    async (sareeId: string) => {
      if (!tokenStorage.has()) return;

      setLoading(true);
      try {
        await api.post("/cart/remove", {
          product_id: sareeId,
        });

        await loadCart();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Failed to remove from cart", error);
        if (error?.response?.data) {
          console.error("Backend error response:", error.response.data);
        }
        setLoading(false);
        throw error;
      }
    },
    [loadCart]
  );

  const updateQuantity = useCallback(
    async (sareeId: string, quantity: number) => {
      if (!tokenStorage.has()) return;

      setLoading(true);
      try {
        if (quantity <= 0) {
          await api.post("/cart/remove", {
            product_id: sareeId,
          });

          await loadCart();
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Failed to update cart quantity", error);
        if (error?.response?.data) {
          console.error("Backend error response:", error.response.data);
        }
        setLoading(false);
        throw error;
      }
    },
    [loadCart]
  );

  const clearCart = useCallback(async () => {
    if (!tokenStorage.has()) return;

    setLoading(true);
    try {
      await Promise.all(
        cart.map((item) =>
          api.post("/cart/remove", {
            product_id: item.saree.id,
          })
        )
      );

      await loadCart();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to clear cart", error);
      if (error?.response?.data) {
        console.error("Backend error response:", error.response.data);
      }
      setLoading(false);
      throw error;
    }
  }, [cart, loadCart]);

  const getCartTotal = useCallback(() => {
    return cart.reduce(
      (total, item) => total + item.saree.price * item.quantity,
      0
    );
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const value = useMemo<CartContextType>(
    () => ({
      cart,
      loading,
      initialized,
      refreshCart: loadCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
    }),
    [
      cart,
      loading,
      initialized,
      loadCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
    ]
  );

  return createElement(CartContext.Provider, { value }, children);
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}