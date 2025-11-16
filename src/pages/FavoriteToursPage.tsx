import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyFavoriteTours } from "../services/favorite.service";
import TourCard from "../components/tour/TourCard";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FavoriteToursPage: React.FC = () => {
  const { data: favoriteTours = [], isLoading } = useQuery({
    queryKey: ["favoriteTours"],
    queryFn: getMyFavoriteTours,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải tour yêu thích...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại tất cả tour
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Tour Yêu Thích
              </h1>
              <p className="text-gray-600 mt-1">
                {favoriteTours.length} tour đang được yêu thích
              </p>
            </div>
          </div>
        </div>

        {/* Tour List */}
        {favoriteTours.length > 0 ? (
          // THAY ĐỔI Ở ĐÂY:
          // Đã đổi từ "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          // sang "flex flex-col gap-8" để mỗi tour là một hàng
          <div className="flex flex-col gap-8">
            {favoriteTours.map((tour) => (
              <TourCard key={tour.tourId} tour={tour} />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Chưa có tour yêu thích
            </h3>
            <p className="text-gray-600 mb-6">
              Khám phá và thêm các tour bạn yêu thích vào danh sách này
            </p>
            <Link
              to="/tours"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Khám phá tour ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteToursPage;