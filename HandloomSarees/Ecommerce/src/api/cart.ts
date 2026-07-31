import api from "./client";

export async function getCart() {
  const res = await api.get("/cart");
  return res.data;
}

export async function addToCart(product_id: string, quantity: number) {
  const res = await api.post("/cart/add", { product_id, quantity });
  return res.data;
}

export async function removeFromCart(product_id: string) {
  const res = await api.post("/cart/remove", { product_id });
  return res.data;
}