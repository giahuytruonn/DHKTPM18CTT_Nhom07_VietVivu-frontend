import React from 'react';
import { Clock } from 'lucide-react';

interface DestinationCardProps {
  destination: {
    name: string;
    bookings: number;
  };
  index: number;
}

const DestinationCard = React.memo(({ destination, index }: DestinationCardProps) => {
  return (
    <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold text-indigo-600">
          #{index + 1}
        </span>
        <Clock className="text-indigo-400" size={16} />
      </div>
      <p className="font-semibold text-gray-900 truncate">
        {destination.name}
      </p>
      <p className="text-sm text-gray-600">{destination.bookings} bookings</p>
    </div>
  );
});

DestinationCard.displayName = 'DestinationCard';

export default DestinationCard;