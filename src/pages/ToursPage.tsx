import React, { useState, useEffect } from "react";
import { Search, MapPin, Clock, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Import useQuery và useQueryClient
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import { getAllTours, getAvailableTours, searchTours } from "../services/tour.services";
import { getFavoriteTours } from "../services/favorite.services"; // Import service lấy danh sách yêu thích
import { QUERY_KEYS } from "../utiils/queryKeys";
import FavoriteButton from "../components/ui/FavoriteButton";
import type { TourResponse } from "../types/tour";

const ToursPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
    const [activeSearchKeyword, setActiveSearchKeyword] = useState("");
    
    // --- Bổ sung: Lấy danh sách ID tour yêu thích ---
    const { data: favoriteData } = useQuery({
        queryKey: QUERY_KEYS.FAVORITE_TOURS,
        queryFn: getFavoriteTours,
        staleTime: 5 * 60 * 1000, // Cấu hình staleTime để tránh refetch liên tục
    });
    const favoriteTourIds = favoriteData?.favoriteTourIds || [];
    // --------------------------------------------------

    // Cập nhật queryKey dựa trên activeSearchKeyword và showOnlyAvailable
    const queryKey = (() => {
        if (activeSearchKeyword) {
            return QUERY_KEYS.TOURS_SEARCH(activeSearchKeyword);
        }
        if (showOnlyAvailable) {
            return QUERY_KEYS.TOURS_AVAILABLE;
        }
        return QUERY_KEYS.TOURS;
    })();

    const {
        data: tours = [],
        isLoading,
        isError,
        refetch,
    } = useQuery<TourResponse[]>({
        queryKey: queryKey,
        queryFn: async () => {
            let result;
            if (activeSearchKeyword) {
                result = await searchTours(activeSearchKeyword);
            } else if (showOnlyAvailable) {
                result = await getAvailableTours();
            } else {
                result = await getAllTours();
            }
            return result || [];
        },
        enabled: true,
    });
    
    // Tự động kích hoạt lại query khi showOnlyAvailable thay đổi (nếu không có từ khóa tìm kiếm)
    useEffect(() => {
        if (!activeSearchKeyword) {
            refetch();
        }
    }, [showOnlyAvailable, activeSearchKeyword, refetch]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveSearchKeyword(searchKeyword.trim()); 
        setShowOnlyAvailable(false);
    };

    const handleClearSearch = () => {
        setSearchKeyword("");
        setActiveSearchKeyword(""); 
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ... (Phần UI tìm kiếm và lọc giữ nguyên) ... */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
                    >
                        ← Quay lại
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Danh sách Tour
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    placeholder="Tìm kiếm tour theo tên hoặc điểm đến..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Tìm kiếm
                            </button>
                            {activeSearchKeyword && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Xóa
                                </button>
                            )}
                        </form>
                        {!activeSearchKeyword && (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showOnlyAvailable}
                                    onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Chỉ hiển thị tour còn chỗ</span>
                            </label>
                        )}
                    </div>

                    {(activeSearchKeyword || showOnlyAvailable) && (
                        <div className="mb-4 text-sm text-gray-600">
                            {activeSearchKeyword ? (
                                <>
                                    Tìm thấy {tours?.length || 0} tour cho từ khóa:{" "}
                                    <span className="font-semibold">"{activeSearchKeyword}"</span>
                                </>
                            ) : showOnlyAvailable ? (
                                <>
                                    Hiển thị {tours?.length || 0} tour **còn chỗ**
                                </>
                            ) : null}
                        </div>
                    )}
                </div>
                
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {isError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <p className="text-red-600 mb-4">Có lỗi xảy ra khi tải danh sách tour</p>
                        <button
                            onClick={() => refetch()}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {!isLoading && !isError && (
                    <div>
                        {!tours || tours.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <p className="text-gray-500 text-lg mb-4">
                                    {activeSearchKeyword
                                        ? "Không tìm thấy tour nào phù hợp"
                                        : "Chưa có tour nào"}
                                </p>
                                {activeSearchKeyword && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Xem tất cả tour
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tours
                                    .filter((tour) => !!tour.tourId)
                                    .map((tour) => (
                                        <div
                                            key={tour.tourId}
                                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 border border-gray-200"
                                        >
                                            {/* ... (Phần hiển thị ảnh tour giữ nguyên) ... */}
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

                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                                    {tour.title}
                                                </h3>
                                                {/* --- Thay đổi: Truyền isFavorite và không dùng isRemovalMode --- */}
                                                <FavoriteButton 
                                                    tourId={tour.tourId} 
                                                    isFavorite={favoriteTourIds.includes(tour.tourId)}
                                                />
                                                {/* ------------------------------------------------------------- */}
                                            </div>

                                            {/* ... (Các thông tin khác của tour giữ nguyên) ... */}
                                            {tour.description && (
                                                 <p className="text-gray-600 text-sm mb-3 line-clamp-2">
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
                                                 <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                     <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                     <span>{tour.duration}</span>
                                                 </div>
                                             )}

                                             <div className="mb-3">
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

                                             <div className="flex items-center justify-between mb-4">
                                                 {!tour.availability ? (
                                                     <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                                                         Không còn chỗ
                                                     </span>
                                                 ) : (
                                                     <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                                         Còn chỗ
                                                     </span>
                                                 )}
                                             </div>

                                             <button
                                                 onClick={() => {
                                                     navigate(`/tours/${tour.tourId}`);
                                                 }}
                                                 disabled={!tour.availability}
                                                 className={`w-full px-4 py-2 rounded-lg transition text-sm ${
                                                     tour.availability
                                                         ? "bg-blue-500 text-white hover:bg-blue-600"
                                                         : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                 }`}
                                             >
                                                 {tour.availability ? "Xem chi tiết" : "Hết chỗ"}
                                             </button>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ToursPage;