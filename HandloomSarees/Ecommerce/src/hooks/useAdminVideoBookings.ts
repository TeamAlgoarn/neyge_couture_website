import { useCallback, useEffect, useState } from "react";
import adminApi from "@/admin/lib/adminApi";

export type AdminVideoBooking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  occasion?: string;
  budget_range?: string;
  preferred_date: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at?: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: AdminVideoBooking[];
};

export function useAdminVideoBookings() {
  const [bookings, setBookings] = useState<AdminVideoBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.get<ApiResponse>("/video-bookings");
      setBookings(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error("Failed to load video bookings", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(
    async (bookingId: string, status: AdminVideoBooking["status"]) => {
      setUpdatingId(bookingId);
      try {
        await adminApi.patch(`/video-bookings/${bookingId}/status`, { status });
        await loadBookings();
      } catch (error) {
        console.error("Failed to update booking status", error);
        throw error;
      } finally {
        setUpdatingId(null);
      }
    },
    [loadBookings]
  );

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return {
    bookings,
    loading,
    updatingId,
    updateStatus,
    refreshBookings: loadBookings,
  };
}