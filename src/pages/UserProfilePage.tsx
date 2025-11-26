import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "../services/user.service";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Loader } from "lucide-react";
import toast from "react-hot-toast";
import type { UserUpdateRequest } from "../types/user";

const UserProfilePage: React.FC = () => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserUpdateRequest>({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
    });

    const { data: user, isLoading } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
        staleTime: 1000 * 60 * 5,
    });

    // Set form data when user data loads
    React.useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                address: user.address || "",
            });
        }
    }, [user]);

    const updateMutation = useMutation({
        mutationFn: (data: UserUpdateRequest) => updateUserProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            toast.success("Cập nhật thông tin thành công!");
            setIsEditing(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                address: user.address || "",
            });
        }
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Không tìm thấy thông tin người dùng
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full text-white text-3xl font-bold mb-4 shadow-lg">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Thông tin cá nhân
                    </h1>
                    <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Account Status Banner */}
                    <div className={`px-6 py-4 ${user.isActive ? 'bg-green-50 border-b border-green-100' : 'bg-red-50 border-b border-red-100'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className={`font-medium ${user.isActive ? 'text-green-700' : 'text-red-700'}`}>
                                    Tài khoản {user.isActive ? 'đang hoạt động' : 'đã bị khóa'}
                                </span>
                            </div>
                            {user.noPassword && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                    Đăng nhập Google
                                </span>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        {/* Form Fields */}
                        <div className="space-y-6">
                            {/* Username (Read-only) */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <User className="w-4 h-4 text-indigo-600" />
                                    Tên đăng nhập
                                </label>
                                <input
                                    type="text"
                                    value={user.username}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Tên đăng nhập không thể thay đổi
                                </p>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <User className="w-4 h-4 text-indigo-600" />
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${isEditing
                                        ? "border-gray-300 bg-white"
                                        : "border-gray-200 bg-gray-50 text-gray-700"
                                        }`}
                                    placeholder="Nhập họ và tên"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 text-indigo-600" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${isEditing
                                        ? "border-gray-300 bg-white"
                                        : "border-gray-200 bg-gray-50 text-gray-700"
                                        }`}
                                    placeholder="email@example.com"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 text-indigo-600" />
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${isEditing
                                        ? "border-gray-300 bg-white"
                                        : "border-gray-200 bg-gray-50 text-gray-700"
                                        }`}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 text-indigo-600" />
                                    Địa chỉ
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${isEditing
                                        ? "border-gray-300 bg-white"
                                        : "border-gray-200 bg-gray-50 text-gray-700"
                                        }`}
                                    placeholder="Nhập địa chỉ"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex gap-4">
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <Edit2 size={20} />
                                    Chỉnh sửa thông tin
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                                    >
                                        <X size={20} />
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateMutation.isPending}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {updateMutation.isPending ? (
                                            <>
                                                <Loader className="animate-spin" size={20} />
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                Lưu thay đổi
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;