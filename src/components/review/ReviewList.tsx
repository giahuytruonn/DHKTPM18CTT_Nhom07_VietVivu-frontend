import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, User, Calendar } from "lucide-react";
import { getReviewsByTour } from "../../services/review.services";
import type { ReviewResponse } from "../../types/review";

interface ReviewListProps {
  tourId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ tourId }) => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", "tour", tourId],
    queryFn: () => getReviewsByTour(tourId),
    enabled: !!tourId,
  });

  const stats = useMemo(() => {
    if (!reviews || reviews.length === 0) return { average: 0, total: 0 };
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      average: (sum / total).toFixed(1),
      total,
    };
  }, [reviews]);

  if (isLoading) return <div className="py-4 text-center text-gray-500">Đang tải đánh giá...</div>;

  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500">Chưa có đánh giá nào cho tour này.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header thống kê */}
      <div className="flex items-center gap-4 mb-8 p-6 bg-indigo-50 rounded-xl">
        <div className="text-center">
          <div className="text-4xl font-bold text-indigo-600 mb-1">{stats.average}</div>
          <div className="flex gap-1 justify-center mb-1">
             {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-4 h-4 ${star <= Number(stats.average) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
             ))}
          </div>
          <div className="text-sm text-gray-500">{stats.total} đánh giá</div>
        </div>
      </div>

      {/* Danh sách Review */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.reviewId} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <div className="flex items-start gap-4">
              
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {review.userAvatar ? (
                  <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-gray-500" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  
                  {/* --- HIỂN THỊ TÊN USER --- */}
                  <h4 className="font-semibold text-gray-900">
                    {review.userName || "Khách hàng"}
                  </h4>
                  {/* ------------------------- */}

                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {/* Dùng timestamp thay vì createdAt */}
                    {review.timestamp ? new Date(review.timestamp).toLocaleDateString("vi-VN") : ""}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-200"}`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;