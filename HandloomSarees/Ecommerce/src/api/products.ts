import api from "./client";

export type ProductQuery = {
  page?: number;
  page_size?: number;
  collection?: string;
  occasion?: string;
  fabric?: string;
  color?: string;
  featured?: boolean;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: "created_at" | "price" | "name";
  sort_order?: "asc" | "desc";
};

export async function getProducts(params: ProductQuery = {}) {
  const res = await api.get("/products", { params });
  return res.data;
}

export async function getProductBySlug(slug: string) {
  const res = await api.get(`/products/slug/${slug}`);
  return res.data;
}