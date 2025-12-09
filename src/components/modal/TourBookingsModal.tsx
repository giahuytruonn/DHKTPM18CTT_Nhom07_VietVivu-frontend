import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTourBookings } from "../../services/booking.services";
import { X, User, Mail, Phone, MapPin, Calendar, DollarSign, Users } from "lucide-react";
import { formatDateYMD } from "../../utils/date";

interface TourBookingsModalProps {
    tourId: string;
    tourTitle: string;
    onClose: () => void;
}

const TourBookingsModal: React.FC<TourBookingsModalProps> = ({ tourId, tourTitle, onClose }) => {
    const { data: bookings, isLoading } = useQuery({
        queryKey: ["tourBookings", tourId],
        queryFn: () => getTourBookings(tourId),
    });

    const getStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            PENDING: "bg-yellow-100 text-yellow-800",
            CONFIRMED: "bg-green-100 text-green-800",
            CANCELLED: "bg-red-100 text-red-800",
            COMPLETED: "bg-blue-100 text-blue-800",
            CONFIRMED_CHANGE: "bg-purple-100 text-purple-800",
            DENIED_CANCELLATION: "bg-orange-100 text-orange-800",
            DENIED_CHANGE: "bg-pink-100 text-pink-800",
        };
        return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    const getStatusLabel = (status: string) => {
        const statusLabels: Record<string, string> = {
            PENDING: "Chờ xác nhận",
            CONFIRMED: "Đã xác nhận",
            CANCELLED: "Đã hủy",
            COMPLETED: "Hoàn thành",
            CONFIRMED_CHANGE: "Đã xác nhận thay đổi",
            DENIED_CANCELLATION: "Từ chối hủy",
            DENIED_CHANGE: "Từ chối thay đổi",
        };
        return statusLabels[status] || status;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Danh sách đặt tour</h2>
                            <p className="text-indigo-100 mt-1">{tourTitle}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : bookings && bookings.length > 0 ? (
                        <div className="space-y-4">
                            <p className="text-gray-600 mb-4">
                                Tổng cộng: <span className="font-semibold text-gray-900">{bookings.length}</span> booking
                            </p>

                            {bookings.map((booking) => (
                                <div
                                    key={booking.bookingId}
                                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Mã booking</p>
                                            <p className="font-mono text-sm font-semibold text-gray-900">
                                                {booking.bookingId}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.bookingStatus)}`}>
                                            {getStatusLabel(booking.bookingStatus)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Thông tin khách hàng */}
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <User size={18} className="text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Họ tên</p>
                                                    <p className="font-semibold text-gray-900">{booking.name}</p>
                                                </div>
                                            </div>

                                            {booking.email && (
                                                <div className="flex items-start gap-3">
                                                    <Mail size={18} className="text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Email</p>
                                                        <p className="text-gray-900">{booking.email}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {booking.phone && (
                                                <div className="flex items-start gap-3">
                                                    <Phone size={18} className="text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Số điện thoại</p>
                                                        <p className="text-gray-900">{booking.phone}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {booking.address && (
                                                <div className="flex items-start gap-3">
                                                    <MapPin size={18} className="text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Địa chỉ</p>
                                                        <p className="text-gray-900">{booking.address}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Thông tin booking */}
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <Calendar size={18} className="text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Ngày đặt</p>
                                                    <p className="text-gray-900">
                                                        {formatDateYMD(booking.bookingDate, { includeTime: true })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <User size={18} className="text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Số lượng</p>
                                                    <p className="text-gray-900">
                                                        {booking.numOfAdults} người lớn, {booking.numOfChildren} trẻ em
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <DollarSign size={18} className="text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Tổng tiền</p>
                                                    <p className="text-lg font-bold text-indigo-600">
                                                        {booking.totalPrice.toLocaleString()}₫
                                                    </p>
                                                </div>
                                            </div>

                                            {booking.promotionCode && (
                                                <div className="bg-green-50 p-3 rounded-lg">
                                                    <p className="text-xs text-green-600 font-semibold">Mã giảm giá</p>
                                                    <p className="text-sm text-green-800">{booking.promotionCode}</p>
                                                    <p className="text-xs text-green-600 mt-1">
                                                        Giảm: {booking.discountAmount.toLocaleString()}₫
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {booking.note && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1">Ghi chú</p>
                                            <p className="text-gray-700 text-sm italic">{booking.note}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Users size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">Chưa có booking nào cho tour này</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TourBookingsModal;