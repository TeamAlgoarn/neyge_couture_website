import api from "./client";
import type { Address, AddressFormData } from "../types/address";

export const addressApi = {
  async getAddresses(): Promise<Address[]> {
    const res = await api.get("/addresses");
    if (Array.isArray(res.data)) return res.data;
    return res.data?.data || [];
  },

  async createAddress(data: AddressFormData): Promise<Address> {
    const res = await api.post("/addresses", data);
    return res.data?.data || res.data;
  },

  async updateAddress(id: string, data: Partial<AddressFormData>): Promise<Address> {
    const res = await api.put(`/addresses/${id}`, data);
    return res.data?.data || res.data;
  },

  async deleteAddress(id: string): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },

  async setDefaultAddress(id: string): Promise<Address> {
    const res = await api.post(`/addresses/${id}/default`);
    return res.data?.data || res.data;
  },
};
