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
    Filter,
    ChevronDown,
    Calendar,
    Users,
    DollarSign,
} from "lucide-react";
import toast from "react-hot-toast";
import type { TourResponse } from "../types/tour";

const AdminToursManagement: React.FC = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [sortBy, setSortBy] = useState<"date" | "bookings" | "price">("date");
    const queryClient = useQueryClient();

    const { data: tours = [], isLoading } = useQuery({
        queryKey: ["adminToursManagement", statusFilter],
        queryFn: async () => {
            if (statusFilter === "ALL") {
                return getAllToursAdmin();
            }
            return searchTours({ tourStatus: statusFilter as any });
        },
        staleTime: 1000 * 60 * 5,
    });

    // Filter and sort tours
    const filteredTours = useMemo(() => {
        let result = [...tours];

        // Search filter
        if (searchKeyword) {
            result = result.filter(
                (tour) =>
                    tour.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                    tour.destination.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        }

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case "date":
                    // Sửa logic sort: Cần parse ngày "dd/MM/yyyy"
                    const dateA = a.startDate ? a.startDate.split('/').reverse().join('-') : '1970-01-01';
                    const dateB = b.startDate ? b.startDate.split('/').reverse().join('-') : '1970-01-01';
                    return new Date(dateB).getTime() - new Date(dateA).getTime();
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

    
    // Cập nhật mutationFn để gọi API deleteTour
    const deleteTourMutation = useMutation({
        mutationFn: async (tourId: string) => {
            // SỬA Ở ĐÂY: Bỏ console.log và gọi API thật
            await deleteTour(tourId);
        },
        onSuccess: () => {
            // Khi thành công, làm mới danh sách và báo toast
            queryClient.invalidateQueries({ queryKey: ["adminToursManagement"] });
            toast.success("Xóa tour thành công!");
        },
        onError: (error: any) => {
            // Nếu có lỗi từ backend (ví dụ: lỗi 500)
            toast.error("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
        },
    });
    


    const handleDeleteTour = (tourId: string, tourTitle: string) => {
        if (window.confirm(`Bạn có chắc muốn xóa tour "${tourTitle}"?`)) {
            deleteTourMutation.mutate(tourId);
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
            IN_PROGRESS: "Đang chạy",
            COMPLETED: "Hoàn thành",
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
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
                    <p className="text-gray-600 mt-1">Tổng cộng {filteredTours.length} tours</p>
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
                    {/* Search */}
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

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="OPEN_BOOKING">Đang mở booking</option>
                        <option value="IN_PROGRESS">Đang thực hiện</option>
                        <option value="COMPLETED">Đã hoàn thành</option>
                    </select>

                    {/* Sort */}
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
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Tour
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Điểm đến
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Ngày khởi hành
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Giá
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Bookings
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Thao tác
                                </th>
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
                                    <td className="px-6 py-4">{getStatusBadge(tour.tourStatus)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-900">
                                            <Calendar size={16} className="text-gray-400" />
                                            
                                            {tour.startDate || "N/A"}
                      
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
                                                className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                                                title="Sửa"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteTour(tour.tourId, tour.title)}
                                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                title="Xóa"
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
        </div>
    );
};

export default AdminToursManagement;