import { useState, useEffect } from 'react';
import type { Saree } from '@/types';

const WISHLIST_STORAGE_KEY = 'handloom_wishlist';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Saree[]>(() => {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (saree: Saree) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === saree.id)) {
        return prev;
      }
      return [...prev, saree];
    });
  };

  const removeFromWishlist = (sareeId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== sareeId));
  };

  const isInWishlist = (sareeId: string) => {
    return wishlist.some((item) => item.id === sareeId);
  };

  const toggleWishlist = (saree: Saree) => {
    if (isInWishlist(saree.id)) {
      removeFromWishlist(saree.id);
    } else {
      addToWishlist(saree);
    }
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
  };
}
