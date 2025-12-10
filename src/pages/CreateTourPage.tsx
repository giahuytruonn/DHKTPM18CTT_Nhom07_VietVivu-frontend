// src/pages/admin/CreateTourPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  Plus,
  X,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Users,
  Image as ImageIcon,
  Upload,
  Loader,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { uploadImagesToCloudinary } from "../services/upload.service";

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

const CreateTourPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TourFormData>({
    title: "",
    description: "",
    initialQuantity: 50,
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
  const [errors, setErrors] = useState<Partial<Record<keyof TourFormData, string>>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  // Autocomplete states
  const [destinationInput, setDestinationInput] = useState("");
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState<string[]>([]);
  const [customDestinations, setCustomDestinations] = useState<string[]>([]);
  const destinationRef = useRef<HTMLDivElement>(null);
  // Tính toán ngày tối thiểu (ngày mai)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 4);
  const minDateString = minDate.toISOString().split('T')[0];
  // Helper function: Convert yyyy-mm-dd to dd/mm/yyyy for display
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };
  // Helper function: Convert dd/mm/yyyy to yyyy-mm-dd for storage
  const formatDateForStorage = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };
  // Click outside handler for destination autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // Tự động tính toán duration string và itinerary khi days/nights thay đổi
  useEffect(() => {
    const { durationDays, durationNights } = formData;
    if (durationDays > 0) {
      const durationStr = `${durationDays}N${durationNights}Đ`;
      // Tạo mảng itinerary theo số ngày
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
  // Tự động tính endDate khi có startDate và duration
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
  // Tự động tính giá trẻ em (50% giá người lớn)
  useEffect(() => {
    if (formData.priceAdult > 0) {
      const calculatedChildPrice = Math.round(formData.priceAdult * 0.5);
      setFormData(prev => ({
        ...prev,
        priceChild: calculatedChildPrice
      }));
    }
  }, [formData.priceAdult]);
  // Tự động tính destination string từ selectedDestinations
  useEffect(() => {
    if (formData.selectedDestinations.length > 0) {
      const destinationStr = formData.selectedDestinations.join(" - ");
      setFormData(prev => ({
        ...prev,
        destination: destinationStr
      }));
    }
  }, [formData.selectedDestinations]);
  // Filter destinations based on input
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
  // Add destination to selected list
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
  // Add custom destination
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
  // Remove destination from selected list
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
  // Remove image from selection
  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  const createTourMutation = useMutation({
    mutationFn: async (data: TourFormData) => {
      let uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        try {
          uploadedUrls = await uploadImagesToCloudinary(selectedFiles);
          toast.success(`Đã upload ${uploadedUrls.length} ảnh thành công`);
        } catch (error) {
          toast.error("Lỗi khi upload ảnh");
          throw error;
        } finally {
          setIsUploading(false);
        }
      }
      const cleanData = {
        ...data,
        itinerary: data.itinerary.filter(item => item.trim() !== ""),
        imageUrls: uploadedUrls,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
      };
      const response = await api.post("/tours", cleanData);
      return response.data;
    },
    onSuccess: () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      toast.success("Tạo tour thành công!");
      navigate("/admin/tours");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi tạo tour";
      toast.error(errorMessage);
      console.error("Create tour error:", error);
    },
  });
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TourFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = "Tiêu đề không được để trống";
    if (!formData.description.trim()) newErrors.description = "Mô tả không được để trống";
    if (formData.initialQuantity <= 0) newErrors.initialQuantity = "Số lượng phải lớn hơn 0";
    if (formData.priceAdult <= 0) newErrors.priceAdult = "Giá người lớn phải lớn hơn 0";
    if (formData.priceChild < 0) newErrors.priceChild = "Giá trẻ em không được âm";
    if (!formData.duration.trim()) newErrors.duration = "Thời gian không được để trống";
    if (!formData.destination.trim()) newErrors.destination = "Điểm đến không được để trống";
    if (!formData.startDate) newErrors.startDate = "Ngày khởi hành không được để trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof TourFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  const handleArrayChange = (field: 'itinerary', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };
  const isPending = createTourMutation.isPending || isUploading;

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh");
      return;
    }
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const confirmCreateTour = () => {
    setShowConfirmModal(false);
    createTourMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/tours")}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Quay lại danh sách</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Tạo Tour Mới</h1>
          <p className="text-gray-600 mt-2">Điền thông tin để tạo tour du lịch mới</p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin cơ bản</h2>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề tour <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.title ? "border-red-500" : "border-gray-300"}`}
                  placeholder="VD: Du lịch Đà Nẵng - Hội An 3N2Đ"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.description ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Mô tả chi tiết về tour..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              {/* Destination with Autocomplete */}
              <div ref={destinationRef} className="relative">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-indigo-600" /> Điểm đến <span className="text-red-500">*</span>
                </label>

                {/* Selected destinations */}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.destination ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Tìm và chọn điểm đến..."
                />

                {/* Suggestions dropdown */}
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

                {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
              </div>

              {/* Duration - Smart input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Thời gian <span className="text-red-500">*</span>
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.duration ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Số ngày"
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
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                <p className="text-xs text-gray-500 mt-1">Nhập số ngày, số đêm sẽ tự động tính</p>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Giá & Số lượng</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Giá người lớn <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.priceAdult || ""}
                    onChange={(e) => handleChange("priceAdult", Number(e.target.value))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.priceAdult ? "border-red-500" : "border-gray-300"}`}
                    placeholder="2000000"
                  />
                  {formData.priceAdult > 0 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                      {formData.priceAdult.toLocaleString('vi-VN')} đ
                    </div>
                  )}
                </div>
                {errors.priceAdult && <p className="text-red-500 text-sm mt-1">{errors.priceAdult}</p>}
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
                  Số lượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.initialQuantity}
                  onChange={(e) => handleChange("initialQuantity", Number(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.initialQuantity ? "border-red-500" : "border-gray-300"}`}
                  placeholder="50"
                />
                {errors.initialQuantity && <p className="text-red-500 text-sm mt-1">{errors.initialQuantity}</p>}
              </div>
            </div>
          </div>

          {/* Dates Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ngày khởi hành</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={minDateString}
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.startDate ? "border-red-500" : "border-gray-300"}`}
                  />
                  {formData.startDate && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-gray-600 bg-white px-2 pointer-events-none">
                      {formatDateForDisplay(formData.startDate)}
                    </div>
                  )}
                </div>
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                <p className="text-xs text-gray-500 mt-1">Tối thiểu sau 3 ngày từ ngày hiện tại</p>
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

          {/* Images Upload Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Hình ảnh</h2>
                <p className="text-sm text-gray-500 mt-1">Upload ảnh từ máy tính (tối đa 5MB/ảnh)</p>
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
                  Chọn ảnh
                </div>
              </label>
            </div>

            {/* Preview Grid */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={isPending}
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                      {selectedFiles[index].name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {previewUrls.length === 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chưa có ảnh nào được chọn</p>
                <p className="text-sm text-gray-400 mt-1">Click "Chọn ảnh" để upload</p>
              </div>
            )}

            {isUploading && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                <Loader className="animate-spin text-blue-600" size={20} />
                <span className="text-blue-600 font-medium">Đang upload ảnh lên Cloudinary...</span>
              </div>
            )}
          </div>

          {/* Itinerary Card */}
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

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/tours")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              disabled={isPending}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  {isUploading ? "Đang upload ảnh..." : "Đang tạo tour..."}
                </>
              ) : (
                "Tạo tour"
              )}
            </button>
          </div>
        </form>
      </div>
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Xác nhận tạo tour</h3>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-gray-600">
                Bạn có chắc chắn muốn tạo tour <span className="font-semibold">"{formData.title}"</span>?
              </p>
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <p><span className="font-medium">Điểm đến:</span> {formData.destination}</p>
                <p><span className="font-medium">Thời gian:</span> {formData.duration}</p>
                <p><span className="font-medium">Giá:</span> {formData.priceAdult.toLocaleString('vi-VN')}₫</p>
                <p><span className="font-medium">Số lượng:</span> {formData.initialQuantity} chỗ</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmCreateTour}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-colors"
              >
                Xác nhận tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTourPage;