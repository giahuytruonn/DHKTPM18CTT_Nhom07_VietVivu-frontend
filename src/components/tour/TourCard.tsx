import React, { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Heart, MapPin, Calendar, Users } from "lucide-react";
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

  // LOCAL STATE để UI update ngay lập tức
  const [localIsFavorited, setLocalIsFavorited] = useState(tour.isFavorited);
  const [localFavoriteCount, setLocalFavoriteCount] = useState(tour.favoriteCount);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (localIsFavorited) {
        await removeFromFavorites(tour.tourId);
      } else {
        await addToFavorites(tour.tourId);
      }
    },
    onMutate: async () => {
      // ⚡ CẬP NHẬT LOCAL STATE NGAY LẬP TỨC
      setLocalIsFavorited(!localIsFavorited);
      setLocalFavoriteCount(prev => localIsFavorited ? prev - 1 : prev + 1);

      // Cancel queries
      await queryClient.cancelQueries({ queryKey: ["allTours"] });
      await queryClient.cancelQueries({ queryKey: ["tour", tour.tourId] });
      await queryClient.cancelQueries({ queryKey: ["favoriteTours"] });

      // Lưu snapshot
      const previousAllTours = queryClient.getQueryData(["allTours"]);
      const previousTour = queryClient.getQueryData(["tour", tour.tourId]);
      const previousFavorites = queryClient.getQueryData(["favoriteTours"]);

      // Cập nhật cache cho allTours (structure PageResponse)
      queryClient.setQueryData(["allTours"], (old: any) => {
        if (!old) return old;

        // Nếu có items trực tiếp (PageResponse)
        if (old.items) {
          return {
            ...old,
            items: old.items.map((t: TourResponse) =>
              t.tourId === tour.tourId
                ? {
                  ...t,
                  isFavorited: !localIsFavorited,
                  favoriteCount: localIsFavorited
                    ? t.favoriteCount - 1
                    : t.favoriteCount + 1,
                }
                : t
            ),
          };
        }

        return old;
      });

      // Cập nhật cache cho tour detail
      queryClient.setQueryData(["tour", tour.tourId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isFavorited: !localIsFavorited,
          favoriteCount: localIsFavorited
            ? old.favoriteCount - 1
            : old.favoriteCount + 1,
        };
      });

      return { previousAllTours, previousTour, previousFavorites };
    },
    onError: (error: unknown, _, context) => {
      // ⚡ ROLLBACK LOCAL STATE
      setLocalIsFavorited(tour.isFavorited);
      setLocalFavoriteCount(tour.favoriteCount);

      // Rollback cache
      if (context?.previousAllTours) {
        queryClient.setQueryData(["allTours"], context.previousAllTours);
      }
      if (context?.previousTour) {
        queryClient.setQueryData(["tour", tour.tourId], context.previousTour);
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favoriteTours"], context.previousFavorites);
      }

      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 401) {
        toast.error("Vui lòng đăng nhập");
        navigate("/login");
        return;
      }
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        (error as Error | undefined)?.message ||
        "Có lỗi xảy ra";
      toast.error(`Lỗi: ${message}`);
    },
    onSuccess: () => {
      // Refetch để đảm bảo đồng bộ
      queryClient.invalidateQueries({ queryKey: ["allTours"] });
      queryClient.invalidateQueries({ queryKey: ["tour", tour.tourId] });
      queryClient.invalidateQueries({ queryKey: ["favoriteTours"] });

      toast.success(
        localIsFavorited ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích"
      );
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
              className={`w-5 h-5 transition-all ${localIsFavorited
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

        {/* HIỂN THỊ LOCAL STATE */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="ml-1.5 text-sm font-medium text-gray-800">
              {tour.totalBookings || 0} lượt đặt
            </span>
          </div>
          <div className="flex items-center">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span className="ml-1.5 text-sm font-medium text-gray-800">
              {localFavoriteCount} yêu thích
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