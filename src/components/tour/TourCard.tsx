// src/components/tours/TourCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import type { TourResponse } from "../../types/tour";
import { Clock, Heart, MapPin, Star } from "lucide-react";

interface Props {
  tour: TourResponse;
}

const TourCard: React.FC<Props> = ({ tour }) => {
  
  const rating =
    (tour as any).rating || (tour.favoriteCount > 10 ? 4.5 : 4.0);
  const reviews = (tour as any).reviews || tour.favoriteCount;

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
        <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-md z-10">
          <Heart
            className={`w-5 h-5 ${
              tour.isFavorited ? "text-red-500 fill-red-500" : "text-indigo-600"
            }`}
          />
        </button>
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