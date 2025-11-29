import React, { useState } from "react";
import { Star, Edit, Trash2, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getReviewsByTour, deleteReview } from "../../services/review.services";
import { QUERY_KEYS } from "../../utiils/queryKeys";
import { useUser } from "../../hooks/useUser";
import ReviewForm from "./ReviewForm";
import type { ReviewResponse } from "../../types/review";

interface ReviewListProps {
  tourId: string;
  showCreateForm?: boolean;
  bookingId?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  tourId,
  showCreateForm = false,
  bookingId,
}) => {
  const { user } = useUser();
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(showCreateForm);
  const queryClient = useQueryClient();

  // Lấy danh sách đánh giá
  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.REVIEWS_BY_TOUR(tourId),
    queryFn: () => getReviewsByTour(tourId),
    enabled: !!tourId,
  });

  // Mutation để xóa đánh giá
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success("Xóa đánh giá thành công!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVIEWS_BY_TOUR(tourId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_REVIEWS,
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra";
      toast.error(errorMessage);
    },
  });

  const handleDelete = (reviewId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      deleteMutation.mutate(reviewId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-600">
        Có lỗi xảy ra khi tải đánh giá
      </div>
    );
  }

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header với thống kê */}
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold mb-2">Đánh giá tour</h3>
        {reviews && reviews.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
            <span className="text-gray-600">
              ({reviews.length} đánh giá)
            </span>
          </div>
        )}
      </div>

      {/* Form tạo đánh giá mới */}
      {showForm && bookingId && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <ReviewForm
            bookingId={bookingId}
            tourId={tourId}
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Danh sách đánh giá */}
      {!reviews || reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Chưa có đánh giá nào cho tour này
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isOwner = user?.userId === review.userId;
            const isEditing = editingReviewId === review.reviewId;

            return (
              <div
                key={review.reviewId}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                {isEditing ? (
                  <ReviewForm
                    bookingId={review.bookingId}
                    tourId={tourId}
                    existingReview={review}
                    onSuccess={() => setEditingReviewId(null)}
                    onCancel={() => setEditingReviewId(null)}
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.userName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                      {isOwner && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingReviewId(review.reviewId)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(review.reviewId)}
                            disabled={deleteMutation.isPending}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {review.rating} / 5
                      </span>
                    </div>

                    <p className="text-gray-700 whitespace-pre-wrap">
                      {review.comment}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewList;

