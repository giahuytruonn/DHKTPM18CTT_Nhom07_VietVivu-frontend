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
  const initialKeyword = searchParams.get("keyword");

  /** ================================
   *  FILTER STATE
   *  filters: đang nhập trong UI
   *  appliedFilters: là bộ lọc thực sự gọi API
   * =================================*/
  const [filters, setFilters] = useState<TourSearchParams>({
    ...initialFilterState,
    destination: initialDestination || null,
    keyword: initialKeyword || null,
  });

  const [appliedFilters, setAppliedFilters] = useState<TourSearchParams>({
    ...initialFilterState,
    destination: initialDestination || null,
    keyword: initialKeyword || null,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { token } = useAuthStore();

  /** ================================
   *  ĐỒNG BỘ QUERY PARAMS → UI
   * =================================*/
  useEffect(() => {
    const destination = searchParams.get("destination");
    const keyword = searchParams.get("keyword");

    const syncedFilters = {
      ...initialFilterState,
      destination: destination || null,
      keyword: keyword || null,
    };

    setFilters(syncedFilters);
    setAppliedFilters(syncedFilters);
    setCurrentPage(0);
  }, [searchParams]);

  /** ================================
   *  CHECK ADMIN
   * =================================*/
  const isAdmin = useMemo(() => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.scope?.includes("ROLE_ADMIN") || false;
    } catch {
      return false;
    }
  }, [token]);

  /** ================================
   *  KIỂM TRA FILTER NÀO ĐANG BẬT
   * =================================*/
  const hasActiveFilters = useMemo(() => {
    return Object.entries(appliedFilters).some(([key, value]) => {
      if (key === "tourStatus" && !isAdmin) return false;
      return value !== null && value !== "" && value !== undefined;
    });
  }, [appliedFilters, isAdmin]);

  /** ================================
   *  REACT QUERY FETCH
   * =================================*/
  const queryKey = [
    "allTours",
    appliedFilters,
    isAdmin,
    currentPage,
    TOURS_PER_PAGE,
  ];

  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      if (hasActiveFilters) {
        return searchTours(appliedFilters, currentPage, TOURS_PER_PAGE);
      }
      return isAdmin
        ? getAllToursAdmin(currentPage, TOURS_PER_PAGE)
        : getTours(currentPage, TOURS_PER_PAGE);
    },
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const tours = data?.items || [];
  const totalPages = data?.totalPages || 0;
  const totalItems = data?.totalItems || 0;

  /** ================================
   *  FILTER EVENTS
   * =================================*/

  const handleFilterChange = (key: keyof TourSearchParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ✔ FIX QUAN TRỌNG: áp dụng và react-query fetch NGAY
  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(0);

    const newParams = new URLSearchParams();
    if (filters.destination) newParams.set("destination", filters.destination);
    if (filters.keyword) newParams.set("keyword", filters.keyword);

    setSearchParams(newParams);
    setShowMobileFilters(false);
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
    setSearchParams({});
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  /** ================================
   *  UI RENDER
   * =================================*/

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* FILTER DESKTOP */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <TourFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                onApplyFilters={handleApplyFilters}
                isAdmin={isAdmin}
              />
            </div>
          </div>

          {/* MAIN CONTENT */}
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
                  <div className="text-2xl font-bold text-indigo-600">{totalItems}</div>
                  <div className="text-xs text-gray-500">Tours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalPages}</div>
                  <div className="text-xs text-gray-500">Trang</div>
                </div>
              </div>
            </div>

            {/* MOBILE FILTER BUTTON */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 px-5 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Filter className="w-5 h-5" />
                {showMobileFilters ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
              </button>
            </div>

            {/* MOBILE FILTER PANEL */}
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

            {/* TOUR LIST */}
            <TourList tours={tours} isLoading={isLoading} isFetching={isFetching} />

            {/* PAGINATION */}
            {!isLoading && tours.length > 0 && (
              <div className="mt-6">
                <PaginationControls
                  currentPage={currentPage + 1}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* EMPTY STATE */}
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
  );
};

export default AllToursPage;
