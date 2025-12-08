import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllToursAdmin, searchTours, deleteTour } from "../services/tour.service";
import { Link } from "react-router-dom";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Calendar,
    Users,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDateYMD, parseDateSafely } from "../utils/date";

const TOURS_PER_PAGE = 15;

const AdminToursManagement: React.FC = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [sortBy, setSortBy] = useState<"date" | "bookings" | "price">("date");
    const [currentPage, setCurrentPage] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tourToDelete, setTourToDelete] = useState<{ id: string; title: string; hasBookings: boolean } | null>(null);

    const queryClient = useQueryClient();

    const { data: toursResponse, isLoading } = useQuery({
        queryKey: ["adminToursManagement", statusFilter, currentPage],
        queryFn: async () => {
            if (statusFilter === "ALL") {
                return getAllToursAdmin(currentPage, TOURS_PER_PAGE);
            }
            return searchTours({ tourStatus: statusFilter as any }, currentPage, TOURS_PER_PAGE);
        },
        staleTime: 1000 * 60 * 5,
        keepPreviousData: true,
    });

    const tours = toursResponse?.items || [];
    const totalPages = toursResponse?.totalPages || 0;
    const totalItems = toursResponse?.totalItems || 0;

    // Filter và sort tours trong client
    const getTimeValue = (value?: string | null) => {
        const date = parseDateSafely(value);
        return date ? date.getTime() : 0;
    };

    const filteredTours = useMemo(() => {
        let result = [...tours];

        if (searchKeyword) {
            result = result.filter(
                (tour) =>
                    tour.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                    tour.destination.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case "date":
                    return getTimeValue(b.startDate) - getTimeValue(a.startDate);
                case "bookings":
                    return (b.totalBookings || 0) - (a.totalBookings || 0);
                case "price":
                    return b.priceAdult - a.priceAdult;
                default:
                    return 0;
            }
        });

        return result;
    }, [tours, searchKeyword, sortBy]);

    const deleteTourMutation = useMutation({
        mutationFn: async (tourId: string) => {
            await deleteTour(tourId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminToursManagement"] });
            toast.success("Xóa tour thành công!");
            setShowDeleteModal(false);
            setTourToDelete(null);
        },
        onError: (error: any) => {
            toast.error("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
            setShowDeleteModal(false);
            setTourToDelete(null);
        },
    });

    const handleDeleteClick = (tourId: string, tourTitle: string, totalBookings: number) => {
        const hasBookings = totalBookings > 0;

        if (hasBookings) {
            toast.error(
                `Không thể xóa tour "${tourTitle}" vì đã có ${totalBookings} người đặt!`,
                { duration: 4000 }
            );
            return;
        }

        setTourToDelete({ id: tourId, title: tourTitle, hasBookings });
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (tourToDelete) {
            deleteTourMutation.mutate(tourToDelete.id);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            OPEN_BOOKING: "bg-green-100 text-green-800",
            IN_PROGRESS: "bg-blue-100 text-blue-800",
            COMPLETED: "bg-gray-100 text-gray-800",
        };
        const labels = {
            OPEN_BOOKING: "Đang mở",
            IN_PROGRESS: "Đang thực hiện",
            COMPLETED: "Hoàn thành",
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleStatusFilterChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        setCurrentPage(0);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải danh sách tour...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản Lý Tours</h1>
                    <p className="text-gray-600 mt-1">
                        Hiển thị {filteredTours.length} tours (Tổng {totalItems} tours, trang {currentPage + 1}/{totalPages})
                    </p>
                </div>
                <Link
                    to="/admin/tours/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                    <Plus size={20} />
                    Thêm Tour Mới
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tour..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilterChange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="OPEN_BOOKING">Đang mở booking</option>
                        <option value="IN_PROGRESS">Đang thực hiện</option>
                        <option value="COMPLETED">Đã hoàn thành</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="date">Sắp xếp: Ngày mới nhất</option>
                        <option value="bookings">Sắp xếp: Nhiều booking nhất</option>
                        <option value="price">Sắp xếp: Giá cao nhất</option>
                    </select>
                </div>
            </div>

            {/* Tours Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tour</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Điểm đến</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày khởi hành</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bookings</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTours.map((tour) => (
                                <tr key={tour.tourId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={tour.imageUrls?.[0] || "https://picsum.photos/100/100"}
                                                alt={tour.title}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900 line-clamp-1">{tour.title}</p>
                                                <p className="text-sm text-gray-500">{tour.duration}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900">{tour.destination}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(tour.tourStatus)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-900">
                                            <Calendar size={16} className="text-gray-400" />
                                            {(() => {
                                                const formatted = formatDateYMD(tour.startDate, { includeTime: false });
                                                return formatted === "Không xác định" ? "N/A" : formatted;
                                            })()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
                                            <DollarSign size={16} />
                                            {tour.priceAdult.toLocaleString()}₫
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-gray-400" />
                                            <span className="text-sm font-semibold text-gray-900">{tour.totalBookings || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/tours/${tour.tourId}`}
                                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                title="Xem"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                to={`/admin/tours/edit/${tour.tourId}`}
                                                className={`p-2 rounded-lg transition-colors ${tour.tourStatus === 'COMPLETED'
                                                        ? 'opacity-50 cursor-not-allowed text-gray-400'
                                                        : 'hover:bg-indigo-50 text-indigo-600'
                                                    }`}
                                                title={tour.tourStatus === 'COMPLETED' ? 'Tour đã hoàn thành không thể sửa' : 'Sửa'}
                                                onClick={(e) => {
                                                    if (tour.tourStatus === 'COMPLETED') {
                                                        e.preventDefault();
                                                        toast.error('Tour đã hoàn thành không thể chỉnh sửa!');
                                                    }
                                                }}
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(tour.tourId, tour.title, tour.totalBookings || 0)}
                                                className={`p-2 rounded-lg transition-colors ${(tour.totalBookings || 0) > 0
                                                        ? 'opacity-50 cursor-not-allowed text-gray-400'
                                                        : 'hover:bg-red-50 text-red-600'
                                                    }`}
                                                title={(tour.totalBookings || 0) > 0 ? 'Không thể xóa tour đã có booking' : 'Xóa'}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredTours.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Không tìm thấy tour nào</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-md">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                        Trang trước
                    </button>

                    <div className="flex items-center gap-2">
                        {currentPage > 2 && (
                            <>
                                <button
                                    onClick={() => handlePageChange(0)}
                                    className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    1
                                </button>
                                <span className="text-gray-400">...</span>
                            </>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => i)
                            .filter(page =>
                                page === currentPage ||
                                page === currentPage - 1 ||
                                page === currentPage + 1
                            )
                            .map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${page === currentPage
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {page + 1}
                                </button>
                            ))}

                        {currentPage < totalPages - 3 && (
                            <>
                                <span className="text-gray-400">...</span>
                                <button
                                    onClick={() => handlePageChange(totalPages - 1)}
                                    className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Trang sau
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && tourToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Xác nhận xóa tour</h3>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xóa tour <span className="font-semibold">"{tourToDelete.title}"</span>?
                            Hành động này không thể hoàn tác.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setTourToDelete(null);
                                }}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleteTourMutation.isPending}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {deleteTourMutation.isPending ? 'Đang xóa...' : 'Xóa tour'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminToursManagement;