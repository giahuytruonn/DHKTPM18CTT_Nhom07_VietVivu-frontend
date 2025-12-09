import React from 'react';
import { MapPin } from 'lucide-react';

interface PopularTourItemProps {
  tour: any;
  index: number;
}

const PopularTourItem = React.memo(({ tour, index }: PopularTourItemProps) => {
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">
          {tour.title}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{tour.destination}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-indigo-600">
          {tour.totalBookings}
        </p>
        <p className="text-xs text-gray-500">bookings</p>
      </div>
    </div>
  );
});

PopularTourItem.displayName = 'PopularTourItem';

export default PopularTourItem;