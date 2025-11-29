// src/utiils/cloudinaryOptimizer.ts
const CLOUDINARY_UPLOAD_MARKER = "/upload/";

/**
 * Thêm các biến đổi tối ưu vào URL Cloudinary.
 * @param url URL video gốc từ Cloudinary
 * @param transformations Chuỗi biến đổi (ví dụ: "f_auto,q_auto:good")
 * @returns URL đã được tối ưu
 */
export const optimizeCloudinaryUrl = (
  url: string,
  transformations: string = "f_auto,q_auto:good" // Tối ưu mặc định
): string => {
  if (!url || !url.includes(CLOUDINARY_UPLOAD_MARKER)) {
    return url; // Trả về URL gốc nếu không phải URL Cloudinary hợp lệ
  }

  const parts = url.split(CLOUDINARY_UPLOAD_MARKER);
  // parts[0] = "https://res.cloudinary.com/...";
  // parts[1] = "v123456/folder/video.mp4";

  // SỬA LỖI: Đổi CLOUDINARY_UPLOAD_MARKTER (sai) thành CLOUDINARY_UPLOAD_MARKER (đúng)
  return `${parts[0]}${CLOUDINARY_UPLOAD_MARKER}${transformations}/${parts[1]}`;
};

/**
 * Tạo URL ảnh poster xem trước từ video Cloudinary.
 * Ảnh poster sẽ tải nhanh hơn video, cải thiện trải nghiệm người dùng.
 * @param videoUrl URL video gốc
 * @param transformations Chuỗi biến đổi cho ảnh poster (ví dụ: "f_auto,q_auto:good,w_600,c_scale")
 * @returns URL của ảnh poster (.jpg)
 */
export const getCloudinaryPosterUrl = (
  videoUrl: string,
  transformations: string = "f_auto,q_auto:good,w_600,c_scale"
): string => {
  if (!videoUrl) return "https://placehold.co/600x400/374151/ffffff?text=Loading...";

  // --- SỬA LỖI ---
  // Kiểm tra xem đây có phải là URL Cloudinary không TRƯỚC KHI biến đổi
  if (!videoUrl.includes(CLOUDINARY_UPLOAD_MARKER)) {
    // Nếu không phải Cloudinary (ví dụ: YouTube), trả về một chuỗi rỗng.
    // Thẻ <video> sẽ không tải poster nào, thay vì tải một URL bị hỏng.
    return "";
  }
  // --- KẾT THÚC SỬA LỖI ---

  // 1. Áp dụng biến đổi (thêm so_1 để lấy khung hình ở 1 giây)
  const posterTransform = `${transformations},so_1`;
  const optimizedUrl = optimizeCloudinaryUrl(videoUrl, posterTransform);
  
  // 2. Đổi phần mở rộng file thành .jpg
  const lastDotIndex = optimizedUrl.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return optimizedUrl; // Trường hợp dự phòng
  }

  return `${optimizedUrl.substring(0, lastDotIndex)}.jpg`;
};