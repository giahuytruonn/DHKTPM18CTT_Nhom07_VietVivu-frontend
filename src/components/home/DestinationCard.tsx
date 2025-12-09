import React from 'react';
import { Link } from 'react-router-dom';

interface DestinationCardProps {
  dest: {
    name: string;
    image: string;
    id: string;
  };
}

const DestinationCard = React.memo(({ dest }: DestinationCardProps) => {
  return (
    <Link
      to={`/tours?destination=${encodeURIComponent(dest.name)}`}
      className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <img
        src={dest.image}
        alt={dest.name}
        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="font-bold text-lg drop-shadow-md">{dest.name}</p>
      </div>
    </Link>
  );
});

DestinationCard.displayName = 'DestinationCard';

export default DestinationCard;