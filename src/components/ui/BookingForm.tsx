import React, { useState } from "react";
import { bookTour, type BookingRequest } from "../../services/booking.services";
import { toast } from "react-hot-toast";

interface BookingFormProps {
  tourId: string;
  userId: string | null;
  authenticated: boolean;
  onBooked: (data: any) => void;
}

// Regex patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(0[3|5|7|8|9])+([0-9]{8})$/; // Định dạng SĐT Việt Nam 10 số

export default function BookingForm({
  tourId,
  userId,
  authenticated,
  onBooked,
}: BookingFormProps) {
  const [form, setForm] = useState<BookingRequest>({
    tourId,
    userId,
    name: "",
    email: "",
    phone: "",
    address: "",
    numOfAdults: 1,
    numOfChildren: 0,
    bookingDate: new Date().toISOString().split("T")[0],
    promotionId: "",
  });

  // State lưu lỗi validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (key: keyof BookingRequest, value: any) => {
    setForm({ ...form, [key]: value });
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    // 1. Validate Số người lớn (Luôn bắt buộc)
    if (form.numOfAdults < 1) {
      newErrors.numOfAdults = "Cần ít nhất 1 người lớn";
      isValid = false;
    }

    // 2. Validate thông tin cá nhân (Nếu chưa đăng nhập)
    if (!authenticated) {
      if (!form.name.trim()) {
        newErrors.name = "Vui lòng nhập họ tên";
        isValid = false;
      }

      if (!form.email.trim()) {
        newErrors.email = "Vui lòng nhập email";
        isValid = false;
      } else if (!EMAIL_REGEX.test(form.email)) {
        newErrors.email = "Email không đúng định dạng";
        isValid = false;
      }

      if (!form.phone.trim()) {
        newErrors.phone = "Vui lòng nhập số điện thoại";
        isValid = false;
      } else if (!PHONE_REGEX.test(form.phone)) {
        newErrors.phone = "Số điện thoại không hợp lệ (10 số, đầu số VN)";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    console.log("Submitting booking form:", form);

    try {
      const res = await bookTour(form);
      toast.success("Đặt tour thành công!");
      onBooked(res);
    } catch (err: any) {
      console.error("Error booking tour:", err);
      toast.error(
        err?.response?.data?.message || "Đặt tour thất bại. Vui lòng thử lại!"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!authenticated && (
        <>
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Họ tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="0912345678"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={`w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Số người lớn */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Người lớn <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={form.numOfAdults}
            onChange={(e) =>
              handleChange("numOfAdults", Number(e.target.value))
            }
            className={`w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 ${
              errors.numOfAdults ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.numOfAdults && (
            <p className="text-red-500 text-xs mt-1">{errors.numOfAdults}</p>
          )}
        </div>

        {/* Trẻ em */}
        <div>
          <label className="block text-sm font-medium mb-1">Trẻ em</label>
          <input
            type="number"
            min={0}
            value={form.numOfChildren}
            onChange={(e) =>
              handleChange("numOfChildren", Number(e.target.value))
            }
            className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 border-gray-300"
          />
        </div>
      </div>

      {/* Địa chỉ */}
      <div>
        <label className="block text-sm font-medium mb-1">Địa chỉ</label>
        <input
          type="text"
          placeholder="Số nhà, đường, phường/xã..."
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 border-gray-300"
        />
      </div>

      {/* Mã giảm giá */}
      <div>
        <label className="block text-sm font-medium mb-1">Mã khuyến mãi</label>
        <input
          type="text"
          placeholder="Nhập mã nếu có"
          value={form.promotionId}
          onChange={(e) => handleChange("promotionId", e.target.value)}
          className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 border-gray-300"
        />
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 shadow-md mt-2 transition-all"
      >
        Tiếp tục
      </button>
    </form>
  );
}