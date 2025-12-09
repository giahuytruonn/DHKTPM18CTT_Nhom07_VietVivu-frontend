import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Globe, Mail, Phone, Star, ArrowRight } from 'lucide-react';

interface GuideCardProps {
    guide: any;
    index: number;
    onToggleFavorite: (e: React.MouseEvent, guideId: number) => void;
}

const GuideCard = React.memo(({ guide, index, onToggleFavorite }: GuideCardProps) => {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onToggleFavorite(e, guide.id);
    };

    return (
        <div
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group animate-fade-in-up flex flex-col"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="relative">
                <img
                    src={guide.avatar}
                    alt={guide.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                />
                <button
                    onClick={handleFavoriteClick}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-md"
                >
                    <Heart className="w-5 h-5 text-indigo-600" />
                </button>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-indigo-900 mb-1 group-hover:text-indigo-700 transition-colors">
                    {guide.name}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1 text-indigo-600" />
                    <span className="truncate">{guide.location}</span>
                </div>

                <div className="flex items-center mb-3">
                    <span className="text-lg font-bold text-indigo-900 mr-1">{guide.rating}</span>
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({guide.reviews})</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Globe className="w-4 h-4 mr-2 text-indigo-600" />
                    <span className="line-clamp-1">{guide.languages.join(", ")}</span>
                </div>

                <div className="space-y-1 mb-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-indigo-600" />
                        <span className="truncate">{guide.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-indigo-600" />
                        <span>{guide.phone}</span>
                    </div>
                </div>

                <Link
                    to={`/guides/${guide.id}`}
                    className="w-full bg-indigo-600 text-white py-2 rounded-full hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-auto"
                >
                    Xem hồ sơ
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </div>
        </div>
    );
});

GuideCard.displayName = 'GuideCard';

export default GuideCard;