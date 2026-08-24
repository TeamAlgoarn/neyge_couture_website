import { useCallback, useEffect, useState } from "react";
import api from "@/api/client";
import { tokenStorage } from "@/lib/token";

export type Review = {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name?: string;
};

type ReviewsApiResponse = {
  success: boolean;
  message?: string;
  data: Review[];
};

export function useReviews(productId?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = useCallback(async () => {
    if (!productId) {
      setReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
      return;
    }

    setLoading(true);

    try {
      const res = await api.get<ReviewsApiResponse>(`/reviews/${productId}`);

      console.log("Current review productId:", productId);
      console.log("Reviews API response:", res.data);

      const reviewsData = Array.isArray(res.data?.data) ? res.data.data : [];

      setReviews(reviewsData);

      const total = reviewsData.length;
      setTotalReviews(total);

      if (total > 0) {
        const avg =
          reviewsData.reduce((sum, review) => sum + Number(review.rating || 0), 0) / total;
        setAverageRating(avg);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error("Failed to load reviews", error);
      setReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const submitReview = async (rating: number, comment: string) => {
    if (!productId) {
      throw new Error("Product id is required");
    }

    if (!tokenStorage.has()) {
      throw new Error("Login required");
    }

    setSubmitting(true);

    try {
      await api.post("/reviews", {
        product_id: productId,
        rating,
        comment,
      });

      await loadReviews();
    } catch (error) {
      console.error("Failed to submit review", error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    reviews,
    averageRating,
    totalReviews,
    loading,
    submitting,
    submitReview,
    refreshReviews: loadReviews,
  };
}