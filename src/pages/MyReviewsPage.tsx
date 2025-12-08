import React, { useState, useEffect } from "react";
import { ArrowLeft, Star, Edit, Trash2, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMyReviews, deleteReview } from "../services/review.services";
import { QUERY_KEYS } from "../utils/queryKeys";
import { useUser } from "../hooks/useUser";
import ReviewForm from "../components/review/ReviewForm";

const MyReviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState<{
    bookingId?: string;
    tourId?: string;
  } | null>(null);
  const queryClient = useQueryClient();

  // Kiểm tra state từ navigation để hiển thị form tạo review
  useEffect(() => {
    if (location.state?.action === "CREATE_REVIEW") {
      setShowCreateForm(true);
      setCreateFormData({
        bookingId: location.state.bookingId,
        tourId: location.state.tourId,
      });
      // Clear state để tránh hiển thị lại khi refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.MY_REVIEWS,
    queryFn: getMyReviews,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success("Xóa đánh giá thành công!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_REVIEWS,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra";
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Đang tải đánh giá của bạn...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            Có lỗi xảy ra khi tải đánh giá
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Đánh giá của tôi</h1>
          <p className="mt-2 text-gray-600">
            Bạn đã có {reviews?.length || 0} đánh giá
          </p>
        </div>

        {/* Form tạo đánh giá mới từ BookingPage */}
        {showCreateForm &&
          createFormData?.bookingId &&
          createFormData?.tourId && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold mb-4">Tạo đánh giá mới</h2>
              <ReviewForm
                bookingId={createFormData.bookingId}
                tourId={createFormData.tourId}
                onSuccess={() => {
                  setShowCreateForm(false);
                  setCreateFormData(null);
                }}
                onCancel={() => {
                  setShowCreateForm(false);
                  setCreateFormData(null);
                }}
              />
            </div>
          )}

        {/* Danh sách đánh giá */}
        {!reviews || reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có đánh giá nào
            </h2>
            <p className="text-gray-500 mb-6">
              Hãy đánh giá các tour bạn đã hoàn thành
            </p>
            <button
              onClick={() => navigate("/bookings")}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Xem booking của tôi
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const isEditing = editingReviewId === review.reviewId;

              return (
                <div
                  key={review.reviewId}
                  className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                >
                  {isEditing ? (
                    <ReviewForm
                      bookingId={review.bookingId}
                      tourId={review.tourId}
                      existingReview={review}
                      onSuccess={() => setEditingReviewId(null)}
                      onCancel={() => setEditingReviewId(null)}
                    />
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {review.tourTitle}
                          </h3>
                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
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
                          <p className="text-gray-700 whitespace-pre-wrap mb-2">
                            {review.comment}
                          </p>
                          <p className="text-xs text-gray-500">
                            Đánh giá vào:{" "}
                            {new Date(review.createdAt).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              }
                            )}
                            {/* updatedAt removed: frontend shows only createdAt */}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => setEditingReviewId(review.reviewId)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(review.reviewId)}
                            disabled={deleteMutation.isPending}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Xóa"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviewsPage;
