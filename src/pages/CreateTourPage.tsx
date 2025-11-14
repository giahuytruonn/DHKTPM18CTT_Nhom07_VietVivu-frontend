import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { 
  ArrowLeft, Plus, X, Calendar, DollarSign, MapPin, 
  Clock, Users, Image as ImageIcon, Upload, Loader 
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { uploadImagesToCloudinary } from "../services/upload.service";

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
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TourFormData, string>>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Validate file types
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} không phải là file ảnh`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} quá lớn (> 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  // Remove image from selection
  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    // Revoke old preview URL to prevent memory leak
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const createTourMutation = useMutation({
    mutationFn: async (data: TourFormData) => {
      // Upload images first
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

      // Create tour with uploaded image URLs
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
      // Clean up preview URLs
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ảnh");
      return;
    }
    
    if (validateForm()) {
      createTourMutation.mutate(formData);
    }
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

  const isPending = createTourMutation.isPending || isUploading;
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Mô tả chi tiết về tour..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Destination & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    Điểm đến <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => handleChange("destination", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      errors.destination ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Đà Nẵng - Hội An"
                  />
                  {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Thời gian <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      errors.duration ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="3N-2D hoặc 3 ngày 2 đêm"
                  />
                  {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                </div>
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
                <input
                  type="number"
                  value={formData.priceAdult}
                  onChange={(e) => handleChange("priceAdult", Number(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    errors.priceAdult ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="2000000"
                />
                {errors.priceAdult && <p className="text-red-500 text-sm mt-1">{errors.priceAdult}</p>}
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
                  placeholder="1000000"
                />
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    errors.initialQuantity ? "border-red-500" : "border-gray-300"
                  }`}
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
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    errors.startDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Ngày kết thúc (tùy chọn)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">Để trống để tự động tính từ thời gian tour</p>
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
              <h2 className="text-xl font-bold text-gray-900">Lịch trình</h2>
              <button
                type="button"
                onClick={() => addArrayItem("itinerary")}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
                    placeholder={`Ngày ${index + 1}: Mô tả hoạt động...`}
                    disabled={isPending}
                  />
                  {formData.itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("itinerary", index)}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={isPending}
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
    </div>
  );
};

export default CreateTourPage;