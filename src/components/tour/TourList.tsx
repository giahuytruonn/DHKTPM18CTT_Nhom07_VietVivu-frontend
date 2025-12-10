import React from "react";
import type { TourResponse } from "../../types/tour";
import TourCard from "./TourCard";

interface Props {
  tours: TourResponse[];
  isLoading: boolean;
  isFetching?: boolean; 
}

const SkeletonItem = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
    <div className="bg-gray-200 h-56 rounded-xl mb-4"></div>
    <div className="h-6 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  </div>
);

const TourList: React.FC<Props> = ({ tours, isLoading, isFetching = false }) => {
  // SKELETON: lần đầu tải
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8">
        {[...Array(6)].map((_, i) => (
          <SkeletonItem key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  // Khi đang fetch trang mới → hiện skeleton nhẹ (không flash trắng)
  if (isFetching && tours.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-8">
        {[...Array(6)].map((_, i) => (
          <SkeletonItem key={`fetching-${i}`} />
        ))}
      </div>
    );
  }

  // EMPTY
  if (tours.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 bg-white rounded-2xl shadow-lg">
        <p className="text-xl text-gray-600">Không tìm thấy tour phù hợp.</p>
      </div>
    );
  }

  // LIST
  return (
    <div className="grid grid-cols-1 gap-8">
      {tours.map((tour) => (
        <TourCard key={tour.tourId} tour={tour} />
      ))}
    </div>
  );
};

export default TourList;