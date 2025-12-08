import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Calendar, MapPin, Users, DollarSign, Clock, Loader } from 'lucide-react';
import { getUserBookings } from '../../services/booking.services';
import type { BookingResponse } from '../../services/booking.services';

interface UserBookingsModalProps {
    userId: string;
    userName: string;
    onClose: () => void;
}

const UserBookingsModal: React.FC<UserBookingsModalProps> = ({ userId, userName, onClose }) => {
    const { data: bookings, isLoading, error } = useQuery({
        queryKey: ['userBookings', userId],
        queryFn: () => getUserBookings(userId),
        enabled: !!userId,
    });

    const getStatusBadge = (status: string) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
            COMPLETED: 'bg-blue-100 text-blue-800',
        };
        const labels = {
            PENDING: 'Chờ thanh toán',
            CONFIRMED: 'Đã thanh toán',
            CANCELLED: 'Đã hủy',
            COMPLETED: 'Hoàn thành',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status as keyof typeof labels] || status}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Danh sách booking</h2>
                        <p className="text-indigo-100 mt-1">Người dùng: {userName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader className="animate-spin text-indigo-600 mb-4" size={48} />
                            <p className="text-gray-600">Đang tải danh sách booking...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <X className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
                            <p className="text-gray-600">Không thể tải danh sách booking</p>
                        </div>
                    ) : !bookings || bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có booking nào</h3>
                            <p className="text-gray-600">Người dùng này chưa đặt tour nào</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking: BookingResponse) => (
                                <div
                                    key={booking.bookingId}
                                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all"
                                >
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Tour Image */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={booking.imageUrl || 'https://via.placeholder.com/200x150'}
                                                alt={booking.tourTitle}
                                                className="w-full lg:w-48 h-32 object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Booking Info */}
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                        {booking.tourTitle}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                        <MapPin size={16} />
                                                        <span>{booking.tourDestination}</span>
                                                        <span className="mx-2">•</span>
                                                        <Clock size={16} />
                                                        <span>{booking.tourDuration}</span>
                                                    </div>
                                                </div>
                                                {getStatusBadge(booking.bookingStatus)}
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Mã booking</p>
                                                    <p className="font-semibold text-gray-900 truncate">
                                                        #{booking.bookingId.slice(0, 8)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Ngày đặt</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {formatDate(booking.bookingDate)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Số người</p>
                                                    <div className="flex items-center gap-2">
                                                        <Users size={16} className="text-indigo-600" />
                                                        <span className="font-semibold text-gray-900">
                                                            {booking.numOfAdults} NL, {booking.numOfChildren} TE
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Tổng tiền</p>
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign size={16} className="text-green-600" />
                                                        <span className="font-bold text-green-600">
                                                            {booking.totalPrice.toLocaleString()}₫
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {booking.promotionCode && (
                                                <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                                                    <span className="text-sm text-orange-800">
                                                        🎫 Mã giảm giá: <span className="font-semibold">{booking.promotionCode}</span>
                                                    </span>
                                                    <span className="text-sm text-orange-600">
                                                        (-{booking.discountAmount.toLocaleString()}₫)
                                                    </span>
                                                </div>
                                            )}

                                            {booking.note && (
                                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                    <span className="font-semibold">Ghi chú:</span> {booking.note}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {bookings && bookings.length > 0 && (
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Tổng cộng: <span className="font-bold text-indigo-600">{bookings.length}</span> booking
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserBookingsModal;