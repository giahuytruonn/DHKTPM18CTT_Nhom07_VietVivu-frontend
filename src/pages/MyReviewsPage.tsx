import React, { useState, useEffect } from "react";
import { ArrowLeft, Star, Edit, Trash2, MapPin, Calendar, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMyReviews, deleteReview } from "../services/review.services";
import { QUERY_KEYS } from "../utils/queryKeys";
import { useUser } from "../hooks/useUser";
import ReviewForm from "../components/review/ReviewForm";
import type { ReviewResponse } from "../types/review"; // Import type nếu cần

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

  // Kiểm tra state từ navigation
  useEffect(() => {
    if (location.state?.action === "CREATE_REVIEW") {
      setShowCreateForm(true);
      setCreateFormData({
        bookingId: location.state.bookingId,
        tourId: location.state.tourId,
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const { data: reviews, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.MY_REVIEWS,
    queryFn: getMyReviews,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success("Xóa đánh giá thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_REVIEWS });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleDelete = (reviewId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      deleteMutation.mutate(reviewId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col items-center justify-center text-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Đã có lỗi xảy ra</h2>
            <p className="text-gray-500 mb-6">Không thể tải danh sách đánh giá của bạn lúc này.</p>
            <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium w-full"
            >
            Quay lại
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors font-medium"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all border border-gray-100">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Quay lại</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Đánh giá của bạn</h1>
                <p className="mt-2 text-gray-500 text-lg">
                    Quản lý và xem lại {reviews?.length || 0} đánh giá bạn đã viết.
                </p>
              </div>
              
              {/* Stats Card nhỏ */}
              <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div>
                      <div className="text-sm text-gray-500 font-medium">Tổng đánh giá</div>
                      <div className="text-xl font-bold text-gray-900">{reviews?.length || 0}</div>
                  </div>
              </div>
          </div>
        </div>

        {/* Form tạo đánh giá mới (Hiện khi redirect từ trang khác) */}
        {showCreateForm && createFormData?.bookingId && createFormData?.tourId && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 mb-8 animate-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                Viết đánh giá mới
            </h2>
            <ReviewForm
              bookingId={createFormData.bookingId}
              tourId={createFormData.tourId}
              onSuccess={() => {
                setShowCreateForm(false);
                setCreateFormData(null);
                toast.success("Đánh giá đã được đăng!");
              }}
              onCancel={() => {
                setShowCreateForm(false);
                setCreateFormData(null);
              }}
            />
          </div>
        )}

        {/* Empty State */}
        {!reviews || reviews.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-indigo-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Chưa có đánh giá nào</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Những đánh giá của bạn sẽ giúp cộng đồng có lựa chọn tốt hơn. Hãy đặt tour và chia sẻ trải nghiệm nhé!
            </p>
            <button
              onClick={() => navigate("/bookings")}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
            >
              Xem lịch sử đặt tour
            </button>
          </div>
        ) : (
          /* Review List Grid */
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => {
              const isEditing = editingReviewId === review.reviewId;

              return (
                <div
                  key={review.reviewId}
                  className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${
                    isEditing ? "ring-2 ring-indigo-500 shadow-lg scale-[1.01]" : "hover:shadow-md hover:border-indigo-100"
                  }`}
                >
                  {isEditing ? (
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-gray-800">Chỉnh sửa đánh giá</h3>
                            <button onClick={() => setEditingReviewId(null)} className="text-gray-400 hover:text-gray-600">
                                <span className="text-sm">Đóng</span>
                            </button>
                        </div>
                        <ReviewForm
                        bookingId={review.bookingId || ""} // Fallback nếu thiếu
                        tourId={review.tourId}
                        existingReview={review}
                        onSuccess={() => {
                            setEditingReviewId(null);
                            toast.success("Cập nhật thành công!");
                        }}
                        onCancel={() => setEditingReviewId(null)}
                        />
                    </div>
                  ) : (
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                      
                      {/* Cột trái: Thông tin Tour */}
                      <div className="md:w-1/3 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6">
                         <div>
                            <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-1 block">Tour trải nghiệm</span>
                            <h3 
                                className="text-lg font-bold text-gray-900 leading-snug cursor-pointer hover:text-indigo-600 transition-colors line-clamp-2"
                                onClick={() => navigate(`/tours/${review.tourId}`)}
                            >
                                {review.tourTitle}
                            </h3>
                         </div>
                         
                         <div className="flex flex-col gap-2 text-sm text-gray-500 mt-auto">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>Đã đánh giá: {new Date(review.timestamp || review.createdAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                            {/* Bạn có thể thêm bookingId hoặc ngày đi tour nếu API trả về */}
                         </div>
                      </div>

                      {/* Cột phải: Nội dung đánh giá */}
                      <div className="md:w-2/3 flex flex-col">
                         <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                    star <= review.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-200"
                                    }`}
                                />
                                ))}
                                <span className="ml-2 text-sm font-bold text-yellow-700">{review.rating}.0</span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingReviewId(review.reviewId)}
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                    title="Chỉnh sửa"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(review.reviewId)}
                                    disabled={deleteMutation.isPending}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Xóa"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                         </div>

                         <div className="relative">
                            <MessageSquare className="absolute top-0 left-0 w-8 h-8 text-gray-100 -z-10 transform -translate-x-2 -translate-y-2" />
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                                {review.comment}
                            </p>
                         </div>
                      </div>

                    </div>
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