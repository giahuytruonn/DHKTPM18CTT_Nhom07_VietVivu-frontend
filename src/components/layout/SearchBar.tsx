import { Search, MapPin, Loader2 } from "lucide-react"; // Thêm Loader2
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { useQuery } from "@tanstack/react-query";
import { searchTours } from "../../services/tour.service"; // Giữ lại đường dẫn gốc
import type { TourResponse } from "../../types/tour";
import { useDebounce } from "../../hooks/useDebounce"; // Giữ lại đường dẫn gốc // Import hook debounce

interface Props {
  className?: string;
}

export default function SearchBar({ className }: Props) {
  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false); // Thêm state để theo dõi focus
  const navigate = useNavigate(); // Khởi tạo navigate

  // Dùng debounce cho keyword
  const debouncedKeyword = useDebounce(keyword, 300);

  const { data: results = [], isFetching } = useQuery({
    queryKey: ["search", debouncedKeyword],
    // Tìm kiếm ở cả tiêu đề và địa điểm
    queryFn: () => searchTours({ keyword: debouncedKeyword, destination: debouncedKeyword }),
    enabled: debouncedKeyword.length > 2, // Chỉ fetch khi keyword debounce > 2 ký tự
    staleTime: 60_000,
  });

  // Giới hạn số lượng kết quả hiển thị (ví dụ: 5)
  const displayedResults = results.slice(0, 5);

  // Xử lý khi nhấn nút tìm kiếm (hoặc Enter)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFocused(false); // Ẩn gợi ý
    // Chuyển qua trang /tours với keyword
    if (keyword.trim()) {
      navigate(`/tours?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  // Xử lý khi chọn 1 gợi ý
  const handleSuggestionClick = () => {
    setIsFocused(false); // Ẩn gợi ý
    setKeyword(""); // Xóa keyword sau khi chọn
  };

  return (
    <div className={`relative ${className}`}>
      {/* Sử dụng form để có thể submit bằng Enter 
        và thêm onFocus/onBlur để quản lý hiển thị dropdown
      */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white rounded-full shadow-lg p-2 flex items-center"
        // Khi click vào input, mở gợi ý
        onFocus={() => setIsFocused(true)}
        // Khi click ra ngoài, đợi 150ms rồi mới đóng (để kịp click vào link)
        onBlur={() => setTimeout(() => setIsFocused(false), 150)} 
      >
        <div className="flex-1 flex items-center px-4">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            placeholder="Tìm tour, địa điểm, hoạt động..."
            className="w-full text-lg outline-none text-gray-700" // Tăng cỡ chữ input
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

      {/* Hiển thị dropdown khi:
        - Đang focus
        - Có keyword
      */}
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
                    onClick={handleSuggestionClick} // Thêm onClick
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
              {/* Nút xem tất cả / tìm kiếm */}
              <li className="p-4 bg-gray-50 rounded-b-2xl">
                 <button
                   type="button"
                   onClick={handleSearchSubmit} // Dùng lại
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