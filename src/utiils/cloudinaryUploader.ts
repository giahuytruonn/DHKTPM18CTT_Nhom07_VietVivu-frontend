import axios from 'axios';

// Cấu hình Cloudinary (Sử dụng CLOUD_NAME từ yêu cầu của người dùng)
const CLOUD_NAME = 'dpyshymwv'; 
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;
// Sử dụng upload preset mặc định 'ml_default' cho unsigned upload. 
// Trong ứng dụng thực tế, bạn nên cấu hình upload_preset riêng cho mục đích bảo mật.
const UPLOAD_PRESET = 'vietvivu'; 

/**
 * Tải lên file video lên Cloudinary.
 * @param file File video được chọn.
 * @returns Promise<string> URL an toàn của video đã tải lên.
 */
export const uploadVideoToCloudinary = async (file: File): Promise<string> => {
    if (!file) {
        throw new Error("Không có file nào được chọn.");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    // Tùy chọn: Thêm folder để dễ quản lý
    formData.append('folder', 'vietvivu_explore_videos');

    try {
        const response = await axios.post(UPLOAD_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            // Bạn có thể thêm onUploadProgress ở đây để hiển thị thanh tiến trình
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                console.log(`Đang tải lên Cloudinary: ${percentCompleted}%`);
            }
        });

        const videoUrl = response.data.secure_url;
        if (!videoUrl) {
            throw new Error("Cloudinary không trả về URL video.");
        }
        return videoUrl;

    } catch (error) {
        console.error("Lỗi khi tải video lên Cloudinary:", error);
        throw new Error("Tải video lên Cloudinary thất bại. Vui lòng kiểm tra console.");
    }
};