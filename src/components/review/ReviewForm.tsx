import React, { useState } from "react";
import { Star, Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createReview, updateReview } from "../../services/review.services";
import { QUERY_KEYS } from "../../utiils/queryKeys";
import type { ReviewRequest, ReviewResponse } from "../../types/review";

interface ReviewFormProps {
  bookingId: string;
  tourId: string;
  existingReview?: ReviewResponse;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  bookingId,
  tourId,
  existingReview,
  onSuccess,
  onCancel,
}) => {
  const [rating, setRating] = useState<number>(
    existingReview?.rating || 0
  );
  const [comment, setComment] = useState<string>(
    existingReview?.comment || ""
  );
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const queryClient = useQueryClient();

  const isEditing = !!existingReview;

  const reviewMutation = useMutation({
    mutationFn: async (data: ReviewRequest) => {
      if (isEditing) {
        return updateReview(existingReview.reviewId, data);
      }
      return createReview(data);
    },
    onSuccess: () => {
      toast.success(
        isEditing ? "Cập nhật đánh giá thành công!" : "Tạo đánh giá thành công!"
      );
      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVIEWS_BY_TOUR(tourId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_REVIEWS,
      });
      if (existingReview) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.REVIEW(existingReview.reviewId),
        });
      }
      onSuccess?.();
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.warning("Vui lòng chọn số sao đánh giá!");
      return;
    }
    if (!comment.trim()) {
      toast.warning("Vui lòng nhập nội dung đánh giá!");
      return;
    }

    reviewMutation.mutate({
      bookingId,
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Đánh giá của bạn
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              {rating} / 5
            </span>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Nhận xét
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          placeholder="Chia sẻ trải nghiệm của bạn về tour này..."
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Hủy
          </button>
        )}
        <button
          type="submit"
          disabled={reviewMutation.isPending || rating === 0}
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Send className="w-4 h-4" />
          {reviewMutation.isPending
            ? "Đang xử lý..."
            : isEditing
            ? "Cập nhật"
            : "Gửi đánh giá"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;

