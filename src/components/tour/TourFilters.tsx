// src/components/tours/TourFilters.tsx
import React from "react";
import type { TourSearchParams } from "../../services/tour.service";
import { RotateCcw, Search } from "lucide-react";

interface Props {
    filters: TourSearchParams;
    onFilterChange: <K extends keyof TourSearchParams>(
        key: K,
        value: TourSearchParams[K]
    ) => void;
    onReset: () => void;
}

const TourFilters: React.FC<Props> = ({
    filters,
    onFilterChange,
    onReset,
}) => {

    const handleNumericChange = (
        key: keyof TourSearchParams,
        value: string
    ) => {
        const num = value === "" ? null : parseFloat(value);
        if (num === null || (!isNaN(num) && num >= 0)) {
            onFilterChange(key, num);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
            <h3 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
                <Search className="w-6 h-6 mr-2" />
                Bộ lọc tìm kiếm
            </h3>

            <form className="space-y-5">

                <div>
                    <label
                        htmlFor="keyword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Từ khóa
                    </label>
                    <input
                        type="text"
                        id="keyword"
                        placeholder="Tên tour, mô tả..."
                        value={filters.keyword || ""}
                        onChange={(e) => onFilterChange("keyword", e.target.value)}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="destination"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Điểm đến
                    </label>
                    <input
                        type="text"
                        id="destination"
                        placeholder="Nhập điểm đến..."
                        value={filters.destination || ""}
                        onChange={(e) => onFilterChange("destination", e.target.value)}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>


                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="minPrice"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Giá thấp nhất
                        </label>
                        <input
                            type="number"
                            id="minPrice"
                            placeholder="0"
                            min="0"
                            value={filters.minPrice ?? ""}
                            onChange={(e) => handleNumericChange("minPrice", e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="maxPrice"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Giá cao nhất
                        </label>
                        <input
                            type="number"
                            id="maxPrice"
                            placeholder="10.000.000"
                            min="0"
                            value={filters.maxPrice ?? ""}
                            onChange={(e) => handleNumericChange("maxPrice", e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>


                <div>
                    <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Ngày khởi hành
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={filters.startDate || ""}
                        onChange={(e) => onFilterChange("startDate", e.target.value)}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>


                <div>
                    <label
                        htmlFor="durationDays"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Số ngày (VD: 3N-2Đ thì nhập 3)
                    </label>
                    <input
                        type="number"
                        id="durationDays"
                        placeholder="3"
                        min="1"
                        value={filters.durationDays ?? ""}
                        onChange={(e) => handleNumericChange("durationDays", e.target.value)}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>


                <button
                    type="button"
                    onClick={onReset}
                    className="w-full flex items-center justify-center text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg transition-colors"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Xóa tất cả bộ lọc
                </button>
            </form>
        </div>
    );
};

export default TourFilters;