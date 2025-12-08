import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { getTourById } from "../services/tour.service";
import {
  addToFavorites,
  removeFromFavorites,
} from "../services/favorite.service";
import { useAuthStore } from "../stores/useAuthStore";
import toast from "react-hot-toast";

// --- IMPORT COMPONENT REVIEW MỚI ---
import ReviewList from "../components/review/ReviewList"; 

const TourDetailPage: React.FC = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authenticated } = useAuthStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    data: tour,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tour", tourId],
    queryFn: () => getTourById(tourId!),
    staleTime: 1000 * 60 * 5,
    enabled: !!tourId,
  });

  // Tính toán rating giả lập nếu backend chưa trả về
  // (Nếu backend đã trả về averageRating thì dùng tour.averageRating)
  const rating = tour ? (tour.favoriteCount > 50 ? 4.9 : tour.favoriteCount > 20 ? 4.7 : 4.5) : 4.5;
  const reviewsCount = tour ? tour.totalBookings || 0 : 0; // Tạm dùng số booking làm số review tượng trưng

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!tourId) return;
      if (tour?.isFavorited) {
        await removeFromFavorites(tourId);
      } else {
        await addToFavorites(tourId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tour", tourId] });
      queryClient.invalidateQueries({ queryKey: ["allTours"] });
      queryClient.invalidateQueries({ queryKey: ["favoriteTours"] });
      toast.success(
        tour?.isFavorited ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích"
      );
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        toast.error("Vui lòng đăng nhập để thêm yêu thích");
        navigate("/login");
      } else {
        toast.error("Có lỗi xảy ra");
      }
    },
  });

  const handleFavoriteClick = () => {
    if (!authenticated) {
      toast.error("Vui lòng đăng nhập để thêm yêu thích");
      navigate("/login");
      return;
    }
    toggleFavoriteMutation.mutate();
  };

  const nextImage = () => {
    if (tour?.imageUrls && tour.imageUrls.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === tour.imageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (tour?.imageUrls && tour.imageUrls.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? tour.imageUrls.length - 1 : prev - 1
      );
    }
  };

  const handleBookNow = () => {
    if (tourId) {
      navigate(`/booking/${tourId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin tour...</p>
        </div>
      </div>
    );
  }

  if (isError || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy tour
          </h2>
          <Link to="/tours" className="text-indigo-600 hover:text-indigo-800">
            Quay lại danh sách tour
          </Link>
        </div>
      </div>
    );
  }

  const hasImages = tour.imageUrls && tour.imageUrls.length > 0;
  const currentImage = hasImages
    ? tour.imageUrls[currentImageIndex]
    : "https://picsum.photos/1200/600";

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Container chính */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Nút Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Quay lại</span>
        </button>

        {/* Gallery Ảnh */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-xl group">
          <img
            src={currentImage}
            alt={tour.title}
            className="w-full h-[400px] sm:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
          />

          {hasImages && tour.imageUrls.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="text-gray-800" size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="text-gray-800" size={24} />
              </button>
              
              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {tour.imageUrls.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentImageIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {authenticated && (
            <button
              onClick={handleFavoriteClick}
              disabled={toggleFavoriteMutation.isPending}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg disabled:opacity-50 z-10"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  tour.isFavorited
                    ? "text-red-500 fill-red-500"
                    : "text-indigo-600"
                }`}
              />
            </button>
          )}
        </div>

        {/* Layout Chính: 2 Cột */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột Trái: Thông tin chi tiết */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Info */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {tour.title}
                </h1>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${
                    tour.tourStatus === "OPEN_BOOKING"
                      ? "bg-green-100 text-green-700"
                      : tour.tourStatus === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {tour.tourStatus === "OPEN_BOOKING"
                    ? "Đang mở booking"
                    : tour.tourStatus === "IN_PROGRESS"
                    ? "Đang thực hiện"
                    : "Đã hoàn thành"}
                </span>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                  <span className="text-sm">({reviewsCount} đánh giá)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>{tour.favoriteCount} yêu thích</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span>{tour.totalBookings} lượt đặt</span>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Điểm đến</p>
                    <p className="font-semibold text-gray-900 line-clamp-1">
                      {tour.destination}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Thời gian</p>
                    <p className="font-semibold text-gray-900">
                      {tour.duration}
                    </p>
                  </div>
                </div>
                {tour.startDate && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <Calendar className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Khởi hành</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(tour.startDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                  <Users className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Chỗ còn nhận</p>
                    <p className="font-semibold text-gray-900">
                      {tour.quantity} / {tour.initialQuantity}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                Mô tả chi tiết
              </h2>
              <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                {tour.description}
              </div>
            </div>

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Lịch trình tour
                </h2>
                <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="flex gap-6 relative">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-md z-10">
                        {index + 1}
                      </div>
                      <div className="flex-1 bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-700">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* === PHẦN REVIEW (ĐÁNH GIÁ) === */}
            {/* ============================================================ */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Đánh giá từ khách hàng
                </h2>
                {/* Gọi Component ReviewList tại đây */}
                <ReviewList tourId={tourId!} />
            </div>

          </div>

          {/* Cột Phải: Booking Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 sticky top-24">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <p className="text-gray-500 text-sm mb-1">Giá tốt nhất từ</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-indigo-600">
                    {tour.priceAdult.toLocaleString("vi-VN")}₫
                  </span>
                  <span className="text-gray-500 text-sm">/ khách</span>
                </div>
                {tour.priceChild > 0 && (
                  <div className="mt-2 flex justify-between items-center text-sm bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-600">Trẻ em:</span>
                    <span className="font-semibold text-gray-900">{tour.priceChild.toLocaleString("vi-VN")}₫</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="p-1.5 bg-green-100 rounded-full"><Check className="w-3.5 h-3.5 text-green-600" /></div>
                  <span>Hướng dẫn viên chuyên nghiệp</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="p-1.5 bg-green-100 rounded-full"><Check className="w-3.5 h-3.5 text-green-600" /></div>
                  <span>Bảo hiểm du lịch trọn gói</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="p-1.5 bg-green-100 rounded-full"><Check className="w-3.5 h-3.5 text-green-600" /></div>
                  <span>Hỗ trợ khách hàng 24/7</span>
                </div>
              </div>

              {tour.availability && tour.tourStatus === "OPEN_BOOKING" ? (
                <button
                  onClick={handleBookNow}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95 transform"
                >
                  Đặt Tour Ngay
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-bold text-lg cursor-not-allowed"
                >
                  {tour.tourStatus === "IN_PROGRESS" ? "Đang diễn ra" : "Tạm ngưng nhận khách"}
                </button>
              )}

              <p className="text-xs text-gray-400 text-center mt-4">
                * Không phát sinh chi phí ẩn. Hủy miễn phí trong 24h.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;