import axios from 'axios';

// Cấu hình Cloudinary (Sử dụng CLOUD_NAME từ yêu cầu của người dùng)
const CLOUD_NAME = 'dpyshymwv'; 
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;
const UPLOAD_PRESET = 'vietvivu'; 

/**
 * Tải lên file video lên Cloudinary.
 * @param file File video được chọn.
 * @param onProgress Callback để cập nhật tiến trình tải lên (0-100).
 * @returns Promise<string> URL an toàn của video đã tải lên.
 */
export const uploadVideoToCloudinary = async (
    file: File, 
    onProgress: (progress: number) => void // THÊM CALLBACK NÀY
): Promise<string> => {
    if (!file) {
        throw new Error("Không có file nào được chọn.");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'vietvivu_explore_videos');

    try {
        const response = await axios.post(UPLOAD_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            // SỬ DỤNG onUploadProgress CỦA AXIOS
            onUploadProgress: (progressEvent) => {
                const total = progressEvent.total || 1;
                const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
                
                // GỌI CALLBACK ĐỂ CẬP NHẬT TRẠNG THÁI TRONG COMPONENT
                onProgress(percentCompleted); 
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

// *LƯU Ý VỀ TỐC ĐỘ: Để tăng tốc độ thực tế, bạn nên xem xét **Nén video client-side** (như đã đề xuất trước đó) trước khi gọi hàm này. Cloudinary sẽ tự động tối ưu hóa đường truyền, nhưng việc giảm kích thước file là chìa khóa.*