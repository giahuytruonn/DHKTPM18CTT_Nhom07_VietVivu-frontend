import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "../services/user.service";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Loader, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const profileSchema = z.object({
    name: z.string().min(1, "Vui lòng nhập họ và tên"),

    email: z
        .string()
        .min(1, "Vui lòng nhập email")
        .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/i, "Chỉ chấp nhận email Gmail (@gmail.com)")
        .transform(val => val.toLowerCase()),

    // Số điện thoại VN: bắt đầu bằng 0, đúng 10 số
    phoneNumber: z
        .string()
        .regex(/^0[1-9][0-9]{8}$/, "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số")
        .optional()
        .or(z.literal("")),

    address: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const UserProfilePage: React.FC = () => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = React.useState(false);

    const { data: user, isLoading } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
        staleTime: 1000 * 60 * 5,
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            address: "",
        },
    });

    React.useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                address: user.address || "",
            });
        }
    }, [user, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: ProfileFormData) => updateUserProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            toast.success("Cập nhật thông tin thành công!");
            setIsEditing(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Cập nhật thất bại");
        },
    });

    const onSubmit = (data: ProfileFormData) => {
        updateMutation.mutate(data);
    };

    const handleCancel = () => {
        if (user) {
            reset({
                name: user.name || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                address: user.address || "",
            });
        }
        setIsEditing(false);
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin w-12 h-12 text-indigo-600" /></div>;
    if (!user) return <div className="text-center py-20 text-2xl text-gray-600">Không tìm thấy người dùng</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full text-white text-3xl font-bold mb-4 shadow-lg">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h1>
                    <p className="text-gray-600">Quản lý và cập nhật hồ sơ của bạn</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Status */}
                    <div className={`px-6 py-4 ${user.isActive ? 'bg-green-50' : 'bg-red-50'} border-b`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className={`font-medium ${user.isActive ? 'text-green-700' : 'text-red-700'}`}>
                                    Tài khoản {user.isActive ? 'đang hoạt động' : 'bị khóa'}
                                </span>
                            </div>
                            {user.noPassword && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                    Đăng nhập Google
                                </span>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                        <div className="space-y-6">
                            {/* Username */}
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
                            </div>

                            {/* Họ tên */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <User className="w-4 h-4 text-indigo-600" />
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("name")}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border rounded-lg transition-all ${isEditing
                                        ? errors.name
                                            ? "border-red-500 bg-red-50 focus:ring-red-500"
                                            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        : "bg-gray-50 border-gray-200 text-gray-600"
                                        }`}
                                    placeholder="Nguyễn Văn A"
                                />
                                {errors.name && isEditing && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Email - Regex chặt */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 text-indigo-600" />
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("email")}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border rounded-lg transition-all ${isEditing
                                        ? errors.email
                                            ? "border-red-500 bg-red-50 focus:ring-red-500"
                                            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        : "bg-gray-50 border-gray-200 text-gray-600"
                                        }`}
                                    placeholder="abc@gmail.com"
                                />
                                {errors.email && isEditing && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Số điện thoại */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 text-indigo-600" />
                                    Số điện thoại
                                </label>
                                <input
                                    {...register("phoneNumber")}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border rounded-lg transition-all ${isEditing
                                        ? errors.phoneNumber
                                            ? "border-red-500 bg-red-50 focus:ring-red-500"
                                            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        : "bg-gray-50 border-gray-200 text-gray-600"
                                        }`}
                                    placeholder="0901234567"
                                />
                                {errors.phoneNumber && isEditing && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.phoneNumber.message}
                                    </p>
                                )}
                            </div>

                            {/* Địa chỉ */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 text-indigo-600" />
                                    Địa chỉ
                                </label>
                                <input
                                    {...register("address")}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border rounded-lg transition-all ${isEditing
                                        ? "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        : "bg-gray-50 border-gray-200 text-gray-600"
                                        }`}
                                    placeholder="123 Đường Láng, Hà Nội"
                                />
                            </div>
                        </div>

                        {/* Nút hành động */}
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
                                        className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
                                    >
                                        <X size={20} />
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateMutation.isPending || !isDirty}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl disabled:opacity-50"
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