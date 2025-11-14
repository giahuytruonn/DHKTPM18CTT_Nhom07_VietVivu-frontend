import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, Plus, X, Calendar, DollarSign, MapPin, 
  Clock, Users, Image as ImageIcon, Upload, Loader, Trash2 
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { getTourById } from "../services/tour.service";
import { uploadImagesToCloudinary, deleteImageFromCloudinary } from "../services/upload.service";

interface TourFormData {
    title: string;
    description: string;
    initialQuantity: number;
    quantity: number;
    priceAdult: number;
    priceChild: number;
    duration: string;
    destination: string;
    startDate: string;
    endDate: string;
    itinerary: string[];
    imageUrls: string[];
}

const EditTourPage: React.FC = () => {
    const { tourId } = useParams<{ tourId: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<TourFormData>({
        title: "",
        description: "",
        initialQuantity: 0,
        quantity: 0,
        priceAdult: 0,
        priceChild: 0,
        duration: "",
        destination: "",
        startDate: "",
        endDate: "",
        itinerary: [""],
        imageUrls: [],
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    // Fetch tour data
    const { data: tour, isLoading } = useQuery({
        queryKey: ["tour", tourId],
        queryFn: () => getTourById(tourId!),
        enabled: !!tourId,
    });

    // Load tour data into form
    useEffect(() => {
        if (tour) {
            
            /**
             * Chuyển đổi ngày từ API (dd/MM/yyyy) sang ngày cho input (YYYY-MM-DD)
             */
            const formatApiDateToInputDate = (apiDate: string | null): string => {
              if (!apiDate) return "";
              const parts = apiDate.split('/'); // API gửi "dd/MM/yyyy"
              if (parts.length === 3) {
                // parts[0] = dd, parts[1] = MM, parts[2] = yyyy
                return `${parts[2]}-${parts[1]}-${parts[0]}`; // Trả về "YYYY-MM-DD"
              }
              // Nếu định dạng đã đúng (ví dụ: YYYY-MM-DD) thì giữ nguyên
              if (apiDate.includes('-')) {
                  return apiDate;
              }
              return ""; // Trả về chuỗi rỗng nếu không đúng định dạng
            };

            setFormData({
                title: tour.title || "",
                description: tour.description || "",
                initialQuantity: tour.initialQuantity || 0,
                quantity: tour.quantity || 0,
                priceAdult: tour.priceAdult || 0,
                priceChild: tour.priceChild || 0,
                duration: tour.duration || "",
                destination: tour.destination || "",
                // Áp dụng hàm chuyển đổi cho ngày tháng
                startDate: formatApiDateToInputDate(tour.startDate),
                endDate: formatApiDateToInputDate(tour.endDate),
                itinerary: tour.itinerary && tour.itinerary.length > 0 ? tour.itinerary : [""],
                imageUrls: tour.imageUrls || [],
            });
            setExistingImages(tour.imageUrls || []);
        }
    }, [tour]);

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} không phải là file ảnh`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} quá lớn (> 5MB)`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
        
        setSelectedFiles(prev => [...prev, ...validFiles]);
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };

    // Remove new image from selection
    const removeNewImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    // Remove existing image (gọi API xóa)
    const removeExistingImage = async (index: number) => {
        const imageUrl = existingImages[index];
        
        try {
            // Gọi API xóa ảnh khỏi Cloudinary (thông qua backend)
            await deleteImageFromCloudinary(imageUrl);
            
            // Nếu thành công, xóa khỏi state
            setExistingImages(prev => prev.filter((_, i) => i !== index));
            toast.success("Đã xóa ảnh");
        } catch (error) {
            console.error("Failed to delete image:", error);
            toast.error("Lỗi khi xóa ảnh");
        }
    };

    const updateTourMutation = useMutation({
        mutationFn: async (data: TourFormData) => {
            // Upload new images if any
            let newUploadedUrls: string[] = [];
            
            if (selectedFiles.length > 0) {
                setIsUploading(true);
                try {
                    newUploadedUrls = await uploadImagesToCloudinary(selectedFiles);
                    toast.success(`Đã upload ${newUploadedUrls.length} ảnh mới`);
                } catch (error) {
                    toast.error("Lỗi khi upload ảnh");
                    throw error;
                } finally {
                    setIsUploading(false);
                }
            }

            // Combine existing images + new uploaded images
            const allImageUrls = [...existingImages, ...newUploadedUrls];

            const cleanData = {
                ...data,
                itinerary: data.itinerary.filter(item => item.trim() !== ""),
                imageUrls: allImageUrls,
                // Khi gửi đi, input type="date" đã tự động trả về định dạng YYYY-MM-DD
                // Backend Spring Boot mặc định có thể đọc được định dạng này
                startDate: data.startDate || null,
                endDate: data.endDate || null,
            };

            const response = await api.put(`/tours/${tourId}`, cleanData);
            return response.data;
        },
        onSuccess: () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
            toast.success("Cập nhật tour thành công!");
            navigate("/admin/tours");
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật tour";
            toast.error(errorMessage);
            console.error("Update tour error:", error);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (existingImages.length === 0 && selectedFiles.length === 0) {
            toast.error("Vui lòng giữ ít nhất 1 ảnh");
            return;
        }
        
        updateTourMutation.mutate(formData);
    };

    const handleChange = (field: keyof TourFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: 'itinerary', index: number, value: string) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field: 'itinerary') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], ""]
        }));
    };

    const removeArrayItem = (field: 'itinerary', index: number) => {
        if (formData[field].length > 1) {
            const newArray = formData[field].filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, [field]: newArray }));
        }
    };

    const isPending = updateTourMutation.isPending || isUploading;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin tour...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/admin/tours")}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Quay lại danh sách</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Chỉnh Sửa Tour</h1>
                    <p className="text-gray-600 mt-2">Cập nhật thông tin tour du lịch</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin cơ bản</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề tour</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    disabled={isPending}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    disabled={isPending}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <MapPin className="w-4 h-4 text-indigo-600" />
                                        Điểm đến
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.destination}
                                        onChange={(e) => handleChange("destination", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        disabled={isPending}
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Clock className="w-4 h-4 text-indigo-600" />
                                        Thời gian
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => handleChange("duration", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Giá & Số lượng</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    Giá người lớn
                                </label>
                                <input
                                    type="number"
                                    value={formData.priceAdult}
                                    onChange={(e) => handleChange("priceAdult", Number(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    disabled={isPending}
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 text-blue-600" />
                                    Giá trẻ em
                                </label>
                                <input
                                    type="number"
                                    value={formData.priceChild}
                                    onChange={(e) => handleChange("priceChild", Number(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    disabled={isPending}
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Users className="w-4 h-4 text-purple-600" />
                                    Số lượng ban đầu
                                </label>
                                <input
                                    type="number"
                                    value={formData.initialQuantity}
                                    onChange={(e) => handleChange("initialQuantity", Number(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    disabled={isPending}
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Users className="w-4 h-4 text-orange-600" />
                                    Số chỗ còn lại
                                </label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => handleChange("quantity", Number(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    disabled={isPending}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Ngày khởi hành</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 text-indigo-600" />
                                    Ngày bắt đầu
                                </label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => handleChange("startDate", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    disabled={isPending}
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 text-indigo-600" />
                                    Ngày kết thúc
                                </label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => handleChange("endDate", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    disabled={isPending}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Hình ảnh</h2>
                                <p className="text-sm text-gray-500 mt-1">Quản lý ảnh hiện tại và thêm ảnh mới</p>
                            </div>
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    disabled={isPending}
                                />
                                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                    <Upload size={16} />
                                    Thêm ảnh mới
                                </div>
                            </label>
                        </div>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Ảnh hiện tại ({existingImages.length})</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {existingImages.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Existing ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                disabled={isPending}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Images Preview */}
                        {previewUrls.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Ảnh mới ({previewUrls.length})</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border-2 border-green-400"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                disabled={isPending}
                                            >
                                                <X size={16} />
                                            </button>
                                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded font-semibold">
                                                MỚI
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {existingImages.length === 0 && previewUrls.length === 0 && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Chưa có ảnh nào</p>
                            </div>
                        )}

                        {isUploading && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                                <Loader className="animate-spin text-blue-600" size={20} />
                                <span className="text-blue-600 font-medium">Đang upload ảnh mới...</span>
                            </div>
                        )}
                    </div>

                    {/* Itinerary */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Lịch trình</h2>
                            <button
                                type="button"
                                onClick={() => addArrayItem("itinerary")}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                disabled={isPending}
                            >
                                <Plus size={16} />
                                Thêm ngày
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.itinerary.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleArrayChange("itinerary", index, e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        disabled={isPending}
                                    />
                                    {formData.itinerary.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem("itinerary", index)}
                                            className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            disabled={isPending}
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/tours")}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                            disabled={isPending}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <Loader className="animate-spin" size={20} />
                                    {isUploading ? "Đang upload..." : "Đang cập nhật..."}
                                </>
                            ) : (
                                "Cập nhật tour"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTourPage;