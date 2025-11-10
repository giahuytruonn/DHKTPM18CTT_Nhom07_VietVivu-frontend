import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTours, getAllToursAdmin, searchTours } from "../services/tour.service";
import type { TourSearchParams } from "../services/tour.service";
import { useDebounce } from "../hooks/useDebounce";
import { useAuthStore } from "../stores/useAuthStore";
import TourFilters from "../components/tour/TourFilters";
import TourList from "../components/tour/TourList";
import PaginationControls from "../components/tour/PaginationControls";
import { Sparkles, Filter } from "lucide-react";

const initialFilterState: TourSearchParams = {
  keyword: null,
  destination: null,
  minPrice: null,
  maxPrice: null,
  startDate: null,
  durationDays: null,
  minQuantity: null,
  tourStatus: null,
};

const TOURS_PER_PAGE = 9;

const AllToursPage: React.FC = () => {
  const [filters, setFilters] = useState<TourSearchParams>(initialFilterState);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const { token } = useAuthStore();
  const isAdmin = useMemo(() => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.scope?.includes('ROLE_ADMIN') || false;
    } catch {
      return false;
    }
  }, [token]);

  const debouncedKeyword = useDebounce(filters.keyword, 500);
  const debouncedDestination = useDebounce(filters.destination, 500);

  const hasActiveFilters = useMemo(() => {
  return Object.entries(filters).some(([key, value]) => {
    // User/Guest KHÔNG có tourStatus filter
    if (key === 'tourStatus') return false;
    return value !== null && value !== undefined && value !== '';
  });
}, [filters]);

  const queryKey = [
    "allTours",
    debouncedKeyword,
    debouncedDestination,
    filters.minPrice,
    filters.maxPrice,
    filters.startDate,
    filters.durationDays,
    filters.minQuantity,
    isAdmin ? filters.tourStatus : null,
    isAdmin,
  ];

  const { data: tours = [], isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      // Nếu có bất kỳ filter nào active, dùng searchTours
      if (hasActiveFilters) {
        return searchTours({
          ...filters,
          keyword: debouncedKeyword,
          destination: debouncedDestination,
        });
      }
      
      // Không có filter: Admin dùng getAllToursAdmin, User dùng getTours
      if (isAdmin) {
        return getAllToursAdmin();
      }
      return getTours();
    },
    staleTime: 1000 * 60 * 5,
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [queryKey.join("-")]);

  const totalPages = useMemo(() => {
    return Math.ceil(tours.length / TOURS_PER_PAGE);
  }, [tours]);

  const paginatedTours = useMemo(() => {
    const startIndex = (currentPage - 1) * TOURS_PER_PAGE;
    const endIndex = startIndex + TOURS_PER_PAGE;
    return tours.slice(startIndex, endIndex);
  }, [tours, currentPage]);

  const handleFilterChange = <K extends keyof TourSearchParams>(
    key: K,
    value: TourSearchParams[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Khám phá điểm đến mơ ước
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Khám Phá Tất Cả Tour
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tìm kiếm hành trình hoàn hảo cho bạn từ hàng trăm lựa chọn du lịch tuyệt vời
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{tours.length}</div>
                <div className="text-sm text-gray-500">Tours</div>
              </div>
              {isAdmin && (
                <div className="text-center">
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg">
                    🔐 Admin Mode
                  </div>
                </div>
              )}
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{totalPages}</div>
                <div className="text-sm text-gray-500">Trang</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Filter className="w-5 h-5" />
            {showMobileFilters ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc'}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Filters */}
          <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24">
              <TourFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                isAdmin={isAdmin}
              />
            </div>
          </div>

          {/* Main Content - Tour List */}
          <div className="lg:col-span-3">
            {/* Active Filters Badge */}
            {hasActiveFilters && (
              <div className="mb-6 flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-blue-900 font-medium">
                  Đang lọc: {tours.length} kết quả
                </span>
              </div>
            )}

            {/* Tour List */}
            <TourList tours={paginatedTours} isLoading={isLoading} />

            {/* Pagination */}
            {!isLoading && tours.length > 0 && (
              <div className="mt-8">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && tours.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fade-in">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Không tìm thấy tour phù hợp
                </h3>
                <p className="text-gray-600 mb-6">
                  Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllToursPage;