import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useReviews } from "@/hooks/useReviews";
import { tokenStorage } from "@/lib/token";

type Props = {
  productId: string;
};

export function ReviewSection({ productId }: Props) {
  const {
    reviews,
    averageRating,
    totalReviews,
    loading,
    submitting,
    submitReview,
  } = useReviews(productId);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!tokenStorage.has()) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter your review");
      return;
    }

    try {
      await submitReview(rating, comment.trim());
      setComment("");
      setRating(5);
      toast.success("Review submitted successfully");
 
 
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.error("You have already reviewed this product");
      } else {
        toast.error("Failed to submit review");
      }
    }
  };

  return (
    <section style={{ marginTop: 48, marginBottom: 64 }}>
      <h2 style={{ fontSize: 28, marginBottom: 16 }}>Customer Reviews</h2>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>
          {averageRating.toFixed(1)} / 5
        </div>
        <div style={{ color: "#666" }}>
          {totalReviews} review{totalReviews !== 1 ? "s" : ""}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 12,
          padding: 20,
          marginBottom: 32,
          background: "#fff",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>Write a Review</h3>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
            >
              <Star
                size={22}
                fill={value <= rating ? "#D4AF37" : "none"}
                color="#D4AF37"
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this saree"
          rows={4}
          style={{
            width: "100%",
            borderRadius: 10,
            border: "1px solid #ddd",
            padding: 12,
            marginBottom: 12,
            resize: "vertical",
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            padding: "12px 20px",
            borderRadius: 999,
            border: "none",
            background: "#800020",
            color: "white",
            cursor: "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      <div>
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                borderBottom: "1px solid #eee",
                padding: "16px 0",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                {review.user_name || "Customer"}
              </div>

              <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    size={16}
                    fill={value <= review.rating ? "#D4AF37" : "none"}
                    color="#D4AF37"
                  />
                ))}
              </div>

              <div style={{ color: "#444", marginBottom: 6 }}>{review.comment}</div>
              <div style={{ fontSize: 12, color: "#888" }}>
                {new Date(review.created_at).toLocaleDateString("en-IN")}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}