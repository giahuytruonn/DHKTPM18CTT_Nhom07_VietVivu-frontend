import React from "react";
import type { TourSearchParams } from "../../services/tour.service";
import { RotateCcw, Search, Filter, MapPin, DollarSign, Calendar, Clock, Users, Tag } from "lucide-react";

interface Props {
    filters: TourSearchParams;
    onFilterChange: <K extends keyof TourSearchParams>(
        key: K,
        value: TourSearchParams[K]
    ) => void;
    onReset: () => void;
    isAdmin?: boolean;
}

const TourFilters: React.FC<Props> = ({
    filters,
    onFilterChange,
    onReset,
    isAdmin = false,
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
                        value={filters.keyword || ""}
                        onChange={(e) => onFilterChange("keyword", e.target.value)}
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
                        value={filters.destination || ""}
                        onChange={(e) => onFilterChange("destination", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Khoảng giá */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <DollarSign className="w-4 h-4 text-indigo-600" />
                        Khoảng giá (VNĐ)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Từ</label>
                            <input
                                type="number"
                                placeholder="0"
                                min="0"
                                value={filters.minPrice ?? ""}
                                onChange={(e) => handleNumericChange("minPrice", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Đến</label>
                            <input
                                type="number"
                                placeholder="10.000.000"
                                min="0"
                                value={filters.maxPrice ?? ""}
                                onChange={(e) => handleNumericChange("maxPrice", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
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
                        value={filters.startDate || ""}
                        onChange={(e) => onFilterChange("startDate", e.target.value)}
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
                        value={filters.durationDays ?? ""}
                        onChange={(e) => handleNumericChange("durationDays", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">Nhập số ngày (VD: 3 cho tour 3N-2Đ)</p>
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
                        value={filters.minQuantity ?? ""}
                        onChange={(e) => handleNumericChange("minQuantity", e.target.value)}
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
                            value={filters.tourStatus || ""}
                            onChange={(e) => onFilterChange("tourStatus", e.target.value as any)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="OPEN_BOOKING">Đang mở booking</option>
                            <option value="IN_PROGRESS">Đang thực hiện</option>
                            <option value="COMPLETED">Đã hoàn thành</option>
                        </select>
                    </div>
                )}

                {/* Reset Button */}
                <button
                    type="button"
                    onClick={onReset}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 py-3 px-4 rounded-lg transition-all border border-gray-200 shadow-sm hover:shadow group"
                >
                    <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Xóa tất cả bộ lọc
                </button>
            </div>

            {/* Active Filters Count */}
            <div className="px-6 pb-4">
                <div className="text-xs text-gray-500 text-center">
                    {Object.values(filters).filter(v => v !== null && v !== undefined && v !== '').length} bộ lọc đang áp dụng
                </div>
            </div>
        </div>
    );
};

export default TourFilters;