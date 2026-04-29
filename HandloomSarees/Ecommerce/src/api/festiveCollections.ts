import api from '@/api/client';
import adminApi from '@/admin/lib/adminApi';

export type FestiveCollection = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  banner_image?: string;
  popup_enabled: boolean;
  popup_message?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  products?: any[];
};

export type FestiveCollectionPayload = {
  name: string;
  slug: string;
  description?: string;
  banner_image?: string;
  popup_enabled: boolean;
  popup_message?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  product_ids: string[];
};

export async function getPublicFestiveCollections() {
  const res = await api.get('/festive-collections');
  return res.data?.data || [];
}

export async function getActiveFestivePopup() {
  const res = await api.get('/festive-collections/popup/active');
  return res.data?.data || null;
}

export async function getFestiveCollectionBySlug(slug: string) {
  const res = await api.get(`/festive-collections/${slug}`);
  return res.data?.data;
}

export async function getAdminFestiveCollections() {
  const res = await adminApi.get('/admin/festive-collections');
  return res.data?.data || [];
}

export async function getAdminFestiveCollectionById(id: string) {
  const res = await adminApi.get(`/admin/festive-collections/${id}`);
  return res.data?.data;
}



export async function updateFestiveCollection(id: string, payload: Partial<FestiveCollectionPayload>) {
  const res = await adminApi.put(`/admin/festive-collections/${id}`, payload);
  return res.data?.data;
}

export async function deleteFestiveCollection(id: string) {
  const res = await adminApi.delete(`/admin/festive-collections/${id}`);
  return res.data;
}
export async function createFestiveCollection(payload: FestiveCollectionPayload) {
  const res = await adminApi.post('/admin/festive-collections', payload);
  return res.data?.data;
}