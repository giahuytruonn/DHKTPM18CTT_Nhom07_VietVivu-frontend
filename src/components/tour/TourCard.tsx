// src/components/tour/TourCard.tsx - WITH DEBUG LOGS
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import type { TourResponse } from "../../types/tour";
import { Clock, Heart, MapPin, Star } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToFavorites, removeFromFavorites } from "../../services/favorite.service";
import toast from "react-hot-toast";

interface Props {
  tour: TourResponse;
}

const TourCard: React.FC<Props> = ({ tour }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authenticated, token } = useAuthStore();
  
  const rating = (tour as any).rating || (tour.favoriteCount > 10 ? 4.5 : 4.0);
  const reviews = (tour as any).reviews || tour.favoriteCount;

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      console.log("=== FAVORITE MUTATION START ===");
      console.log("Tour ID:", tour.tourId);
      console.log("Current isFavorited:", tour.isFavorited);
      console.log("Token exists:", !!token);
      console.log("Authenticated:", authenticated);
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log("Token payload:", payload);
          console.log("Token scope:", payload.scope);
        } catch (e) {
          console.error("Error parsing token:", e);
        }
      }
      
      if (tour.isFavorited) {
        console.log("Calling removeFromFavorites");
        await removeFromFavorites(tour.tourId);
      } else {
        console.log("Calling addToFavorites");
        await addToFavorites(tour.tourId);
      }
      console.log("=== FAVORITE MUTATION END ===");
    },
    onSuccess: () => {
      console.log("Favorite mutation success");
      queryClient.invalidateQueries({ queryKey: ["allTours"] });
      queryClient.invalidateQueries({ queryKey: ["tours-home"] });
      queryClient.invalidateQueries({ queryKey: ["favoriteTours"] });
      queryClient.invalidateQueries({ queryKey: ["tour", tour.tourId] });
      queryClient.invalidateQueries({ queryKey: ["adminTours"] });
      
      toast.success(
        tour.isFavorited 
          ? "Đã xóa khỏi yêu thích" 
          : "Đã thêm vào yêu thích"
      );
    },
    onError: (error: any) => {
      console.error("=== FAVORITE MUTATION ERROR ===");
      console.error("Error:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      console.error("Error message:", error.message);
      
      if (error.response?.status === 401) {
        toast.error("Vui lòng đăng nhập để thêm yêu thích");
        navigate("/login");
      } else if (error.response?.status === 403) {
        toast.error("Bạn không có quyền thực hiện thao tác này");
        console.error("403 Forbidden - Check token scope and SecurityConfig");
      } else {
        toast.error("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
      }
    }
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("=== FAVORITE CLICK ===");
    console.log("Authenticated:", authenticated);
    console.log("Token:", token ? "exists" : "missing");
    
    if (!authenticated) {
      toast.error("Vui lòng đăng nhập để thêm yêu thích");
      navigate("/login");
      return;
    }
    
    toggleFavoriteMutation.mutate();
  };

  return (
    <Link
      to={`/tours/${tour.tourId}`}
      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative">
        <img
          src={
            tour.imageUrls && tour.imageUrls.length > 0
              ? tour.imageUrls[0]
              : "https://picsum.photos/400/300"
          }
          alt={tour.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {authenticated && (
          <button
            onClick={handleFavoriteClick}
            disabled={toggleFavoriteMutation.isPending}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-md z-10 disabled:opacity-50"
            aria-label={tour.isFavorited ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                tour.isFavorited 
                  ? "text-red-500 fill-red-500" 
                  : "text-indigo-600"
              }`}
            />
          </button>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1 text-indigo-600" />
          <span>{tour.destination}</span>
        </div>

        <h3 className="text-lg font-bold text-indigo-900 mb-2 group-hover:text-indigo-700 transition line-clamp-2">
          {tour.title}
        </h3>

        <div className="flex items-center mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
          <span className="ml-1 text-sm text-gray-600">({reviews})</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Clock className="w-4 h-4 mr-1 text-indigo-600" />
          <span>{tour.duration}</span>
        </div>

        <div className="border-t pt-4 mt-auto">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-500">Giá từ</span>
              <span className="block text-2xl font-bold text-indigo-600">
                {Number(tour.priceAdult).toLocaleString("vi-VN")}₫
              </span>
            </div>
            <span className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors">
              Xem Chi Tiết
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;