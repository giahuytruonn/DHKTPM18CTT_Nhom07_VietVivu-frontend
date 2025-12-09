import React from 'react';

interface TourStatusBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
  textColor: string;
}

const TourStatusBar = React.memo(({ label, value, total, color, textColor }: TourStatusBarProps) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>
        <span className={`text-sm font-semibold ${textColor}`}>
          {value}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`${color} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

TourStatusBar.displayName = 'TourStatusBar';

export default TourStatusBar;