// src/components/tour/TourFilters.tsx - IMPROVED VERSION
import React, { useState } from "react";
import type { TourSearchParams } from "../../services/tour.service";
import { RotateCcw, Search, Filter, MapPin, Calendar, Clock, Users, Tag } from "lucide-react";

interface Props {
    filters: TourSearchParams;
    onFilterChange: <K extends keyof TourSearchParams>(
        key: K,
        value: TourSearchParams[K]
    ) => void;
    onReset: () => void;
    onApplyFilters: () => void;
    isAdmin?: boolean;
}

const TourFilters: React.FC<Props> = ({
    filters,
    onFilterChange,
    onReset,
    onApplyFilters,
    isAdmin = false,
}) => {
    const [localFilters, setLocalFilters] = useState<TourSearchParams>(filters);
    const [priceRange, setPriceRange] = useState({
        min: filters.minPrice || 0,
        max: filters.maxPrice || 50000000,
    });

    const MAX_PRICE = 50000000;

    const handleLocalChange = <K extends keyof TourSearchParams>(
        key: K,
        value: TourSearchParams[K]
    ) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const handlePriceSliderChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
        const value = Number(e.target.value);
        setPriceRange(prev => {
            const newRange = { ...prev, [type]: value };
            // Ensure min <= max
            if (type === 'min' && value > prev.max) {
                newRange.max = value;
            }
            if (type === 'max' && value < prev.min) {
                newRange.min = value;
            }
            return newRange;
        });
        handleLocalChange(type === 'min' ? 'minPrice' : 'maxPrice', value);
    };

    const handleApply = () => {
        Object.entries(localFilters).forEach(([key, value]) => {
            onFilterChange(key as keyof TourSearchParams, value);
        });
        onApplyFilters();
    };

    const handleResetLocal = () => {
        const resetFilters: TourSearchParams = {
            keyword: null,
            destination: null,
            minPrice: null,
            maxPrice: null,
            startDate: null,
            durationDays: null,
            minQuantity: null,
            tourStatus: null,
        };
        setLocalFilters(resetFilters);
        setPriceRange({ min: 0, max: MAX_PRICE });
        onReset();
    };

    const activeFiltersCount = Object.values(localFilters).filter(
        v => v !== null && v !== undefined && v !== ''
    ).length;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
                <div className="flex items-center gap-3 text-white">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Filter className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Bộ lọc tìm kiếm</h3>
                        <p className="text-sm text-indigo-100 mt-0.5">Tìm tour phù hợp với bạn</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Từ khóa */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Search className="w-4 h-4 text-indigo-600" />
                        Từ khóa
                    </label>
                    <input
                        type="text"
                        placeholder="Tên tour, mô tả..."
                        value={localFilters.keyword || ""}
                        onChange={(e) => handleLocalChange("keyword", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Điểm đến */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        Điểm đến
                    </label>
                    <input
                        type="text"
                        placeholder="Hà Nội, Đà Nẵng, Nha Trang..."
                        value={localFilters.destination || ""}
                        onChange={(e) => handleLocalChange("destination", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Khoảng giá với Range Slider */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        💰 Khoảng giá
                    </label>
                    
                    {/* Price Display */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                            {priceRange.min.toLocaleString('vi-VN')}₫
                        </span>
                        <span className="text-gray-400">-</span>
                        <span className="text-gray-600">
                            {priceRange.max.toLocaleString('vi-VN')}₫
                        </span>
                    </div>

                    {/* Min Price Slider */}
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500">Giá tối thiểu</label>
                        <input
                            type="range"
                            min="0"
                            max={MAX_PRICE}
                            step="500000"
                            value={priceRange.min}
                            onChange={(e) => handlePriceSliderChange(e, 'min')}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>

                    {/* Max Price Slider */}
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500">Giá tối đa</label>
                        <input
                            type="range"
                            min="0"
                            max={MAX_PRICE}
                            step="500000"
                            value={priceRange.max}
                            onChange={(e) => handlePriceSliderChange(e, 'max')}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>

                    {/* Price Input Fields */}
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <input
                                type="number"
                                placeholder="Từ"
                                value={priceRange.min || ""}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0 && value <= MAX_PRICE) {
                                        setPriceRange(prev => ({ ...prev, min: value }));
                                        handleLocalChange("minPrice", value);
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                placeholder="Đến"
                                value={priceRange.max || ""}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0 && value <= MAX_PRICE) {
                                        setPriceRange(prev => ({ ...prev, max: value }));
                                        handleLocalChange("maxPrice", value);
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Ngày khởi hành */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        Ngày khởi hành
                    </label>
                    <input
                        type="date"
                        value={localFilters.startDate || ""}
                        onChange={(e) => handleLocalChange("startDate", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Số ngày */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        Số ngày
                    </label>
                    <input
                        type="number"
                        placeholder="VD: 3 (nghĩa là 3N-2Đ)"
                        min="1"
                        value={localFilters.durationDays ?? ""}
                        onChange={(e) => {
                            const value = e.target.value === "" ? null : parseInt(e.target.value);
                            handleLocalChange("durationDays", value);
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Số chỗ tối thiểu */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Users className="w-4 h-4 text-indigo-600" />
                        Số chỗ còn lại tối thiểu
                    </label>
                    <input
                        type="number"
                        placeholder="VD: 5"
                        min="1"
                        value={localFilters.minQuantity ?? ""}
                        onChange={(e) => {
                            const value = e.target.value === "" ? null : parseInt(e.target.value);
                            handleLocalChange("minQuantity", value);
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Trạng thái tour (chỉ Admin) */}
                {isAdmin && (
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Tag className="w-4 h-4 text-indigo-600" />
                            Trạng thái tour
                        </label>
                        <select
                            value={localFilters.tourStatus || ""}
                            onChange={(e) => handleLocalChange("tourStatus", e.target.value as any)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="OPEN_BOOKING">Đang mở booking</option>
                            <option value="IN_PROGRESS">Đang thực hiện</option>
                            <option value="COMPLETED">Đã hoàn thành</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 space-y-2">
                <button
                    type="button"
                    onClick={handleApply}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                    <Search className="w-4 h-4" />
                    Áp dụng lọc ({activeFiltersCount})
                </button>

                <button
                    type="button"
                    onClick={handleResetLocal}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 py-3 px-4 rounded-lg transition-all"
                >
                    <RotateCcw className="w-4 h-4" />
                    Xóa tất cả bộ lọc
                </button>
            </div>
        </div>
    );
};

export default TourFilters;