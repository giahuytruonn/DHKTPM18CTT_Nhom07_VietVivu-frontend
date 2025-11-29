import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  description?: string;
  link: string;
  imageUrl?: string;          // fallback
  imageUrls?: string[];       // toàn bộ ảnh
  onClick?: () => void;
}

const TourCard: React.FC<Props> = ({ title, description, link, imageUrl, imageUrls, onClick }) => {
  const navigate = useNavigate();
  const imagesToShow = imageUrls && imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [];

  return (
    <div
      className="border rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
      onClick={onClick || (() => navigate(link))}
    >
      {imagesToShow.length > 0 && (
        <div className="grid grid-cols-2 gap-1">
          {imagesToShow.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`${title} - ảnh ${i + 1}`}
              className="w-full h-24 object-cover"
            />
          ))}
        </div>
      )}
      <div className="p-3">
        <h3 className="font-bold text-indigo-900">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm whitespace-pre-line">{description}</p>
        )}
      </div>
    </div>
  );
};

export default TourCard;
