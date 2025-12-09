import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, Clock } from 'lucide-react';

interface TourCardProps {
    tour: any;
    index: number;
    onToggleFavorite: (e: React.MouseEvent, tourId: string) => void;
}

const TourCard = React.memo(({ tour, index, onToggleFavorite }: TourCardProps) => {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        onToggleFavorite(e, tour.tourId);
    };

    return (
        <Link
            to={`/tours/${tour.tourId}`}
            className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up flex flex-col"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="relative">
                <img
                    src={tour.imageUrls[0]}
                    alt={tour.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                />
                <button
                    onClick={handleFavoriteClick}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-md z-10"
                >
                    <Heart className="w-5 h-5 text-indigo-600" />
                </button>

                {tour.rating === 4.9 && (
                    <div className="absolute top-4 left-4 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                        Best Seller
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1 text-indigo-600" />
                    <span className="truncate">{tour.destination}</span>
                </div>

                <h3 className="text-lg font-bold text-indigo-900 mb-2 group-hover:text-indigo-700 transition-colors line-clamp-2">
                    {tour.title}
                </h3>

                <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-bold">{tour.rating}</span>
                        <span className="ml-1 text-sm text-gray-600">({tour.reviews})</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1 text-indigo-600" />
                        {tour.duration}
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-xs text-gray-500 block">Giá từ</span>
                            <span className="text-2xl font-bold text-indigo-600">
                                {tour.priceAdult.toLocaleString("vi-VN")}₫
                            </span>
                        </div>
                        <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                            →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
});

TourCard.displayName = 'TourCard';

export default TourCard;