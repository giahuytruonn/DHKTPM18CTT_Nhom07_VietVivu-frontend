import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  description?: string;
  link: string;
  imageUrl?: string;
  imageUrls?: string[];
  onClick?: () => void;
}

const TourCard: React.FC<Props> = ({
  title,
  description,
  link,
  imageUrl,
  imageUrls,
  onClick,
}) => {
  const navigate = useNavigate();
  const images = imageUrls && imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [];

  return (
    <div
      onClick={onClick || (() => navigate(link))}
      className="
        bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer
        transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
      "
    >
      {/* PHẦN ẢNH */}
      {images.length > 0 && (
        <div className="w-full">
          {/* ẢNH LỚN */}
          <div className="relative w-full h-40">
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover"
            />

            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* ẢNH NHỎ (nếu có thêm) */}
          {images.length > 1 && (
            <div className="grid grid-cols-2 gap-1 mt-1">
              {images.slice(1, 3).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="w-full h-20 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-indigo-900 leading-tight">
          {title}
        </h3>

        {description && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default TourCard;
