// src/components/tours/TourList.tsx
import React from "react";
import type { TourResponse } from "../../types/tour";
import TourCard from "./TourCard";

interface Props {
  tours: TourResponse[];
  isLoading: boolean;
}

const TourList: React.FC<Props> = ({ tours, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-xl text-gray-600">Đang tải tour...</p>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 bg-white rounded-xl shadow-md">
        <p className="text-xl text-gray-600">Không tìm thấy tour phù hợp.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tours.map((tour) => (
        <TourCard key={tour.tourId} tour={tour} />
      ))}
    </div>
  );
};

export default TourList;