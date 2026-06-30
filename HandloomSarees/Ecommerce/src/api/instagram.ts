import api from "@/api/client";

export const getInstagramMedia = async (limit = 6) => {
  const res = await api.get(`/instagram/media?limit=${limit}`);
  return res.data;
};