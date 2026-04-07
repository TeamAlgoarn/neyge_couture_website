import api from "./client";

export async function getWishlist() {
  const res = await api.get("/wishlist");
  return res.data;
}

export async function addToWishlist(product_id: string) {
  const res = await api.post("/wishlist/add", { product_id });
  return res.data;
}

export async function removeFromWishlist(product_id: string) {
  const res = await api.post("/wishlist/remove", { product_id });
  return res.data;
}