import api from "./client";

export async function getCart() {
  const res = await api.get("/cart");
  return res.data;
}

export async function addToCart(
  product_id: string,
  quantity: number,
  selected_addons: string[] = []
) {
  const res = await api.post("/cart/add", {
    product_id,
    quantity,
    selected_addons,
  });
  return res.data;
}

export async function updateCartQuantity(
  product_id: string,
  quantity: number,
  cart_item_id?: string,
  selected_addons: string[] = []
) {
  const res = await api.post("/cart/update", {
    product_id,
    quantity,
    cart_item_id,
    selected_addons,
  });
  return res.data;
}

export async function removeFromCart(
  product_id: string,
  cart_item_id?: string,
  selected_addons: string[] = []
) {
  const res = await api.post("/cart/remove", {
    product_id,
    cart_item_id,
    selected_addons,
  });
  return res.data;
}