import React, { useState, useEffect } from "react";
// SỬA ĐƯỜNG DẪN: Dùng ../../ để đi ra khỏi 'components/tour'
import type { TourSearchParams } from "../../services/tour.service";
import {
    RotateCcw,
    Search,
    Filter,
    MapPin,
    Calendar,
    Clock,
    Users,
    Tag
} from "lucide-react";

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
    // State nội bộ của component này
    const [localFilters, setLocalFilters] = useState<TourSearchParams>(filters);
    const [priceRange, setPriceRange] = useState({
        min: filters.minPrice || 0,
        max: filters.maxPrice || 50000000,
    });

    // EFFECT ĐỒNG BỘ PROP:
    // Khi prop 'filters' (từ AllToursPage) thay đổi, cập nhật state nội bộ
    useEffect(() => {
        // Gán 'filters' (chứa 'destination' từ URL) vào 'localFilters'
        setLocalFilters(filters);
        
        // Cập nhật thanh giá tiền
        setPriceRange({
            min: filters.minPrice || 0,
            max: filters.maxPrice || 50000000,
        });
    }, [filters]); // Chạy lại khi 'filters' thay đổi

    const MAX_PRICE = 50000000;

    // Khi người dùng gõ vào ô input
    const handleLocalChange = <K extends keyof TourSearchParams>(
        key: K,
        value: TourSearchParams[K]
    ) => {
        // Cập nhật state nội bộ
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const handlePriceSliderChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
        const value = Number(e.target.value);
        setPriceRange(prev => {
            const newRange = { ...prev, [type]: value };
            if (type === 'min' && value > prev.max) newRange.max = value;
            if (type === 'max' && value < prev.min) newRange.min = value;
            return newRange;
        });
        handleLocalChange(type === 'min' ? 'minPrice' : 'maxPrice', value);
    };

    // Khi nhấn nút "Áp dụng"
    const handleApply = () => {
        // Gửi state nội bộ (localFilters) lên cho cha (AllToursPage)
        Object.entries(localFilters).forEach(([key, value]) => {
            onFilterChange(key as keyof TourSearchParams, value);
        });
        // Báo cho cha biết để gọi API
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
        onReset(); // Gọi hàm onReset của cha
    };

    const activeFiltersCount = Object.values(localFilters).filter(
        v => v !== null && v !== undefined && v !== ''
    ).length;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-24 w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-lg">
                    <Filter className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Bộ lọc tìm kiếm</h3>
                    <p className="text-xs text-indigo-100">Tìm tour phù hợp với bạn</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5 max-h-[calc(100vh-250px)] overflow-y-auto">
                {/* Từ khóa */}
                <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Search className="w-4 h-4 text-indigo-600" /> Từ khóa
                    </label>
                    <input
                        type="text"
                        placeholder="Tên tour, mô tả..."
                        value={localFilters.keyword || ""}
                        onChange={(e) => handleLocalChange("keyword", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                </div>

                {/* Điểm đến */}
                <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MapPin className="w-4 h-4 text-indigo-600" /> Điểm đến
                    </label>
                    <input
                        type="text"
                        placeholder="Hà Nội, Đà Nẵng..."
                        // HIỂN THỊ: Giá trị của ô input được đọc từ state nội bộ
                        value={localFilters.destination || ""}
                        onChange={(e) => handleLocalChange("destination", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        💰 Khoảng giá
                    </label>

                    <div className="flex justify-between text-xs text-gray-600">
                        <span>{priceRange.min.toLocaleString('vi-VN')}₫</span>
                        <span>{priceRange.max.toLocaleString('vi-VN')}₫</span>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max={MAX_PRICE}
                        step="500000"
                        value={priceRange.min}
                        onChange={(e) => handlePriceSliderChange(e, "min")}
                        className="w-full accent-indigo-600"
                    />
                    <input
                        type="range"
                        min="0"
                        max={MAX_PRICE}
                        step="500000"
                        value={priceRange.max}
                        onChange={(e) => handlePriceSliderChange(e, "max")}
                        className="w-full accent-indigo-600"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="number"
                            value={priceRange.min}
                            onChange={(e) => {
                                const v = Number(e.target.value);
                                if (v >= 0 && v <= MAX_PRICE) {
                                    setPriceRange(prev => ({ ...prev, min: v }));
                                    handleLocalChange("minPrice", v);
                                }
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                            type="number"
                            value={priceRange.max}
                            onChange={(e) => {
                                const v = Number(e.target.value);
                                if (v >= 0 && v <= MAX_PRICE) {
                                    setPriceRange(prev => ({ ...prev, max: v }));
                                    handleLocalChange("maxPrice", v);
                                }
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                    </div>
                </div>

                {/* Ngày */}
                <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Calendar className="w-4 h-4 text-indigo-600" /> Ngày khởi hành
                    </label>
                    <input
                        type="date"
                        value={localFilters.startDate || ""}
                        onChange={(e) => handleLocalChange("startDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                </div>

                {/* Số ngày */}
                <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Clock className="w-4 h-4 text-indigo-600" /> Số ngày
                    </label>
                    <input
                        type="number"
                        min="1"
                        placeholder="VD: 3"
                        value={localFilters.durationDays || ""}
                        onChange={(e) =>
                            handleLocalChange("durationDays", e.target.value ? Number(e.target.value) : null)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                </div>

                {/* Số chỗ */}
                <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Users className="w-4 h-4 text-indigo-600" /> Chỗ còn lại tối thiểu
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={localFilters.minQuantity || ""}
                        onChange={(e) =>
                            handleLocalChange("minQuantity", e.target.value ? Number(e.target.value) : null)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                </div>

                {/* Trạng thái - Admin */}
                {isAdmin && (
                    <div className="space-y-1">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Tag className="w-4 h-4 text-indigo-600" /> Trạng thái tour
                        </label>
                        <select
                            value={localFilters.tourStatus || ""}
                            onChange={(e) => handleLocalChange("tourStatus", e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                        >
                            <option value="">Tất cả</option>
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
                    onClick={handleApply}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-lg shadow"
                >
                    <Search className="w-4 h-4" /> Áp dụng ({activeFiltersCount})
                </button>

                <button
                    onClick={handleResetLocal}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 py-2.5 rounded-lg"
                >
                    <RotateCcw className="w-4 h-4" /> Xóa tất cả
                </button>
            </div>
        </div>
    );
};

export default TourFilters;