import axios from "axios";

const CLOUDINARY_CLOUD_NAME = "dpyshymwv";
const CLOUDINARY_UPLOAD_PRESET = "dpyshymwv";

export interface UploadResponse {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
}

/**
 * Upload ảnh lên Cloudinary
 * @param file File ảnh cần upload
 * @returns URL của ảnh đã upload
 */
export const uploadImageToCloudinary = async (
    file: File
): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "vietvivu/tours"); // Tổ chức ảnh vào folder

    try {
        const response = await axios.post<UploadResponse>(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data.secure_url;
    } catch (error: any) {
        console.error("Cloudinary upload error:", error);
        throw new Error(
            error.response?.data?.error?.message || "Failed to upload image"
        );
    }
};

/**
 * Upload nhiều ảnh cùng lúc
 * @param files Mảng các file ảnh
 * @returns Mảng URL của các ảnh đã upload
 */
export const uploadMultipleImages = async (
    files: File[]
): Promise<string[]> => {
    try {
        const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
        const urls = await Promise.all(uploadPromises);
        return urls;
    } catch (error) {
        console.error("Multiple upload error:", error);
        throw error;
    }
};

/**
 * Xóa ảnh từ Cloudinary bằng public_id
 * @param publicId Public ID của ảnh trên Cloudinary
 */
export const deleteImageFromCloudinary = async (
    publicId: string
): Promise<void> => {
    // Note: Xóa ảnh cần API key & secret nên phải thực hiện ở backend
    // Đây chỉ là placeholder, bạn cần implement API endpoint ở backend
    console.warn("Delete image should be implemented on backend");
};