import React from "react";

interface TourCardProps {
  title: string;
  description: string;
}

const TourCard: React.FC<TourCardProps> = ({ title, description }) => (
  <div className="border p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition">
    <h4 className="font-semibold text-sm text-blue-600">{title}</h4>
    <p className="text-xs text-gray-600">{description}</p>
  </div>
);

export default TourCard;
