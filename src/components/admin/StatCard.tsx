import React from 'react';
import { ArrowUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  change: string;
  isIncrease: boolean;
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
}

const StatCard = React.memo<StatCardProps>(({ 
  title, 
  value, 
  change, 
  isIncrease, 
  icon: Icon, 
  bgColor, 
  textColor 
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${bgColor} rounded-xl`}>
          <Icon className={textColor} size={24} />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-semibold ${
            isIncrease ? "text-green-600" : "text-red-600"
          }`}
        >
          {isIncrease ? (
            <ArrowUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          <span>{change}</span>
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;