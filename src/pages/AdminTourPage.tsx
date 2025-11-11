import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllToursAdmin, searchTours } from "../services/tour.service";
import type { TourSearchParams } from "../services/tour.service";
import TourFilters from "../components/tour/TourFilters";
import TourList from "../components/tour/TourList";
import PaginationControls from "../components/tour/PaginationControls";
import { Shield, Filter } from "lucide-react";

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

const AdminToursPage: React.FC = () => {
  const [filters, setFilters] = useState<TourSearchParams>(initialFilterState);
  const [appliedFilters, setAppliedFilters] = useState<TourSearchParams>(initialFilterState);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActiveFilters = useMemo(() => {
    return Object.entries(appliedFilters).some(([_, value]) => {
      return value !== null && value !== undefined && value !== '';
    });
  }, [appliedFilters]);

  const queryKey = [
    "adminTours",
    appliedFilters.keyword,
    appliedFilters.destination,
    appliedFilters.minPrice,
    appliedFilters.maxPrice,
    appliedFilters.startDate,
    appliedFilters.durationDays,
    appliedFilters.minQuantity,
    appliedFilters.tourStatus,
  ];

  const { data: tours = [], isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      console.log("Admin fetching tours with filters:", appliedFilters);
      
      if (hasActiveFilters) {
        console.log("Admin using searchTours");
        return searchTours(appliedFilters);
      }
      
      console.log("Admin using getAllToursAdmin");
      return getAllToursAdmin();
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

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

  const handleApplyFilters = () => {
    console.log("Admin applying filters:", filters);
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const handleResetFilters = () => {
    console.log("Admin resetting filters");
    setFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Admin Header */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
              <Shield className="w-4 h-4" />
              Quản lý toàn bộ tours
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Admin - Quản Lý Tour
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quản lý tất cả tours trong hệ thống, bao gồm cả tours đã đóng và hoàn thành
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{tours.length}</div>
                <div className="text-sm text-gray-500">Tổng Tours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">{totalPages}</div>
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
            <TourFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              onApplyFilters={handleApplyFilters}
              isAdmin={true}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {hasActiveFilters && (
              <div className="mb-6 flex items-center gap-2 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-purple-900 font-medium">
                  Đang lọc: {tours.length} kết quả
                </span>
              </div>
            )}

            <TourList tours={paginatedTours} isLoading={isLoading} />

            {!isLoading && tours.length > 0 && (
              <div className="mt-8">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {!isLoading && tours.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Không tìm thấy tour
                </h3>
                <p className="text-gray-600 mb-6">
                  Thử thay đổi bộ lọc hoặc tạo tour mới
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors"
                >
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

export default AdminToursPage;