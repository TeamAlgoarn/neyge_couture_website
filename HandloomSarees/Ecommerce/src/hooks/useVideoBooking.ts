import { useCallback, useEffect, useState } from "react";
import api from "@/api/client";
import { tokenStorage } from "@/lib/token";

export type VideoBooking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  occasion: string;
  budget_range: string;
  preferred_date: string;
  notes?: string;
  status?: string;
  created_at?: string;
};

// Add a type for the creation payload
export type CreateVideoBookingPayload = {
  name: string;
  phone: string;
  email: string;
  occasion: string;
  budget_range: string;
  preferred_date: string;
  notes?: string;
};

type VideoBookingsResponse = {
  success: boolean;
  message: string;
  data: VideoBooking[];
};

export function useVideoBooking() {
  const [bookings, setBookings] = useState<VideoBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false); // ✅ added

  const loadBookings = useCallback(async () => {
    if (!tokenStorage.has()) {
      setBookings([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get<VideoBookingsResponse>("/my-video-bookings");
      setBookings(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error("Failed to load video bookings", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ added createBooking
  const createBooking = useCallback(async (payload: CreateVideoBookingPayload) => {
    setSubmitting(true);
    try {
      await api.post("/video-booking", payload);
      await loadBookings(); // refresh list after creation
    } catch (error) {
      console.error("Failed to create video booking", error);
      throw error; // let the page handle the error (e.g. show toast)
    } finally {
      setSubmitting(false);
    }
  }, [loadBookings]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return {
    bookings,
    loading,
    submitting,      // ✅ now returned
    createBooking,   // ✅ now returned
    refreshBookings: loadBookings,
  };
}