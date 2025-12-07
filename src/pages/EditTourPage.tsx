import React, { useState, useEffect, useRef } from "react";
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

// Danh sách điểm đến phổ biến ở Việt Nam
const POPULAR_DESTINATIONS = [
    // MIỀN BẮC
    "Hà Nội", "Phố cổ Hà Nội", "Hồ Gươm", "Văn Miếu Quốc Tử Giám", "Lăng Bác", "Hồ Tây", "Cầu Long Biên", "Phố đi bộ Hà Nội", "Làng cổ Đường Lâm", "Làng gốm Bát Tràng", "Chùa Một Cột", "Ba Vì", "Tam Đảo (Vĩnh Phúc)",

    "Hạ Long", "Vịnh Hạ Long", "Đảo Tuần Châu", "Đảo Cô Tô", "Đảo Quan Lạn", "Vân Đồn", "Bãi Cháy", "Sun World Hạ Long",

    "Sapa", "Fansipan", "Bản Cát Cát", "Thác Bạc", "Cầu Mây", "Ô Quy Hồ", "Hàm Rồng", "Tả Van", "Lao Chải",

    "Ninh Bình", "Tràng An", "Tam Cốc Bích Động", "Chùa Bái Đính", "Hang Múa", "Cố đô Hoa Lư", "Vườn quốc gia Cúc Phương", "Động Am Tiên", "Tuyệt Tình Cốc",

    "Hà Giang", "Cột cờ Lũng Cú", "Đèo Mã Pí Lèng", "Sông Nho Quế", "Phó Bảng", "Đồng Văn", "Mèo Vạc", "Dinh thự vua Mèo",

    "Cao Bằng", "Thác Bản Giốc", "Động Ngườm Ngao", "Pác Bó", "Hồ Thang Hen",

    "Lạng Sơn", "Mẫu Sơn", "Động Tam Thanh", "Nàng Tô Thị",

    "Bắc Kạn", "Hồ Ba Bể", "Động Hua Mạ",

    "Mộc Châu", "Đồi chè trái tim", "Thác Dải Yếm", "Rừng thông Bản Áng", "Hang Dơi", "Cầu kính Bạch Long",

    "Mai Châu", "Bản Lác", "Đèo Thung Khe",

    "Điện Biên", "Cánh đồng Mường Thanh", "Đèo Pha Đin", "Bảo tàng Chiến thắng Điện Biên Phủ",

    "Lào Cai", "Cốc Ly", "Bắc Hà (chợ phiên)",

    "Yên Bái", "Mù Cang Chải", "Ruộng bậc thang Mù Cang Chải", "Thác Pú Nhu",

    "Phú Thọ", "Đền Hùng", "Việt Trì", "Hùng Vương",

    "Hòa Bình", "Thung Nai", "Mai Châu Valley View", "Thác Thăng Thiên", "Động Thiên Long",

    "Thái Nguyên", "Hồ Núi Cốc", "Đồi chè Tân Cương", "Hang Phượng Hoàng",

    "Bắc Ninh", "Làng quan họ Kinh Bắc", "Chùa Phật Tích", "Làng gốm Phù Lãng",

    "Hải Phòng", "Cát Bà", "Đảo Cát Bà", "Vịnh Lan Hạ", "Đồ Sơn", "Đảo Bạch Long Vĩ", "Phố cổ Hải Phòng",

    "Nam Định", "Phủ Dầy", "Chùa Phổ Minh", "Nhà thờ đổ Hải Lý",

    "Thái Bình", "Chùa Keo", "Bãi biển Cồn Đen",

    "Hưng Yên", "Phố Hiến", "Đền Mẫu Hưng Yên", "Làng nghề tranh Đông Hồ",

    // MIỀN TRUNG
    "Huế", "Đại Nội Huế", "Kinh thành Huế", "Lăng Tự Đức", "Lăng Khải Định", "Sông Hương", "Cầu Trường Tiền", "Chùa Thiên Mụ", "Đồi Vọng Cảnh", "Bãi biển Lăng Cô", "Đèo Hải Vân",

    "Đà Nẵng", "Bà Nà Hills", "Cầu Rồng", "Cầu Vàng", "Biển Mỹ Khê", "Ngũ Hành Sơn", "Hội An (gần)", "Bán đảo Sơn Trà", "Chùa Linh Ứng", "Asia Park", "Bãi biển Non Nước",

    "Hội An", "Phố cổ Hội An", "Chùa Cầu", "Làng rau Trà Quế", "Làng gốm Thanh Hà", "Rừng dừa Bảy Mẫu", "Bãi biển An Bàng", "Bãi biển Cửa Đại",

    "Quảng Nam", "Thánh địa Mỹ Sơn", "Cù Lao Chàm", "Đảo Cù Lao Chàm",

    "Quảng Ngãi", "Lý Sơn", "Đảo Lý Sơn", "Núi Thới Lới", "Sa Huỳnh",

    "Bình Định", "Quy Nhơn", "Eo Gió", "Kỳ Co", "Ghềnh Ráng Tiên Sa", "Tháp Đôi", "Tháp Bánh Ít", "Bãi biển Quy Nhơn", "Hòn Khô",

    "Phú Yên", "Gành Đá Dĩa", "Đầm Ô Loan", "Vịnh Vũng Rô", "Bãi Xép", "Hòn Yến", "Mũi Điện (Đại Lãnh)", "Tháp Nhạn",

    "Khánh Hòa", "Nha Trang", "Vinpearl Nha Trang", "Vịnh Nha Trang", "Hòn Chồng", "Tháp Bà Ponagar", "Bãi Dài", "Đảo Bình Ba", "Đảo Bình Hưng", "Điệp Sơn", "Đảo Khỉ", "Hòn Tằm",

    "Ninh Thuận", "Vịnh Vĩnh Hy", "Hang Rái", "Tháp Po Klong Garai", "Bãi biển Ninh Chữ", "Mũi Dinh", "Đồi cát Nam Cương",

    "Bình Thuận", "Phan Thiết", "Mũi Né", "Đồi cát bay Mũi Né", "Bãi đá Cổ Thạch", "Suối Tiên Mũi Né", "Lâu đài rượu vang", "Hòn Rơm", "Tháp Chàm Poshanư", "Bàu Trắng",

    "Đà Lạt", "Lâm Đồng", "Hồ Xuân Hương", "Thung lũng Tình Yêu", "Đồi chè Cầu Đất", "Hồ Tuyền Lâm", "Thác Datanla", "Thác Prenn", "Nhà thờ Domain De Marie", "Ga Đà Lạt", "Quảng trường Lâm Viên", "Cây thông cô đơn", "Ma Rừng Lữ Quán", "Hồ Dankia - Suối Vàng",

    // MIỀN NAM
    "TP. Hồ Chí Minh", "Sài Gòn", "Dinh Độc Lập", "Nhà thờ Đức Bà", "Bưu điện Thành phố", "Phố đi bộ Nguyễn Huệ", "Bitexco", "Landmark 81", "Chợ Bến Thành", "Phố Tây Bùi Viện", "Địa đạo Củ Chi", "Suối Tiên", "Công viên Đầm Sen",

    "Vũng Tàu", "Bãi Sau", "Bãi Trước", "Tượng Chúa Kitô", "Hòn Bà", "Ngọn Hải Đăng", "Đồi Con Heo", "Cáp treo Núi Lớn",

    "Phú Quốc", "Bãi Sao", "Grand World Phú Quốc", "Safari Phú Quốc", "Cáp treo Hòn Thơm", "Sunset Sanato Beach Club", "Làng chài Rạch Vẹm", "Hòn Móng Tay", "Dinh Cậu", "Chợ đêm Phú Quốc", "Nhà tù Phú Quốc",

    "Côn Đảo", "Bà Rịa - Vũng Tàu", "Bãi Đầm Trầu", "Mũi Cá Mập", "Hòn Bảy Cạnh", "Nhà tù Côn Đảo", "Chùa Núi Một",

    "Cần Thơ", "Chợ nổi Cái Răng", "Bến Ninh Kiều", "Nhà cổ Bình Thủy", "Vườn cò Bằng Lăng", "Chợ đêm Cần Thơ",

    "An Giang", "Châu Đốc", "Rừng tràm Trà Sư", "Chợ nổi Long Xuyên", "Miếu Bà Chúa Xứ", "Cánh đồng quạt chong chóng", "Núi Cấm", "Hồ Tà Pạ", "Hồ Soài So",

    "Kiên Giang", "Rạch Giá", "Hà Tiên", "Đảo Nam Du", "Hòn Sơn", "Thạch Động", "Mũi Nai", "Chùa Hang",

    "Long An", "Làng cổ Phước Lộc Thọ", "Nhà Trăm Cột", "Chùa Vĩnh Tràng (Tiền Giang gần)",

    "Tiền Giang", "Cù lao Thới Sơn", "Chùa Vĩnh Tràng", "Cái Bè",

    "Bến Tre", "Cồn Phụng", "Cồn Quy", "Sân chim Vàm Hồ", "Bãi biển Bình Châu",

    "Trà Vinh", "Chùa Âng", "Ao Bà Om", "Biển Ba Động",

    "Vĩnh Long", "Cù lao An Bình", "Chợ nổi Trà Ôn",

    "Đồng Tháp", "Cao Lãnh", "Sa Đéc", "Làng hoa Sa Đéc", "Vườn quốc gia Tràm Chim", "Gáo Giồng", "Nhà cổ Huỳnh Thủy Lê",

    "Sóc Trăng", "Chùa Dơi", "Chùa Chén Kiểu", "Chợ nổi Ngã Năm",

    "Bạc Liêu", "Nhà Công tử Bạc Liêu", "Vườn chim Bạc Liêu", "Cánh đồng quạt gió",

    "Cà Mau", "Mũi Cà Mau", "Đất Mũi", "Hòn Khoai", "Rừng U Minh Hạ", "Chợ nổi Cà Mau",

    "Đồng Nai", "Thác Giang Điền", "Thác Mai", "Vườn quốc gia Cát Tiên", "Bửu Long",

    "Bình Dương", "Làng tre Phú An", "Hồ Đại Nam", "Chùa Bà Thiên Hậu",

    "Bình Phước", "Núi Bà Rá", "Vườn quốc gia Bù Gia Mập", "Hồ Suối Giai",

    "Tây Ninh", "Núi Bà Đen", "Tòa Thánh Cao Đài", "Hồ Dầu Tiếng", "Ma Thiên Lãnh",

    "Lâm Đồng", "Bảo Lộc", "Thác Đambri", "Đồi chè Tâm Châu",
];

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
    durationDays: number;
    durationNights: number;
    selectedDestinations: string[];
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
        durationDays: 0,
        durationNights: 0,
        selectedDestinations: [],
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    // Autocomplete states
    const [destinationInput, setDestinationInput] = useState("");
    const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
    const [filteredDestinations, setFilteredDestinations] = useState<string[]>([]);
    const destinationRef = useRef<HTMLDivElement>(null);

    // Helper functions for date formatting
    const formatDateForDisplay = (dateStr: string) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    const formatApiDateToInputDate = (apiDate: string | null): string => {
        if (!apiDate) return "";
        const parts = apiDate.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        if (apiDate.includes('-')) {
            return apiDate;
        }
        return "";
    };

    // Parse duration string to extract days and nights
    const parseDuration = (durationStr: string) => {
        const match = durationStr.match(/(\d+)N(\d+)Đ/i);
        if (match) {
            return {
                days: parseInt(match[1]),
                nights: parseInt(match[2])
            };
        }
        return { days: 0, nights: 0 };
    };

    // Fetch tour data
    const { data: tour, isLoading } = useQuery({
        queryKey: ["tour", tourId],
        queryFn: () => getTourById(tourId!),
        enabled: !!tourId,
    });

    // Load tour data into form
    useEffect(() => {
        if (tour) {
            const { days, nights } = parseDuration(tour.duration || "");
            const destinations = tour.destination ? tour.destination.split(" - ") : [];

            setFormData({
                title: tour.title || "",
                description: tour.description || "",
                initialQuantity: tour.initialQuantity || 0,
                quantity: tour.quantity || 0,
                priceAdult: tour.priceAdult || 0,
                priceChild: tour.priceChild || 0,
                duration: tour.duration || "",
                destination: tour.destination || "",
                startDate: formatApiDateToInputDate(tour.startDate),
                endDate: formatApiDateToInputDate(tour.endDate),
                itinerary: tour.itinerary && tour.itinerary.length > 0 ? tour.itinerary : [""],
                imageUrls: tour.imageUrls || [],
                durationDays: days,
                durationNights: nights,
                selectedDestinations: destinations,
            });
            setExistingImages(tour.imageUrls || []);
        }
    }, [tour]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
                setShowDestinationSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-update duration string and itinerary
    useEffect(() => {
        const { durationDays, durationNights } = formData;

        if (durationDays > 0) {
            const durationStr = `${durationDays}N${durationNights}Đ`;
            const newItinerary = Array.from({ length: durationDays }, (_, i) =>
                formData.itinerary[i] || ""
            );

            setFormData(prev => ({
                ...prev,
                duration: durationStr,
                itinerary: newItinerary
            }));
        }
    }, [formData.durationDays, formData.durationNights]);

    // Auto-update endDate
    useEffect(() => {
        if (formData.startDate && formData.durationDays > 0) {
            const start = new Date(formData.startDate);
            start.setDate(start.getDate() + formData.durationDays - 1);
            const endDateStr = start.toISOString().split('T')[0];

            setFormData(prev => ({
                ...prev,
                endDate: endDateStr
            }));
        }
    }, [formData.startDate, formData.durationDays]);

    // Auto-update child price
    useEffect(() => {
        if (formData.priceAdult > 0) {
            const calculatedChildPrice = Math.round(formData.priceAdult * 0.5);
            setFormData(prev => ({
                ...prev,
                priceChild: calculatedChildPrice
            }));
        }
    }, [formData.priceAdult]);

    // Auto-update destination string
    useEffect(() => {
        if (formData.selectedDestinations.length > 0) {
            const destinationStr = formData.selectedDestinations.join(" - ");
            setFormData(prev => ({
                ...prev,
                destination: destinationStr
            }));
        }
    }, [formData.selectedDestinations]);

    // Destination autocomplete handlers
    const handleDestinationInputChange = (value: string) => {
        setDestinationInput(value);

        if (value.trim()) {
            const filtered = POPULAR_DESTINATIONS.filter(dest =>
                dest.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredDestinations(filtered);
            setShowDestinationSuggestions(true);
        } else {
            setFilteredDestinations(POPULAR_DESTINATIONS);
            setShowDestinationSuggestions(false);
        }
    };

    const addDestination = (destination: string) => {
        if (!formData.selectedDestinations.includes(destination)) {
            setFormData(prev => ({
                ...prev,
                selectedDestinations: [...prev.selectedDestinations, destination]
            }));
        }
        setDestinationInput("");
        setShowDestinationSuggestions(false);
    };

    const removeDestination = (index: number) => {
        setFormData(prev => ({
            ...prev,
            selectedDestinations: prev.selectedDestinations.filter((_, i) => i !== index)
        }));
    };

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

    // Remove existing image
    const removeExistingImage = async (index: number) => {
        const imageUrl = existingImages[index];

        try {
            await deleteImageFromCloudinary(imageUrl);
            setExistingImages(prev => prev.filter((_, i) => i !== index));
            toast.success("Đã xóa ảnh");
        } catch (error) {
            console.error("Failed to delete image:", error);
            toast.error("Lỗi khi xóa ảnh");
        }
    };

    const updateTourMutation = useMutation({
        mutationFn: async (data: TourFormData) => {
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

            const allImageUrls = [...existingImages, ...newUploadedUrls];

            const cleanData = {
                ...data,
                itinerary: data.itinerary.filter(item => item.trim() !== ""),
                imageUrls: allImageUrls,
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

    const isPending = updateTourMutation.isPending || isUploading;

    const [customDestinations, setCustomDestinations] = useState<string[]>([]);

    // Thêm function addCustomDestination (sau function addDestination, khoảng dòng 250):
    const addCustomDestination = () => {
        const trimmedInput = destinationInput.trim();
        if (trimmedInput && !formData.selectedDestinations.includes(trimmedInput)) {
            setFormData(prev => ({
                ...prev,
                selectedDestinations: [...prev.selectedDestinations, trimmedInput]
            }));
            if (!customDestinations.includes(trimmedInput)) {
                setCustomDestinations(prev => [...prev, trimmedInput]);
            }
            setDestinationInput("");
            setShowDestinationSuggestions(false);
            toast.success(`Đã thêm điểm đến: ${trimmedInput}`);
        }
    };

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

                            {/* Destination with Autocomplete */}
                            <div ref={destinationRef} className="relative">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 text-indigo-600" />
                                    Điểm đến
                                </label>

                                {formData.selectedDestinations.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.selectedDestinations.map((dest, index) => (
                                            <div key={index} className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                                                <span>{dest}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDestination(index)}
                                                    className="hover:bg-indigo-200 rounded-full p-0.5"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <input
                                    type="text"
                                    value={destinationInput}
                                    onChange={(e) => handleDestinationInputChange(e.target.value)}
                                    onFocus={() => {
                                        setFilteredDestinations(POPULAR_DESTINATIONS);
                                        setShowDestinationSuggestions(true);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Tìm và chọn điểm đến..."
                                    disabled={isPending}
                                />

                                {showDestinationSuggestions && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {/* Hiện danh sách gợi ý nếu có */}
                                        {filteredDestinations.length > 0 && filteredDestinations.map((dest, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => addDestination(dest)}
                                                className="w-full px-4 py-2 text-left hover:bg-indigo-50 transition-colors flex items-center gap-2"
                                                disabled={formData.selectedDestinations.includes(dest)}
                                            >
                                                <MapPin size={14} className="text-indigo-600" />
                                                <span className={formData.selectedDestinations.includes(dest) ? "text-gray-400" : ""}>
                                                    {dest}
                                                </span>
                                                {formData.selectedDestinations.includes(dest) && (
                                                    <span className="ml-auto text-xs text-gray-400">Đã chọn</span>
                                                )}
                                            </button>
                                        ))}

                                        {/* Luôn hiện nút "Thêm điểm đến" khi có text */}
                                        {destinationInput.trim() && (
                                            <button
                                                type="button"
                                                onClick={addCustomDestination}
                                                className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center gap-2 border-t border-gray-200"
                                            >
                                                <Plus size={16} className="text-green-600" />
                                                <span className="text-green-600 font-medium">
                                                    Thêm điểm đến: "{destinationInput}"
                                                </span>
                                            </button>
                                        )}

                                        {/* Thông báo khi không có kết quả và không có text */}
                                        {filteredDestinations.length === 0 && !destinationInput.trim() && (
                                            <div className="px-4 py-3 text-gray-500 text-sm text-center">
                                                Không tìm thấy địa điểm
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Duration - Smart input */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Clock className="w-4 h-4 text-indigo-600" />
                                    Thời gian
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.durationDays || ""}
                                            onChange={(e) => {
                                                const days = Number(e.target.value);
                                                const nights = days > 0 ? days - 1 : 0;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    durationDays: days,
                                                    durationNights: nights
                                                }));
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Số ngày"
                                            disabled={isPending}
                                        />
                                    </div>
                                    <div className="flex items-center px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg min-w-[120px]">
                                        <span className="text-gray-700 font-medium">
                                            {formData.durationDays > 0
                                                ? `${formData.durationDays}N${formData.durationNights}Đ`
                                                : "0N0Đ"
                                            }
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Nhập số ngày, số đêm sẽ tự động tính</p>
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
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formData.priceAdult || ""}
                                        onChange={(e) => handleChange("priceAdult", Number(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        disabled={isPending}
                                    />
                                    {formData.priceAdult > 0 && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                            {formData.priceAdult.toLocaleString('vi-VN')} đ
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 text-blue-600" />
                                    Giá trẻ em
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formData.priceChild || ""}
                                        onChange={(e) => handleChange("priceChild", Number(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Tự động = 50% giá người lớn"
                                        disabled={isPending}
                                    />
                                    {formData.priceChild > 0 && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                            {formData.priceChild.toLocaleString('vi-VN')} đ
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Mặc định = 50% giá người lớn</p>
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
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => handleChange("startDate", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        disabled={isPending}
                                    />
                                    {formData.startDate && (
                                        <div className="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-gray-600 bg-white px-2 pointer-events-none">
                                            {formatDateForDisplay(formData.startDate)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 text-indigo-600" />
                                    Ngày kết thúc
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.endDate ? formatDateForDisplay(formData.endDate) : ""}
                                        readOnly
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-700"
                                        placeholder="Tự động tính"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Tự động tính từ ngày bắt đầu + thời gian tour</p>
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
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Lịch trình</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {formData.durationDays > 0
                                        ? `${formData.durationDays} ngày - Nhập hoạt động cho từng ngày`
                                        : "Nhập số ngày ở phần Thời gian để tạo lịch trình"
                                    }
                                </p>
                            </div>
                        </div>

                        {formData.durationDays > 0 ? (
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
                                            placeholder={`Ngày ${index + 1}: VD: Khám phá phố cổ Hội An, tắm biển An Bàng...`}
                                            disabled={isPending}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Vui lòng nhập số ngày ở phần Thời gian</p>
                                <p className="text-sm text-gray-400 mt-1">Lịch trình sẽ tự động hiển thị theo số ngày</p>
                            </div>
                        )}
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