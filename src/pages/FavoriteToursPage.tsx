import React from "react";
import { Heart, ArrowLeft, MapPin, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import { getFavoriteTours } from "../services/favorite.services";
import { getTourById } from "../services/tour.services";
import { QUERY_KEYS } from "../utiils/queryKeys";
import FavoriteButton from "../components/ui/FavoriteButton";
import type { TourResponse } from "../types/tour";

const FavoriteToursPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: favoriteData,
    isLoading: isLoadingFavorites,
    isError: isErrorFavorites,
  } = useQuery({
    queryKey: QUERY_KEYS.FAVORITE_TOURS,
    queryFn: getFavoriteTours,
  });

  const favoriteTourIds = favoriteData?.favoriteTourIds || [];

  const tourQueries = useQueries({
    queries: favoriteTourIds.map((tourId) => ({
      queryKey: QUERY_KEYS.TOUR(tourId),
      queryFn: () => getTourById(tourId),
      enabled: !!tourId && favoriteTourIds.length > 0,
    })),
  });

  const isLoadingTours = tourQueries.some((query) => query.isLoading);
  const isLoading = isLoadingFavorites || isLoadingTours;
  const isError = isErrorFavorites || tourQueries.some((query) => query.isError);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Đang tải danh sách tour yêu thích...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            Có lỗi xảy ra khi tải danh sách tour yêu thích
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-3xl font-bold text-gray-900">
              Tour yêu thích của tôi
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Bạn có {favoriteTourIds.length} tour trong danh sách yêu thích
          </p>
        </div>

        {favoriteTourIds.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có tour yêu thích
            </h2>
            <p className="text-gray-500 mb-6">
              Hãy khám phá và thêm các tour bạn yêu thích vào danh sách này
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Khám phá tour
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTourIds.map((tourId, index) => {
              const tourQuery = tourQueries[index];
              const tour: TourResponse | undefined = tourQuery?.data;
              const isLoadingTour = tourQuery?.isLoading;
              const isErrorTour = tourQuery?.isError;

              return (
                <div
                  key={tourId}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 border border-gray-200"
                >
                  {isLoadingTour ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : isErrorTour || !tour ? (
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Tour {tourId.substring(0, 8)}...
                        </h3>
                        <FavoriteButton tourId={tourId} isRemovalMode={true} />
                      </div>
                      <p className="text-red-500 text-sm mb-4">
                        Không thể tải thông tin tour
                      </p>
                    </div>
                  ) : (
                    <>
                      {tour.imageUrls && tour.imageUrls.length > 0 && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img
                            src={tour.imageUrls[0]}
                            alt={tour.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {tour.title}
                          </h3>
                        </div>
                        <FavoriteButton tourId={tourId} isRemovalMode={true} />
                      </div>

                      {tour.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {tour.description}
                        </p>
                      )}

                      {tour.reviewCount > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-semibold text-gray-900">
                              {tour.averageRating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({tour.reviewCount} đánh giá)
                          </span>
                        </div>
                      )}

                      {tour.destination && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="truncate">{tour.destination}</span>
                        </div>
                      )}

                      {tour.duration && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{tour.duration}</span>
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-1">Giá:</div>
                        <div className="flex flex-wrap items-center gap-2">
                          {tour.priceAdult && (
                            <span className="font-semibold text-blue-600">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(tour.priceAdult)}
                            </span>
                          )}
                          {tour.priceAdult && tour.priceChild && (
                            <span className="text-gray-400">/</span>
                          )}
                          {tour.priceChild && (
                            <span className="text-sm text-gray-500">
                              Trẻ em:{" "}
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(tour.priceChild)}
                            </span>
                          )}
                        </div>
                      </div>

                      {!tour.availability && (
                        <div className="mb-4">
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                            Không còn chỗ
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          console.log("View tour:", tourId);
                        }}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                      >
                        Xem chi tiết
                      </button>
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

export default FavoriteToursPage;