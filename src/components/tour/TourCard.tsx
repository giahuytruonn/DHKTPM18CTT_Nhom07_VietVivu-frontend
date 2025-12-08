import React, { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Heart, MapPin, Star, Calendar, Users } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../services/favorite.service";
import toast from "react-hot-toast";
import type { TourResponse } from "../../types/tour";
import { formatDateYMD } from "../../utils/date";

interface Props {
  tour: TourResponse;
}

const TourCard: React.FC<Props> = ({ tour }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authenticated } = useAuthStore();

  const rating =
    tour.favoriteCount > 50 ? 4.9 : tour.favoriteCount > 20 ? 4.7 : 4.5;
  const reviews = tour.totalBookings || 0;

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (tour.isFavorited) {
        await removeFromFavorites(tour.tourId);
      } else {
        await addToFavorites(tour.tourId);
      }
    },
    onSuccess: () => {
      // CẬP NHẬT: Đã thêm invalidate 'favoriteTours'
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      queryClient.invalidateQueries({ queryKey: ["tour", tour.tourId] });
      queryClient.invalidateQueries({ queryKey: ["favoriteTours"] }); // THÊM DÒNG NÀY
      toast.success(
        tour.isFavorited ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích"
      );
    },
    onError: (error: unknown) => {
      const status = (error as { response?: { status?: number } }).response
        ?.status;
      if (status === 401) {
        toast.error("Vui lòng đăng nhập");
        navigate("/login");
        return;
      }
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        (error as Error | undefined)?.message ||
        "Có lỗi xảy ra";
      toast.error(`Lỗi: ${message}`);
    },
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authenticated) {
      toast.error("Vui lòng đăng nhập");
      navigate("/login");
      return;
    }
    toggleFavoriteMutation.mutate();
  };

  const formattedStartDateRaw = formatDateYMD(tour.startDate, {
    includeTime: false,
  });
  const formattedStartDate =
    formattedStartDateRaw === "Không xác định"
      ? "Liên hệ"
      : formattedStartDateRaw;

  return (
    <Link
      to={`/tours/${tour.tourId}`}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col md:flex-row border border-gray-100 hover:border-indigo-200"
    >
      <div className="relative md:w-1/3">
        <img
          src={tour.imageUrls?.[0] || "https://picsum.photos/seed/tour/400/300"}
          alt={tour.title}
          className="w-full h-56 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {authenticated && (
          <button
            onClick={handleFavoriteClick}
            disabled={toggleFavoriteMutation.isPending}
            className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-2.5 rounded-full hover:bg-white transition-all shadow-md hover:shadow-lg disabled:opacity-60 z-10"
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                tour.isFavorited
                  ? "text-red-500 fill-red-500"
                  : "text-indigo-600"
              }`}
            />
          </button>
        )}
        {tour.quantity > 0 && (
          <div className="absolute bottom-4 left-4 bg-white/90 text-indigo-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            Còn {tour.quantity} chỗ
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col grow md:w-2/3">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1.5 text-indigo-600" />
          <span className="truncate">{tour.destination}</span>
        </div>

        <h3 className="text-xl font-bold text-indigo-900 mb-3 group-hover:text-indigo-700 transition-colors line-clamp-2">
          {tour.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {tour.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1.5 text-sm font-medium text-gray-800">
              {rating.toFixed(1)}
            </span>
            <span className="ml-1.5 text-sm text-gray-500">({reviews})</span>
          </div>
          <div className="flex items-center">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span className="ml-1.5 text-sm font-medium text-gray-800">
              {tour.favoriteCount}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1.5 text-indigo-600" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-1.5 text-indigo-600" />
            <span>Tối đa {tour.initialQuantity} khách</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="w-4 h-4 mr-1.5 text-indigo-600" />
          <span>Bắt đầu: {formattedStartDate}</span>
        </div>

        <div className="border-t border-gray-100 pt-4 mt-auto">
          <div className="flex justify-between items-center gap-4">
            <div>
              <span className="text-xs text-gray-500 block mb-1">Giá từ</span>
              <span className="text-2xl font-bold text-indigo-600">
                {Number(tour.priceAdult).toLocaleString("vi-VN")}₫
              </span>
            </div>
            <span className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md">
              Xem chi tiết
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default memo(TourCard);
