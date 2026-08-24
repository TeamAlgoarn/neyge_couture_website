import api from "./client";

export async function getCollections() {
  const res = await api.get("/collections");
  return res.data;
}

export async function getCollectionBySlug(slug: string) {
  const res = await api.get(`/collections/${slug}`);
  return res.data;
}