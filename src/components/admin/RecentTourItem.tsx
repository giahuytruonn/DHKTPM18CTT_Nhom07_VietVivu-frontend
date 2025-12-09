import React from 'react';
import { MapPin } from 'lucide-react';

interface RecentTourItemProps {
  tour: any;
}

const RecentTourItem = React.memo(({ tour }: RecentTourItemProps) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "OPEN_BOOKING":
        return "bg-green-100 text-green-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "OPEN_BOOKING":
        return "Mở";
      case "IN_PROGRESS":
        return "Đang chạy";
      default:
        return "Hoàn thành";
    }
  };

  return (
    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
      <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(tour.tourStatus)}`}>
        {getStatusLabel(tour.tourStatus)}
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
        <p className="text-sm font-semibold text-gray-900">
          {tour.priceAdult.toLocaleString()}₫
        </p>
      </div>
    </div>
  );
});

RecentTourItem.displayName = 'RecentTourItem';

export default RecentTourItem;