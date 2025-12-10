import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  link: string;
  imageUrl?: string;
  imageUrls?: string[];
  // Thêm các props giả lập metadata (nếu API chưa trả về thì dùng random/default)
  rating?: number;
  price?: string;
  onClick?: () => void;
}

const TourCard: React.FC<Props> = ({
  title,
  description,
  link,
  imageUrl,
  imageUrls,
  rating = 4.8, // Default rating nếu chưa có
  price,
  onClick,
}) => {
  const navigate = useNavigate();
  // Lấy ảnh đầu tiên làm ảnh đại diện
  const mainImage = imageUrls?.[0] || imageUrl || "/api/placeholder/400/300";

  return (
    <div
      onClick={onClick || (() => navigate(link))}
      className="
        group relative w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100
        cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1
        flex flex-col mb-3 max-w-[320px] mx-auto
      "
    >
      {/* --- PHẦN ẢNH (Tỉ lệ 16:9 gọn gàng) --- */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badge Rating (Góc phải trên) */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-gray-800">{rating}</span>
        </div>
      </div>

      {/* --- PHẦN NỘI DUNG --- */}
      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Mô tả ngắn gọn */}
        {description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Footer: Giá & Nút Xem */}
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Xem chi tiết
            </span>
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ArrowRight size={14} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;