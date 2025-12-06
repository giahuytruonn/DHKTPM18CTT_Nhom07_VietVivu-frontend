import { Search, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchTours } from "../../services/tour.service";
import type { TourResponse } from "../../types/tour";
import { useDebounce } from "../../hooks/useDebounce";

interface Props {
  className?: string;
}

export default function SearchBar({ className }: Props) {
  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // Dùng debounce cho keyword
  const debouncedKeyword = useDebounce(keyword, 300);

  // === CẬP NHẬT: Gọi API với phân trang, lấy 5 kết quả đầu tiên ===
  const { data: searchResponse, isFetching } = useQuery({
    queryKey: ["search", debouncedKeyword],
    queryFn: () => searchTours(
      { 
        keyword: debouncedKeyword, 
        destination: debouncedKeyword 
      },
      0,  // page = 0 (trang đầu tiên)
      5   // size = 5 (chỉ lấy 5 kết quả)
    ),
    enabled: debouncedKeyword.length > 2,
    staleTime: 60_000,
  });

  // === Lấy mảng tours từ response (vì searchTours giờ trả về PaginatedToursResponse) ===
  const displayedResults = searchResponse?.items || [];

  // Xử lý khi nhấn nút tìm kiếm (hoặc Enter)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFocused(false);
    if (keyword.trim()) {
      navigate(`/tours?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  // Xử lý khi chọn 1 gợi ý
  const handleSuggestionClick = () => {
    setIsFocused(false);
    setKeyword("");
  };

  return (
    <div className={`relative ${className}`}>
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white rounded-full shadow-lg p-2 flex items-center"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)} 
      >
        <div className="flex-1 flex items-center px-4">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            placeholder="Tìm tour, địa điểm, hoạt động..."
            className="w-full text-lg outline-none text-gray-700"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 font-medium transition-colors"
        >
          Tìm kiếm
        </button>
      </form>

      {/* Dropdown kết quả tìm kiếm */}
      {isFocused && keyword && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-lg max-h-96 overflow-y-auto z-10 animate-in fade-in duration-200">
          {isFetching ? (
            <div className="p-4 flex items-center justify-center text-gray-500">
              <Loader2 className="animate-spin mr-2" />
              Đang tìm...
            </div>
          ) : displayedResults.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {displayedResults.map((t: TourResponse) => (
                <li key={t.tourId}>
                  <Link
                    to={`/tours/${t.tourId}`}
                    onClick={handleSuggestionClick}
                    className="flex items-center p-4 hover:bg-indigo-50 transition-colors"
                  >
                    {/* Ảnh tour */}
                    <img
                      src={t.imageUrls?.[0] || "https://picsum.photos/seed/tour/100/100"}
                      alt={t.title}
                      className="w-20 h-16 object-cover rounded-lg mr-4"
                    />
                    {/* Thông tin tour */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-gray-900 line-clamp-1">{t.title}</h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin size={14} className="mr-1.5" />
                        <span className="line-clamp-1">{t.destination}</span>
                      </div>
                    </div>
                    {/* Giá */}
                    <span className="text-lg font-bold text-indigo-600">
                      {t.priceAdult.toLocaleString("vi-VN")}₫
                    </span>
                  </Link>
                </li>
              ))}
              {/* Nút xem tất cả */}
              <li className="p-4 bg-gray-50 rounded-b-2xl">
                 <button
                   type="button"
                   onClick={handleSearchSubmit}
                   className="w-full text-center text-indigo-600 font-semibold hover:text-indigo-800"
                 >
                   Xem tất cả kết quả cho "{keyword}"
                 </button>
              </li>
            </ul>
          ) : (
            <p className="p-6 text-gray-500 text-center">Không tìm thấy tour nào</p>
          )}
        </div>
      )}
    </div>
  );
}