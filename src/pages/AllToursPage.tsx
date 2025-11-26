
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getTours,
  getAllToursAdmin,
  searchTours,
} from "../services/tour.service";
import type { TourSearchParams } from "../services/tour.service";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDestination = searchParams.get("destination");

  const [filters, setFilters] = useState<TourSearchParams>({
    ...initialFilterState,
    destination: initialDestination || null, // GÁN VÀO ĐIỂM ĐẾN
  });
  const [appliedFilters, setAppliedFilters] =
    useState<TourSearchParams>({
      ...initialFilterState,
      destination: initialDestination || null, // GÁN VÀO ĐIỂM ĐẾN
    });

  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { token } = useAuthStore();

  useEffect(() => {
    const destination = searchParams.get("destination");
    const keyword = searchParams.get("keyword");
    const newFilters = {
      ...initialFilterState,
      destination: destination || null, // GÁN VÀO ĐIỂM ĐẾN
      keyword: keyword || null,
    };
    setFilters(newFilters);
    setAppliedFilters(newFilters);
    setCurrentPage(1);
  }, [searchParams]);

  const isAdmin = useMemo(() => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.scope?.includes("ROLE_ADMIN") || false;
    } catch {
      return false;
    }
  }, [token]);

  const hasActiveFilters = useMemo(() => {
    return Object.entries(appliedFilters).some(([key, value]) => {
      if (key === "tourStatus" && !isAdmin) return false;
      return value !== null && value !== undefined && value !== "";
    });
  }, [appliedFilters, isAdmin]);

  const queryKey = [
    "allTours",
    appliedFilters.keyword,
    appliedFilters.destination, // Dùng 'destination' để gọi API
    appliedFilters.minPrice,
    appliedFilters.maxPrice,
    appliedFilters.startDate,
    appliedFilters.durationDays,
    appliedFilters.minQuantity,
    isAdmin ? appliedFilters.tourStatus : null,
    isAdmin,
  ];

  const {
    data: tours = [],
    isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (hasActiveFilters) return searchTours(appliedFilters);
      if (isAdmin) return getAllToursAdmin();
      return getTours();
    },
    staleTime: 1000 * 60 * 5,
  });

  const totalPages = useMemo(() => {
    return Math.ceil(tours.length / TOURS_PER_PAGE);
  }, [tours]);

  const paginatedTours = useMemo(() => {
    const startIndex = (currentPage - 1) * TOURS_PER_PAGE;
    return tours.slice(startIndex, startIndex + TOURS_PER_PAGE);
  }, [tours, currentPage]);

  const handleFilterChange = (key: keyof TourSearchParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
    setShowMobileFilters(false);
    const newParams = new URLSearchParams();
    if (filters.destination) newParams.set("destination", filters.destination);
    if (filters.keyword) newParams.set("keyword", filters.keyword);
    if (!filters.destination) newParams.delete("destination");
    if (!filters.keyword) newParams.delete("keyword");
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
    setCurrentPage(1);
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <TourFilters
                filters={filters} // Truyền state 'filters' (đã có destination) xuống
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                onApplyFilters={handleApplyFilters}
                isAdmin={isAdmin}
              />
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold mb-3">
                <Sparkles className="w-4 h-4" />
                Khám phá điểm đến mơ ước
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Khám Phá Tất Cả Tour
              </h1>
              <p className="text-sm text-gray-600 max-w-xl mx-auto">
                Tìm kiếm hành trình hoàn hảo của bạn từ hàng trăm tour chất lượng
              </p>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{tours.length}</div>
                  <div className="text-xs text-gray-500">Tours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalPages}</div>
                  <div className="text-xs text-gray-500">Trang</div>
                </div>
              </div>
            </div>
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 px-5 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Filter className="w-5 h-5" />
                {showMobileFilters ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
              </button>
            </div>
            {showMobileFilters && (
              <div className="lg:hidden mb-6">
                <TourFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                  onApplyFilters={handleApplyFilters}
                  isAdmin={isAdmin}
                />
              </div>
            )}
            <div>
              <TourList tours={paginatedTours} isLoading={isLoading} />
              {!isLoading && tours.length > 0 && (
                <div className="mt-6">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
              {!isLoading && tours.length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Không tìm thấy tour phù hợp
                  </h3>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllToursPage;